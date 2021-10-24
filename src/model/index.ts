import { createEffect, createEvent, createStore, forward } from 'effector';

interface Repository {
    name: string;
}

export const requestedRepositories = createEvent();

export const fetchRepositoriesFx = createEffect(async () => {
    const response = await fetch('https://api.github.com/repositories');
    const repositories = await response.json();

    if (response.status >= 400) {
        throw new Error('network error');
    }

    return repositories;
});

export const $repositories = createStore([] as Repository[])
    .on(fetchRepositoriesFx.done, (_, { result, params }) => result);

forward({
    from: requestedRepositories,
    to: fetchRepositoriesFx,
});

export const $errorLoadingRepositories = createStore(false)
    .on(fetchRepositoriesFx.fail, () => true);
