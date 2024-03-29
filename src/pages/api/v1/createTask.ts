import { getServerSession } from 'next-auth/next';
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
    const session = await getServerSession(req, res, authOptions);

    requirePost(req);
    requireSignIn(session);

    const data = req.body as Task;

    let fixedData = ensureProperTaskData(data) as Task;

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
