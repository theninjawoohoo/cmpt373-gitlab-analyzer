import React from 'react';
import './App.css';
import { Router } from './components/Router';
import ThemeProvider from './components/ThemeProvider';
import { AuthContextProvider } from './contexts/AuthContext';
import { RepositoryContextProvider } from './contexts/RepositoryContext';
import { FilterContextProvider } from './contexts/FilterContext';

const App = () => {
  return (
    <AuthContextProvider>
      <RepositoryContextProvider>
        <FilterContextProvider>
          <ThemeProvider>
            <Router />
          </ThemeProvider>
        </FilterContextProvider>
      </RepositoryContextProvider>
    </AuthContextProvider>
  );
};

export default App;
