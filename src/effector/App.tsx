import React from 'react';
import { useRepositories } from './repository';
import { SubComponent } from './SubComponent';

function App() {
  const { repositoriesStore, repositoriesRequested } = useRepositories();

  const downloadRepositories = () => {
    repositoriesRequested('facebook');
  };

  return (
    <div className="App">
        <button onClick={downloadRepositories}>download</button>
        {repositoriesStore.status === 'loading' && 'loading'}
        {repositoriesStore.status === 'error' && 'error'}
        {repositoriesStore.status === 'success' && repositoriesStore.data.map(s => s.name)}
        <SubComponent />
    </div>
  );
}

export default App;
