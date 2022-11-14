import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

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

  const id = req.body as string;

  const taskData = await prisma?.task.findUnique({
    where: {
      id: id,
    },
  });

  if (!taskData) {
    res.status(400).send({ message: 'Task name is required' });
    return;
  }

  if (taskData?.userId !== session?.user.id) {
    res.status(401).send({
      message: 'You are not authorized to edit this task.',
    });
    return;
  }

  const task = await prisma?.task.delete({
    where: {
      id: id,
    },
  });

  return res.send({
    content: task,
  });
}
5;
