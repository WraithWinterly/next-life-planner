import { EverydayTask } from '@prisma/client';

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

export const postEverydayTasks = async (
  postData: any
): Promise<EverydayTask> => {
  const { data } = await apiHandler.post('/api/v1/post/everydayTask', postData);
  return data.content as EverydayTask;
};
