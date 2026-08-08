import { createContext, useEffect, useState, useCallback } from 'react';
import {
  getSession,
  loginUser,
  registerUser,
  logoutUser,
  updateProfile,
} from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getSession());
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const loggedInUser = await loginUser(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (details) => {
    const newUser = await registerUser(details);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const updateCurrentUser = useCallback(
    async (updates) => {
      if (!user) return;
      const updated = await updateProfile(user.id, updates);
      setUser(updated);
      return updated;
    },
    [user]
  );

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
    updateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
