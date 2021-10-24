import React from 'react';
import './App.css';
import { useStore } from 'effector-react';
import { $repositoryStore, repositoriesRequested } from './model/repository';

function App() {
  const repositories = useStore($repositoryStore);

  const downloadRepositories = () => {
    repositoriesRequested();
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
