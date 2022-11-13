import { Task, TaskType } from '@prisma/client';
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

const api = {
  getTasks: async (): Promise<Task[]> => {
    const response = await apiResolver.get('/api/v1/getTasks');
    console.log(response);
    return response.data.content as Task[];
  },
  getTaskById: async (id: string): Promise<Task> => {
    const postData: GetTaskById = {
      id: id,
    };

    const response = await apiResolver.post('/api/v1/getTaskById', postData);
    return response.content as Task;
  },
  createTask: async (postData: APICreateTask): Promise<Task> => {
    const response = await apiResolver.post('/api/v1/createTask', postData);
    return response.content as Task;
  },
  updateTaskById: async (postData: any): Promise<Task> => {
    const response = await apiResolver.post('/api/v1/updateTaskById', postData);
    return response.content as Task;
  },
};

interface UserContextI {
  api: typeof api;
  signedIn: boolean;
  refetch: boolean;
  setRefetch: Dispatch<SetStateAction<boolean>>;
}

const Context = createContext<UserContextI>({
  // Default values
  api: api,
  signedIn: false,
  refetch: true,
  setRefetch: () => {},
});

const UserContext = ({ children }: { children: ReactNode }) => {
  const [refetch, setRefetch] = useState(true);

  const nextAuthSession = useSession();

  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(nextAuthSession.status === 'authenticated');
  }, [nextAuthSession]);

  const exposed = {
    api,
    signedIn,
    refetch,
    setRefetch,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUserContext = () => useContext(Context);

export default UserContext;
