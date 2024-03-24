import { ReactNode, useEffect, useState } from 'react';
import { IUser } from '../types';
import AuthContext from '../contexts/AuthContext';
import { readUser } from '../api';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    readUser()
      .then(setUser)
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
