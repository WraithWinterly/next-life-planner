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
import { APICreateTask, GetTaskById } from '../pages/api/v1/types';
import apiResolver from '../utils/apiResolver';

interface UserContextI {
  getTasks: () => Promise<Task[] | null>;
  getTaskById: (id: string) => Promise<Task | null>;
  createTask: (task: APICreateTask) => Promise<Task | null>;
  updateTask: (task: Task) => Promise<Task | null>;
  deleteTaskById: (id: string) => Promise<Task | null>;
  toggleCompletionTaskById: (id: string) => Promise<boolean | null>;
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
  toggleCompletionTaskById: async (id: string) => null,
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
    await getTasks();
    return response.content as Task;
  };

  const updateTask = async (postData: any): Promise<Task> => {
    const response = await apiResolver.post('/api/v1/updateTaskById', postData);
    await getTasks();
    return response.content as Task;
  };

  const deleteTaskById = async (id: string): Promise<Task | null> => {
    const response = await apiResolver.post('/api/v1/deleteTaskById', id);
    await getTasks();
    return response.content as Task;
  };

  const toggleCompletionTaskById = async (
    id: string
  ): Promise<boolean | null> => {
    const response = await apiResolver.post(
      '/api/v1/toggleCompletionTaskById',
      id
    );
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
    toggleCompletionTaskById,
    tasks,
    signedIn,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUserContext = () => useContext(Context);

export default UserContext;
