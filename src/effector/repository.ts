import { useStore } from 'effector-react';
import { createFetchToolkitLatest } from './utils';

interface Repository {
    name: string;
}

export const [
    $repositoryStore,
    repositoriesRequested
] = createFetchToolkitLatest<Repository[]>('https://api.github.com/repositories', []);

export const useRepositories = () => {
    const repositoriesStore = useStore($repositoryStore);

    return {
        repositoriesStore,
        repositoriesRequested,
    };
};
