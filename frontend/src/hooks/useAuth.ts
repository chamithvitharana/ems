import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  }, []);

  const getRole = () => localStorage.getItem('userRole')!;
  const getUser = () => JSON.parse(localStorage.getItem('user')!);

  return { isAuthenticated, getUser, getRole };
}
