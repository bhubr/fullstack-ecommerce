import { createContext } from 'react';
import { IUserWithCart } from '../types';

const AuthContext = createContext<{
  user: IUserWithCart | null;
  setUser: React.Dispatch<React.SetStateAction<IUserWithCart | null>>;
}>({
  user: null,
  setUser: () => {},
});

export default AuthContext;
