import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../constants';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    setIsAuthenticated(!!newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    isLoading,
    updateUser,
    isAdmin,
  };
}; 