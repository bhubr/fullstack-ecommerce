import { ReactNode, useEffect, useState } from 'react';
import { IUserWithCart } from '../types';
import AuthContext from '../contexts/AuthContext';
import { readUser, signout } from '../api';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUserWithCart | null>(null);
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

  const signoutUser = async () => {
    await signout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser, signout: signoutUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
