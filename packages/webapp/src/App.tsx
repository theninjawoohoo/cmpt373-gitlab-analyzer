import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery } from 'react-query';
import axios from './util/axios';

function App() {
  const { data: res } = useQuery('sample', async () => axios('/sample'));

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>This is fetch from the backend: {res?.data}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
