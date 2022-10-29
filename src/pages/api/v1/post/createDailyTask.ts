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
    res.status(405).send({ message: 'Only POST requests allowed.' });
    return;
  }

  const data = req.body[0] as EverydayTask;
  console.log(data);
  if (!data.name || !data.description) {
    res.status(400).send({ message: 'Name and description is required.' });
    return;
  }

  // Create everydaytask and connect to user
  const task = await prisma?.everydayTask.create({
    data: data,
  });

  const updatedUser = await prisma?.user.update({
    where: {
      id: session?.user.id,
    },
    data: {
      everydayTasks: {
        connect: {
          id: task?.id,
        },
      },
    },
    include: {
      everydayTasks: true,
    },
  });

  if (session) {
    return res.send({
      content: task,
    });
  }

  res.send({
    error: 'You must be signed in to view the protected content on this page.',
  });
}
5;
