import React from 'react';
import './App.css';
import { Router } from './components/Router';
import ThemeProvider from './components/ThemeProvider';
import { AuthContextProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthContextProvider>
      <ThemeProvider>
        <Router/>
      </ThemeProvider>
    </AuthContextProvider>
  );
};

export default App;
