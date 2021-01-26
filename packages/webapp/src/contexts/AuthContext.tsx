import React, { useEffect, useReducer, useContext } from 'react';
import { getProfile } from '../api/user';
import User from '../types/User';
import axios from '../util/axios';

interface SetUserAction {
  type: 'SET_USER';
  user: User | undefined;
}

interface SaveTokenAction {
  type: 'SAVE_TOKEN';
  token: string;
}

interface LogoutAction {
  type: 'LOGOUT';
}

type Action = SetUserAction | SaveTokenAction | LogoutAction;

type State = {
  user?: User;
};

const AuthContext = React.createContext<{ state: State, dispatch: React.Dispatch<Action> } | undefined>(undefined);
const initialState: State = { user: undefined };

const authReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'SAVE_TOKEN':
      localStorage.setItem('access_token', action.token);
      return state;
    case 'LOGOUT':
      localStorage.removeItem('access_token');
      return { ...state, user: undefined };
    default:
      return state;
  }
}

export const AuthContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    async function fetchProfileFromStorage() {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
        try {
          const profile = await getProfile();
          dispatch({
            type: 'SET_USER',
            user: profile,
          })
        } catch (e) {
          localStorage.removeItem('access_token');
        }
      }
    }
    void fetchProfileFromStorage();
  }, [dispatch])
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Do not use outside <AuthProvider>');
  }
  return context;
}
