import { createFetchToolkit } from './utils';

interface Repository {
    name: string;
}

export const [
    repositoriesStore,
    repositoriesRequested
] = createFetchToolkit<Repository[]>('https://api.github.com/repositories', []);

export const useRepositories = () => {
    return {
        repositoriesStore,
        repositoriesRequested,
    };
};
