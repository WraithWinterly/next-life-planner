import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import { Task, TaskType } from '@prisma/client';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed.' });
    return;
  }

  if (!session) {
    res.status(401).send({
      message:
        'You must be signed in to view the protected content on this page.',
    });
    return;
  }

  const data = req.body as Task;
  console.log(req.body);
  data.name = data.name.trim();

  data.name = data.name.substring(0, 50);
  if (!!data.description) {
    data.description = data.description.trim();
    data.description = data.description.substring(0, 400);
  }

  if (!data.name) {
    res.status(400).send({ message: 'Task name is required' });
    return;
  }

  if (!data.taskType) {
    data.taskType = TaskType.TODAY;
  }

  // Create everydaytask and connect to user
  const task = await prisma?.task.create({
    data: data,
  });

  await prisma?.user.update({
    where: {
      id: session?.user.id,
    },
    data: {
      tasks: {
        connect: {
          id: task?.id,
        },
      },
    },
  });

  return res.send({
    content: task,
  });
}
5;
