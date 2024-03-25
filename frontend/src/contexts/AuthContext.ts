import { createContext } from 'react';
import { IUserWithCart } from '../types';

const AuthContext = createContext<{
  user: IUserWithCart | null;
  setUser: React.Dispatch<React.SetStateAction<IUserWithCart | null>>;
  refreshUser: () => Promise<void>;
  signout: () => Promise<void>;
}>({
  user: null,
  setUser() {},
  async refreshUser() {},
  async signout() {},
});

export default AuthContext;
