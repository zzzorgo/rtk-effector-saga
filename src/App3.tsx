import React from 'react';
import './App.css';
import { useRepositories } from './saga/repository';

export function App3() {
  const { repositories, requestRepositories } = useRepositories();

  const downloadRepositories = () => {
    requestRepositories();
  };


  return (
    <div className="App">
        <button onClick={downloadRepositories}>download</button>
        {repositories.status === 'loading' && 'loading'}
        {repositories.status === 'error' && 'error'}
        {repositories.status === 'success' && repositories.data.map(s => s.name)}
    </div>
  );
}
