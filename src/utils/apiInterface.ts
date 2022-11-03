import { DayTask, EverydayTask } from '@prisma/client';

import apiResolver from './apiResolver';

export const getEverydayTaskById = async (
  id: string
): Promise<EverydayTask> => {
  const data = await apiResolver.post('/api/v1/post/getEverydayTaskById', {
    id: id,
  });
  return data.content as EverydayTask;
};

export const getDayTaskById = async (id: string): Promise<DayTask> => {
  const data = await apiResolver.post('/api/v1/post/getDayTaskById', {
    id: id,
  });
  return data.content as DayTask;
};

export const getTasks = async (
  type: 'EverydayTask' | 'DayTask'
): Promise<DayTask[] | EverydayTask[]> => {
  const data = await apiResolver.post('/api/v1/post/getTasks', {
    type,
  });
  return data.content as DayTask[] | EverydayTask[];
};

export const postEverydayTask = async (
  postData: any
): Promise<EverydayTask> => {
  const data = await apiResolver.post('/api/v1/post/everydayTask', postData);
  return data.content as EverydayTask;
};

export const postDayTask = async (postData: any): Promise<DayTask> => {
  const data = await apiResolver.post('/api/v1/post/dayTask', postData);
  return data.content as DayTask;
};

export const updateEverydayTaskById = async (
  postData: any
): Promise<EverydayTask> => {
  const data = await apiResolver.post(
    '/api/v1/post/updateEverydayTaskById',
    postData
  );
  return data.content as EverydayTask;
};

export const updateDayTaskById = async (
  postData: any
): Promise<EverydayTask> => {
  const data = await apiResolver.post(
    '/api/v1/post/updateDayTaskById',
    postData
  );
  return data.content as DayTask;
};
