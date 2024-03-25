import { ReactNode, useEffect, useState } from 'react';
import { IUserWithCart } from '../types';
import AuthContext from '../contexts/AuthContext';
import { readUser, signout } from '../api';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUserWithCart | null>(null);
  const [prevUser, setPrevUser] = useState(user);
  const [loading, setLoading] = useState(true);

  const refreshUser = async (): Promise<void> =>
    readUser()
      .then(setUser)
      .finally(() => {
        setLoading(false);
      });

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    setPrevUser(user);
  }, [user]);

  const signoutUser = async () => {
    await signout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ prevUser, user, setUser, refreshUser, signout: signoutUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
