import { createEffect, createEvent, createStore, Effect, forward, guard } from 'effector';

type Status = 'loading' | 'unsent' | 'success' | 'error';

type Filter = Parameters<typeof guard>[0]['filter'];

export function createFetchToolkitEvery<T>(url: string, initialStateData: T) {
    const fetchFx = createFetchEffect<T>(url);
    return createFetchToolkit(initialStateData, fetchFx, () => true);
}

export function createFetchToolkitLatest<T>(url: string, initialStateData: T) {
    const fetchFx = createFetchEffect<T>(url);
    return createFetchToolkit(initialStateData, fetchFx, fetchFx.pending.map(isPending => !isPending));
}

export function createFetchEffect<T>(url: string) {
    const fetchFx = createEffect(async () => {
        const response = await fetch(url);
        const data: unknown = await response.json();

        if (response.status >= 400) {
            throw new Error('network error');
        }

        return data as T;
    });

    return fetchFx;
}

export function createFetchToolkit<T>(initialStateData: T, fetchFx: Effect<void, T, Error>, filter: Filter) {
    const request = createEvent();

    const store = createStore({ status: 'unsent' as Status, data: initialStateData})
        .on(fetchFx.done, (_, { result }) => ({
            status: 'success',
            data: result,
        }))
        .on(fetchFx.fail, (prevState) => ({
            ...prevState,
            status: 'error'
        }))
        .on(request, (prevState) => ({
            ...prevState,
            status: 'loading'
        }));

    guard({
        source: request,
        filter: filter,
        target: fetchFx,
    });

    return [store, request] as const;
}
