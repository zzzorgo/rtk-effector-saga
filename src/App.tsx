import React from 'react';
import './App.css';
import { $repositories, requestedRepositories } from './model';
import { useStore } from 'effector-react';

function App() {
  const repositories = useStore($repositories);

  const downloadRepositories = () => {
    requestedRepositories();
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

export default App;
