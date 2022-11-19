import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import type { NextApiRequest, NextApiResponse } from 'next';
import { requirePost, requireSignIn } from '@/src/utils/apiUtils';
import { TaskType } from '@prisma/client';
import { getDate } from 'date-fns';
import { APIToggleCompletionTaskById } from './types';
import { formatDate, FormatType } from '@/src/utils/dateHelper';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    requirePost(req);
    requireSignIn(session);

    const reqData = req.body as APIToggleCompletionTaskById;

    console.log(reqData);

    const taskData = await prisma?.task.findUnique({
      where: {
        id: reqData.id,
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

    if (taskData.taskType === TaskType.TODAY) {
      await prisma?.task.update({
        where: {
          id: reqData.id,
        },
        data: {
          completed: reqData.completed,
        },
      });
    }

    if (taskData.taskType === TaskType.EVERYDAY) {
      console.log(
        'Every day task pending update: ',
        taskData.everydayCompletedDates
      );
      if (reqData.completed) {
        await prisma?.task.update({
          where: {
            id: reqData.id,
          },
          data: {
            everydayCompletedDates: {
              push: reqData.targetDate,
            },
          },
        });
      } else {
        if (!reqData.targetDate) {
          throw new Error('No Target Date!');
        }
        await prisma?.task.update({
          where: {
            id: reqData.id,
          },
          data: {
            everydayCompletedDates: {
              set: taskData.everydayCompletedDates.filter(
                (date) =>
                  formatDate(date, FormatType.YEAR_MONTH_DAY) !==
                  formatDate(reqData.targetDate!, FormatType.YEAR_MONTH_DAY)
              ),
            },
          },
        });
      }
      console.log(
        'Every day task data updated: ',
        taskData.everydayCompletedDates
      );
    }

    return res.send({
      content: true,
    });
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message });
  }
}
