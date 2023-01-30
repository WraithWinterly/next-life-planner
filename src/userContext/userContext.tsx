import { EverydayCompletedDate, Task, TaskType } from '@prisma/client';
import { useSession } from 'next-auth/react';
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  APICreateTask,
  APIToggleCompletionTaskById,
  GetTaskById,
} from '../pages/api/v1/types';
import { TaskWithDates } from '../types/types';
import apiResolver from '../utils/apiResolver';
import { formatDate, FormatType } from '../utils/dateHelper';

interface UserContextI {
  getTasks: () => Promise<TaskWithDates[] | null | undefined>;
  getTaskById: (id: string) => Promise<TaskWithDates | null>;
  createTask: (task: APICreateTask) => Promise<TaskWithDates | null>;
  updateTask: (task: TaskWithDates) => Promise<TaskWithDates | null>;
  deleteTaskById: (id: string) => Promise<TaskWithDates | null>;
  toggleCompletionTask: (
    id: string,
    taskChecked: boolean,
    targetDate: Date | undefined
  ) => Promise<boolean | null>;
  tasks: TaskWithDates[] | null | undefined;
  signedIn: boolean;
}

const Context = createContext<UserContextI>({
  // Default values
  getTasks: async () => null,
  getTaskById: async (id: string) => null,
  createTask: async (task: APICreateTask) => null,
  updateTask: async (task: Task) => null,
  deleteTaskById: async (id: string) => null,
  toggleCompletionTask: async (
    id: string,
    taskChecked: boolean,
    targetDate?: Date
  ) => null,
  tasks: null,
  signedIn: false,
});

export interface CreateTaskData {
  name: string;
  description?: string;
  taskType?: TaskType;
}

const UserContext = ({ children }: { children: ReactNode }) => {
  const nextAuthSession = useSession();

  const [signedIn, setSignedIn] = useState(false);

  const [tasks, setTasks] = useState<TaskWithDates[]>();

  const getTasks = async (): Promise<TaskWithDates[]> => {
    const response = await apiResolver.get('/api/v1/getTasks');
    setTasks(response.data.content as TaskWithDates[]);

    return response.data.content as TaskWithDates[];
  };

  const getTaskById = async (id: string): Promise<TaskWithDates> => {
    const postData: GetTaskById = {
      id: id,
    };

    const response = await apiResolver.post('/api/v1/getTaskById', postData);
    return response.content as TaskWithDates;
  };

  const createTask = async (
    postData: CreateTaskData
  ): Promise<TaskWithDates> => {
    const response = await apiResolver.post('/api/v1/createTask', postData);
    setTasks((tasks) => [response.content as TaskWithDates, ...(tasks || [])]);
    return response.content as TaskWithDates;
  };

  const updateTask = async (postData: any): Promise<TaskWithDates> => {
    const response = await apiResolver.post('/api/v1/updateTaskById', postData);
    if (!!tasks) {
      setTasks((tasks) =>
        tasks!.map((task) =>
          task.id === postData.id ? (response.content as TaskWithDates) : task
        )
      );
    }
    return response.content as TaskWithDates;
  };

  const deleteTaskById = async (id: string): Promise<TaskWithDates | null> => {
    // delete task with this id
    setTimeout(() => {
      setTasks(
        (tasks) =>
          tasks!.filter((task) => task.id !== id) as TaskWithDates[] | undefined
      );
    }, 200);

    const response = await apiResolver.post('/api/v1/deleteTaskById', id);

    return response.content as TaskWithDates;
  };

  const toggleCompletionTask = async (
    id: string,
    taskChecked: boolean,
    targetDate?: Date
  ): Promise<boolean | null> => {
    let postData: APIToggleCompletionTaskById = {
      id: id,
      completed: taskChecked,
      targetDate,
    };
    const response = await apiResolver.post(
      '/api/v1/toggleCompletionTaskById',
      postData
    );
    if (!!response.content) {
      const task = tasks?.filter((task) => task.id === id)[0];
      if (taskChecked) {
        if (task?.taskType === TaskType.EVERYDAY) {
          task?.everydayCompletedDates.push({
            date: targetDate!.toISOString() as unknown as Date,
          } as EverydayCompletedDate);
          setTasks((tasks) =>
            tasks!.map((task) => {
              if (task.id === id) {
                task.everydayCompletedDates.push({
                  date: targetDate!,
                } as EverydayCompletedDate);
              }
              return task;
            })
          );
        } else {
          setTasks((tasks) =>
            tasks!.map((task) => {
              if (task.id === id) {
                task.completed = taskChecked;
              }
              return task;
            })
          );
        }
      } else {
        if (task?.taskType === TaskType.EVERYDAY) {
          setTasks((tasks) =>
            tasks!.map((task) => {
              if (task.id === id) {
                task.everydayCompletedDates =
                  task.everydayCompletedDates.filter(
                    (everydayCompletedDate: EverydayCompletedDate) =>
                      formatDate(
                        everydayCompletedDate.date,
                        FormatType.YEAR_MONTH_DAY
                      ) !== formatDate(targetDate!, FormatType.YEAR_MONTH_DAY)
                  );
              }
              return task;
            })
          );
        } else {
          setTasks((tasks) =>
            tasks!.map((task) => {
              if (task.id === id) {
                task.completed = taskChecked;
              }
              return task;
            })
          );
        }
      }
    }
    return response.content as boolean;
  };

  useEffect(() => {
    setSignedIn(nextAuthSession.status === 'authenticated');
  }, [nextAuthSession]);

  useEffect(() => {
    if (signedIn) {
      getTasks();
    }
  }, [signedIn]);

  const exposed = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTaskById,
    toggleCompletionTask,
    tasks,
    signedIn,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUserContext = () => useContext(Context);

export default UserContext;
