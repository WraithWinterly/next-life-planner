import { TaskType } from '@prisma/client';

export interface GetTaskById {
  id: string;
}

export interface APICreateTask {
  name: string;
  description?: string;
  taskType?: TaskType;
}