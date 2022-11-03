// This is an example of to protect an API route
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

import { DayTask, EverydayTask } from '@prisma/client';

import type { NextApiRequest, NextApiResponse } from 'next';

interface GetTask {
  type: 'EverydayTask' | 'DayTask';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (req.method !== 'POST') {
    res
      .status(405)
      .send({ message: 'You need to send the type of task you want.' });
    return;
  }

  if (!session) {
    res.status(401).send({ message: 'You need to be authenticated.' });
    return;
  }

  const data = req.body as GetTask;
  let tasks: EverydayTask[] | DayTask[] | undefined;

  switch (data.type) {
    case 'EverydayTask':
      tasks = await prisma?.everydayTask.findMany({
        where: {
          userId: session?.user.id,
        },
      });
      return res.send({
        content: tasks,
      });
    case 'DayTask':
      tasks = await prisma?.dayTask.findMany({
        where: {
          userId: session?.user.id,
        },
      });
      return res.send({
        content: tasks,
      });
    default:
      tasks = undefined;
      return res.status(400).send({ message: 'Invalid task type.' });
  }
}
