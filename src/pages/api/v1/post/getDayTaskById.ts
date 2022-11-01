// This is an example of to protect an API route
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

import { EverydayTask } from '@prisma/client';

import type { NextApiRequest, NextApiResponse } from 'next';

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

  const data = req.body.id as string;

  if (!data) {
    res.status(400).send({ message: 'You need to specify an ID!' });
    return;
  }

  const task = await prisma?.dayTask.findUnique({
    where: {
      id: data,
    },
  });

  if (!task) {
    res.status(404).send({ message: 'Task not found!' });
    return;
  }

  if (task?.userId !== session?.user.id) {
    res.status(401).send({
      message: 'You are not authorized to view this task.',
    });
    return;
  }

  return res.send({
    content: task,
  });
}
5;
