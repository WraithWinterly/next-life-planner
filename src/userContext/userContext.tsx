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

interface UserContextI {
  signedIn: boolean;
  refetch: boolean;
  setRefetch: Dispatch<SetStateAction<boolean>>;
}

const Context = createContext<UserContextI>({
  // Default values
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
  }, [nextAuthSession])

  const exposed = {
    signedIn,
    refetch,
    setRefetch,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUserContext = () => useContext(Context);

export default UserContext;
