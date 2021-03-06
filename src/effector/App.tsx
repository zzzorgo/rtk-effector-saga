import React from 'react';
import { useRepositories } from './repository';

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
