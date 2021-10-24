import React from 'react';
import './App.css';
import { useRepositories } from './effector/repository';

function App() {
  const { repositoriesStore, repositoriesRequested } = useRepositories();

  const downloadRepositories = () => {
    repositoriesRequested();
  };

  return (
    <div className="App">
        <button onClick={downloadRepositories}>download</button>
        {repositoriesStore.status === 'loading' && 'loading'}
        {repositoriesStore.status === 'error' && 'error'}
        {repositoriesStore.status === 'success' && repositoriesStore.data.map(s => s.name)}
    </div>
  );
}

export default App;
