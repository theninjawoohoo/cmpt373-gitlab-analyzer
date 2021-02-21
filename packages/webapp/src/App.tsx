import React from 'react';
import './App.css';
import { Router } from './components/Router';
import ThemeProvider from './components/ThemeProvider';
import { AuthContextProvider } from './contexts/AuthContext';
import { RepositoryContextProvider } from './contexts/RepositoryContext';
const App = () => {
  return (
    <AuthContextProvider>
      <RepositoryContextProvider>
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      </RepositoryContextProvider>
    </AuthContextProvider>
  );
};

export default App;
