import { ReactNode, useEffect, useState } from 'react';
import { IUserWithCart } from '../types';
import AuthContext from '../contexts/AuthContext';
import { readUser, signout } from '../api';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUserWithCart | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    readUser()
      .then(setUser)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const signoutUser = async () => {
    await signout();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, setUser, signout: signoutUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
