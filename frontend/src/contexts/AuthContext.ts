import { createContext } from 'react';
import { IUser } from '../types';

const AuthContext = createContext<{
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}>({
  user: null,
  setUser: () => {},
});

export default AuthContext;
