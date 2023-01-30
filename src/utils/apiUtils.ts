import { Task, TaskType } from '@prisma/client';
import { NextApiRequest } from 'next';
import { Session } from 'next-auth';
import { TaskWithDates } from '../types/types';

export const requirePost = (req: NextApiRequest) => {
  if (req.method !== 'POST') {
    throw new Error('Only POST requests allowed.');
  }
  return true;
};

export const requireSignIn = (session: Session | null) => {
  if (!session) {
    throw new Error('You must be signed in to view this page.');
  }
  return true;
};

export const ensureProperTaskData = (
  data: TaskWithDates | Task
): TaskWithDates | Task => {
  let fixedData = data;
  fixedData.name = fixedData.name.trim();
  fixedData.name = fixedData.name.substring(0, 50);

  if (!!fixedData.description) {
    fixedData.description = fixedData.description.trim();
    fixedData.description = fixedData.description.substring(0, 400);
  }

  if (!fixedData.name) {
    throw new Error('Task name is required');
  }

  if (!fixedData.taskType) {
    fixedData.taskType = TaskType.TODAY;
  }

  return fixedData;
};
