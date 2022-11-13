import { Task, TaskType } from '@prisma/client';

import apiResolver from './apiResolver';

import { GetTaskById } from '../pages/api/v1/types';

export const getTasks = async (): Promise<Task[]> => {
  const response = await apiResolver.get('/api/v1/getTasks');
  console.log(response);
  return response.data.content as Task[];
};

export const getTaskById = async (id: string): Promise<Task> => {
  const postData: GetTaskById = {
    id: id,
  };

  const response = await apiResolver.post('/api/v1/getTaskById', postData);
  return response.content as Task;
};

export interface CreateTaskData {
  name: string;
  description?: string;
  taskType?: TaskType;
}

export const createTask = async (postData: CreateTaskData): Promise<Task> => {
  console.log('post data');
  console.log(postData);
  const response = await apiResolver.post('/api/v1/createTask', postData);
  console.log(response);
  return response.content as Task;
};

export const updateTaskById = async (postData: any): Promise<Task> => {
  const response = await apiResolver.post(
    '/api/v1/post/updateTaskById',
    postData
  );
  return response.content as Task;
};
