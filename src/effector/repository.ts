import { useStore } from 'effector-react';
import { createFetchToolkit } from './utils';

interface Repository {
    name: string;
}

export const [
    $repositoryStore,
    repositoriesRequested
] = createFetchToolkit<Repository[]>('https://api.github.com/repositories', []);

export const useRepositories = () => {
    const repositoriesStore = useStore($repositoryStore);

    return {
        repositoriesStore,
        repositoriesRequested,
    };
};
