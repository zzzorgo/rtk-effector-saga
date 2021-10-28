import React from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ReactQueryClientProvider } from './client';
import { Repository, useRepositoriesQuery } from "./repository";
import { api } from "./api";
import { useQuery } from "react-query";

function Repositories() {
  // const query = useRepositoriesQuery();

  const query = useQuery('repositories', () => api.get<Repository[]>('https://api.github.com/repositories'));

  return (
    <div className="App" style={{ opacity: query.isFetching ? 0.5 : 1 }}>
      <button onClick={() => query.refetch()}>refetch</button>
      {/*<button onClick={() => queryClient.invalidateQueries('repositories')}>invalidate</button>*/}
      {query.status === 'loading' && 'loading'}
      {query.status === 'error' && 'error'}
      {query.status === 'success' && query.data.map(s => s.name)}
    </div>
  );
}

export const App = () => {
  return (
    <ReactQueryClientProvider>
      <Repositories />
      {/*<Repositories />*/}
      <ReactQueryDevtools />
    </ReactQueryClientProvider>
  )
};
