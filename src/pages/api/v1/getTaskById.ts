import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import type { NextApiRequest, NextApiResponse } from 'next';
import { Task } from '@prisma/client';
import { requirePost, requireSignIn } from '@/src/utils/apiUtils';

export interface GetTaskById {
  type: 'DayTask' | 'EverydayTask';
  id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    requirePost(req);
    requireSignIn(session);

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
      include: {
        everydayCompletedDates: true,
      },
    });

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
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message });
  }
}
