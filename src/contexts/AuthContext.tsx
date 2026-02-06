'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/services/auth.service';
import { logoutAction } from '@/app/actions/auth';

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: async () => { },
  isLoading: true,
});

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  // If initialUser changes (e.g. revalidation), update state
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutAction();
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
