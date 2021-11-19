import React from 'react';
import { Graph } from './graph/Graph';
import { useRepositories } from './repository';
import { SubComponent } from './SubComponent';
import { TimerControls } from './timer/TimerControls';

function App() {
  const { repositoriesStore, repositoriesRequested } = useRepositories();

  const downloadRepositories = () => {
    repositoriesRequested('facebook');
  };

  return (
    <div className="App">
        {/* <button onClick={downloadRepositories}>download</button>
        {repositoriesStore.status === 'loading' && 'loading'}
        {repositoriesStore.status === 'error' && 'error'}
        {repositoriesStore.status === 'success' && repositoriesStore.data.map(s => s.name)}
        <SubComponent /> */}
        {/* <TimerControls /> */}
        <Graph />
    </div>
  );
}

export default App;
