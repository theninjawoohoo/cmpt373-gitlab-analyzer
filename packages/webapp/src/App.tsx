import React from 'react';
import './App.css';
import { Router } from './components/Router';
import ThemeProvider from './components/ThemeProvider';
import { AuthContextProvider } from './contexts/AuthContext';
import NavBar from './components/NavBar';

const App = () => {
  return (
    <NavBar>
    </NavBar>
  );
};

export default App;
