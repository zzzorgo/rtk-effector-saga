import { createEffect, createEvent, createStore, forward } from 'effector';

interface Repository {
    name: string;
}

interface State {
    status: 'loading' | 'unsent' | 'success' | 'error',
    data: Repository[],
}

const initialState: State = {
    data: [],
    status: 'unsent',
};

export const requestedRepositories = createEvent();

export const fetchRepositoriesFx = createEffect(async () => {
    const response = await fetch('https://api.github.com/repositories');
    const repositories = await response.json();

    if (response.status >= 400) {
        throw new Error('network error');
    }

    return repositories;
});

export const $repositories = createStore(initialState)
    .on(fetchRepositoriesFx.done, (_, { result }) => ({
        status: 'success',
        data: result,
    }))
    .on(fetchRepositoriesFx.fail, (prevState) => ({
        ...prevState,
        status: 'error'
    }))
    .on(requestedRepositories, (prevState) => ({
        ...prevState,
        status: 'loading'
    }));

forward({
    from: requestedRepositories,
    to: fetchRepositoriesFx,
});
