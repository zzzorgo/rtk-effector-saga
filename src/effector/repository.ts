import { useStore } from 'effector-react';
import { createFetchToolkitLatest } from './utils';

interface Repository {
    name: string;
}

export const [
    $repositoryStore,
    repositoriesRequested
] = createFetchToolkitLatest<Repository[], string>('https://api.github.com/orgs/facebook/repos', []);

export const useRepositories = () => {
    const repositoriesStore = useStore($repositoryStore);

    return {
        repositoriesStore,
        repositoriesRequested,
    };
};
