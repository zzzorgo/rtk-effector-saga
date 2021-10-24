import { createFetchToolkit } from './createFetchToolkit';

interface Repository {
    name: string;
}

export const [
    $repositoryStore,
    repositoriesRequested
] = createFetchToolkit<Repository[]>('https://api.github.com/repositories', []);
