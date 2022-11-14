import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import { Task, TaskType } from '@prisma/client';

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

    let fixedData = ensureProperTaskData(data);

    // Create everydaytask and connect to user
    const task = await prisma?.task.create({
      data: fixedData,
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
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message });
  }
}
5;
