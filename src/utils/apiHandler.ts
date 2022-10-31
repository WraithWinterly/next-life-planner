import { DayTask, EverydayTask } from '@prisma/client';

interface APIHandler {
  post: (apiPoint: string, postData: any) => Promise<any>;
  get: (apiPoint: string) => Promise<any>;
}

const apiHandler: APIHandler = {
  post: async (apiPoint: string, postData: any) => {
    try {
      const response = await fetch(apiPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      return { data };
    } catch (error) {
      console.log(error);
    }
  },
  get: async (apiPoint: string) => {
    const response = await fetch(apiPoint);
    const data = await response.json();

    return { data };
  },
};

export const getEveryDayTasks = async (): Promise<EverydayTask[]> => {
  const { data } = await apiHandler.get('/api/v1/get/everydayTasks');
  return data.content as EverydayTask[];
};

export const getEverydayTaskById = async (
  id: string
): Promise<EverydayTask> => {
  const { data } = await apiHandler.post('/api/v1/post/getEverydayTaskById', {
    id: id,
  });
  return data.content as EverydayTask;
};

export const getDayTasks = async (): Promise<EverydayTask[]> => {
  const { data } = await apiHandler.get('/api/v1/get/dayTasks');
  return data.content as DayTask[];
};

export const postEverydayTask = async (
  postData: any
): Promise<EverydayTask> => {
  const { data } = await apiHandler.post('/api/v1/post/everydayTask', postData);
  return data.content as EverydayTask;
};
export const updateEverydayTaskById = async (
  postData: any
): Promise<EverydayTask> => {
  const { data } = await apiHandler.post(
    '/api/v1/post/updateEverydayTaskById',
    postData
  );
  return data.content as EverydayTask;
};

export const postDayTask = async (postData: any): Promise<EverydayTask> => {
  const { data } = await apiHandler.post('/api/v1/post/dayTask', postData);
  return data.content as EverydayTask;
};
