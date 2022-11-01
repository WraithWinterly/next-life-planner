// This is an example of to protect an API route
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

import { DayTask } from '@prisma/client';

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

  const data = req.body[0] as DayTask;

  if (!data.name) {
    res.status(400).send({ message: 'Task name is required' });
    return;
  }
  if (!data.id) {
    res.status(400).send({ message: 'Invalid Task' });
    return;
  }

  if (data?.userId !== session?.user.id) {
    res.status(401).send({
      message: 'You are not authorized to edit this task.',
    });
    return;
  }

  data.name = data.name.trim();

  data.name = data.name.substring(0, 50);

  if (!!data.description) {
    data.description = data.description.trim();
    data.description = data.description.substring(0, 400);
  }

  const task = await prisma?.dayTask.update({
    where: {
      id: data.id,
    },
    data: data,
  });

  return res.send({
    content: task,
  });
}
5;
