import { Task, TaskType } from '@prisma/client';
import { fetchData } from 'next-auth/client/_utils';
import { useSession } from 'next-auth/react';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  APICreateTask,
  APIToggleCompletionTaskById,
  GetTaskById,
} from '../pages/api/v1/types';
import apiResolver from '../utils/apiResolver';
import { formatDate, FormatType } from '../utils/dateHelper';

interface UserContextI {
  getTasks: () => Promise<Task[] | null>;
  getTaskById: (id: string) => Promise<Task | null>;
  createTask: (task: APICreateTask) => Promise<Task | null>;
  updateTask: (task: Task) => Promise<Task | null>;
  deleteTaskById: (id: string) => Promise<Task | null>;
  toggleCompletionTask: (
    id: string,
    taskChecked: boolean,
    targetDate: Date | undefined
  ) => Promise<boolean | null>;
  tasks: Task[] | null;
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

  const [tasks, setTasks] = useState<Task[] | null>(null);

  const getTasks = async (): Promise<Task[]> => {
    const response = await apiResolver.get('/api/v1/getTasks');
    setTasks(response.data.content as Task[]);

    return response.data.content as Task[];
  };

  const getTaskById = async (id: string): Promise<Task> => {
    const postData: GetTaskById = {
      id: id,
    };

    const response = await apiResolver.post('/api/v1/getTaskById', postData);
    return response.content as Task;
  };

  const createTask = async (postData: CreateTaskData): Promise<Task> => {
    const response = await apiResolver.post('/api/v1/createTask', postData);
    setTasks((tasks) => [...(tasks || []), response.content as Task]);
    return response.content as Task;
  };

  const updateTask = async (postData: any): Promise<Task> => {
    const response = await apiResolver.post('/api/v1/updateTaskById', postData);
    if (!!tasks) {
      setTasks((tasks) =>
        tasks!.map((task) =>
          task.id === postData.id ? (response.content as Task) : task
        )
      );
    }
    return response.content as Task;
  };

  const deleteTaskById = async (id: string): Promise<Task | null> => {
    const response = await apiResolver.post('/api/v1/deleteTaskById', id);
    // delete task with this id
    if (!!tasks) {
      setTasks((tasks) => tasks!.filter((task) => task.id !== id));
    }

    return response.content as Task;
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
      if (taskChecked) {
        // const task = tasks?.filter((task) => task.id === id)[0];
        // task?.everydayCompletedDates.push(
        //   targetDate!.toISOString() as unknown as Date
        // );
        // console.log(task?.everydayCompletedDates);
        // setTasks((tasks) => [...(tasks || []), task!]);

        setTasks((tasks) =>
          tasks!.map((task) => {
            if (task.id === id) {
              task.everydayCompletedDates.push(targetDate!);
            }
            return task;
          })
        );
      } else {
        // const task = tasks?.filter((task) => task.id === id)[0];

        // if (!!task && !!targetDate) {
        //   task.everydayCompletedDates = task.everydayCompletedDates.filter(
        //     (date) =>
        //       formatDate(date, FormatType.YEAR_MONTH_DAY) !==
        //       formatDate(targetDate!, FormatType.YEAR_MONTH_DAY)
        //   );
        // }

        // setTasks((tasks) => [...(tasks || []), task!]);

        setTasks((tasks) =>
          tasks!.map((task) => {
            if (task.id === id) {
              task.everydayCompletedDates = task.everydayCompletedDates.filter(
                (date) =>
                  formatDate(date, FormatType.YEAR_MONTH_DAY) !==
                  formatDate(targetDate!, FormatType.YEAR_MONTH_DAY)
              );
            }
            return task;
          })
        );
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
