import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import type { NextApiRequest, NextApiResponse } from 'next';
import { Task } from '@prisma/client';

export interface GetTaskById {
  type: 'DayTask' | 'EverydayTask';
  id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST methods are allowed.' });
    return;
  }

  if (!session) {
    res.status(401).send({
      message:
        'You must be signed in to view the protected content on this page.',
    });
    return;
  }

  const data = req.body as GetTaskById;

  if (!data) {
    res.status(400).send({ message: 'You need to specify an ID!' });
    return;
  }

  let foundTask: Task | null | undefined;

  foundTask = await prisma?.task.findUnique({
    where: {
      id: data?.id,
    },
  });
  proceedAfterTaskFound();

  function proceedAfterTaskFound() {
    if (!foundTask) {
      res.status(404).send({ message: 'Task not found!' });
      return;
    }

    if (foundTask?.userId !== session?.user.id) {
      res.status(401).send({
        message: 'You are not authorized to view this task.',
      });
      return;
    }

    return res.send({
      content: foundTask,
    });
  }
}
