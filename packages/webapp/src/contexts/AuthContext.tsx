import React, { useEffect, useContext, useState, useMemo } from 'react';
import { useProfile } from '../api/user';
import { User } from '@ceres/types';
import axios from '../util/axios';
import { resetFilterStorage } from './FilterContext';
import { resetContextStorage } from './RepositoryContext';

export function useAuthContext() {
  return useContext(AuthContext);
}

function useAuthState(): AuthContextState {
  const { data: user, invalidate, remove } = useProfile();
  const [token, setToken] = useState<string>();
  useEffect(() => {
    void invalidate();
  }, [token]);
  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      login(savedToken);
      setToken(savedToken);
    }
  }, []);
  return useMemo(
    () => ({
      user,
      setToken: (token) => {
        login(token);
        setToken(token);
      },
      logout: () => {
        logout();
        setToken(null);
        void remove();
      },
    }),
    [user],
  );
}

interface AuthContextState {
  user?: User;
  setToken: (token: string) => void;
  logout: () => void;
}

const authContextDefault: AuthContextState = {
  setToken: () => null,
  logout: () => null,
};

const AuthContext = React.createContext<AuthContextState>(authContextDefault);

const LOCAL_STORAGE_KEY = 'access_token';

function getToken() {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

function login(token: string) {
  axios.defaults.headers['Authorization'] = `Bearer ${token}`;
  localStorage.setItem(LOCAL_STORAGE_KEY, token);
}

function logout() {
  axios.defaults.headers['Authorization'] = undefined;
  localStorage.clear();
  resetFilterStorage();
  resetContextStorage();
}

export const AuthContextProvider: React.FC = ({ children }) => {
  const value = useAuthState();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
