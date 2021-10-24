import React from 'react';
import './App.css';
import { $errorLoadingRepositories, $repositories, fetchRepositoriesFx, requestedRepositories } from './model';
import { useStore } from 'effector-react';

function App() {
  const repositories = useStore($repositories);
  const errorLoadingRepositories = useStore($errorLoadingRepositories);
  const loading = useStore(fetchRepositoriesFx.pending);

  const downloadRepositories = () => {
    requestedRepositories();
  };

  return (
    <div className="App">
        <button onClick={downloadRepositories}>download</button>
        {loading && 'loading'}
        {errorLoadingRepositories && 'error'}
        {!loading && !errorLoadingRepositories && repositories.map(s => s.name)}
    </div>
  );
}

export default App;
