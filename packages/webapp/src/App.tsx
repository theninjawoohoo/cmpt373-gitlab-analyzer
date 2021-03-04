import React from 'react';
import './App.css';
import { Router } from './components/Router';
import ThemeProvider from './components/ThemeProvider';
import { AuthContextProvider } from './contexts/AuthContext';
import { RepositoryContextProvider } from './contexts/RepositoryContext';
import { DateFilterContextProvider } from './contexts/DateFilterContext';

const App = () => {
  return (
    <AuthContextProvider>
      <RepositoryContextProvider>
        <DateFilterContextProvider>
          <ThemeProvider>
            <Router />
          </ThemeProvider>
        </DateFilterContextProvider>
      </RepositoryContextProvider>
    </AuthContextProvider>
  );
};

export default App;
