import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  ensureProperTaskData,
  requirePost,
  requireSignIn,
} from '@/src/utils/apiUtils';
import { TaskWithDates } from '@/src/types/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    requirePost(req);
    requireSignIn(session);

    const data = req.body as TaskWithDates;

    const taskData = await prisma?.task.findUnique({
      where: {
        id: data.id,
      },
      include: {
        everydayCompletedDates: true,
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

    const dataWithoutEverydayCompletedDates = {
      ...fixedData,
      everydayCompletedDates: undefined,
    };

    const task = await prisma?.task.update({
      where: {
        id: taskData.id,
      },
      include: {
        everydayCompletedDates: true,
      },
      data: {
        ...dataWithoutEverydayCompletedDates,
      },
    });

    return res.send({
      content: task,
    });
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message });
  }
}
