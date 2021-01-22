import React from 'react';
import { getSample } from './api/sample';
import logo from './logo.svg';
import './App.css';
import { useQuery } from 'react-query';

function App() {
  const { data } = useQuery('sample', getSample);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>This is fetched from the backend: <pre>{data}</pre></p>
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
