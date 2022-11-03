import { DayTask, EverydayTask } from '@prisma/client';

import apiResolver from './apiResolver';

export const getEveryDayTasks = async (): Promise<EverydayTask[]> => {
  const { data } = await apiResolver.get('/api/v1/get/everydayTasks');
  return data.content as EverydayTask[];
};

export const getEverydayTaskById = async (
  id: string
): Promise<EverydayTask> => {
  const { data } = await apiResolver.post('/api/v1/post/getEverydayTaskById', {
    id: id,
  });
  return data.content as EverydayTask;
};

export const getDayTaskById = async (id: string): Promise<DayTask> => {
  const { data } = await apiResolver.post('/api/v1/post/getDayTaskById', {
    id: id,
  });
  return data.content as DayTask;
};

export const getDayTasks = async (): Promise<DayTask[]> => {
  const { data } = await apiResolver.get('/api/v1/get/dayTasks');
  return data.content as DayTask[];
};

export const postEverydayTask = async (
  postData: any
): Promise<EverydayTask> => {
  const { data } = await apiResolver.post(
    '/api/v1/post/everydayTask',
    postData
  );
  return data.content as EverydayTask;
};

export const postDayTask = async (postData: any): Promise<DayTask> => {
  const { data } = await apiResolver.post('/api/v1/post/dayTask', postData);
  return data.content as DayTask;
};

export const updateEverydayTaskById = async (
  postData: any
): Promise<EverydayTask> => {
  const { data } = await apiResolver.post(
    '/api/v1/post/updateEverydayTaskById',
    postData
  );
  return data.content as EverydayTask;
};

export const updateDayTaskById = async (
  postData: any
): Promise<EverydayTask> => {
  const { data } = await apiResolver.post(
    '/api/v1/post/updateDayTaskById',
    postData
  );
  return data.content as DayTask;
};
