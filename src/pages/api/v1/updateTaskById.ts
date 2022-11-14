import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import { Task } from '@prisma/client';

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  ensureProperTaskData,
  requirePost,
  requireSignIn,
} from '@/src/utils/apiUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    requirePost(req);
    requireSignIn(session);

    const data = req.body as Task;

    const taskData = await prisma?.task.findUnique({
      where: {
        id: data.id,
      },
    });

    if (taskData?.userId !== session?.user.id) {
      res.status(401).send({
        message: 'You are not authorized to edit this task.',
      });
      return;
    }

    if (!taskData?.name) {
      res.status(400).send({ message: 'Task name is required' });
      return;
    }

    if (!taskData?.id) {
      res.status(400).send({ message: 'Invalid Task' });
      return;
    }

    const fixedData = ensureProperTaskData(data);

    const task = await prisma?.task.update({
      where: {
        id: taskData.id,
      },
      data: fixedData,
    });

    return res.send({
      content: task,
    });
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message });
  }
}
