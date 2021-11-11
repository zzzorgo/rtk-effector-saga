import { createEffect, createEvent, createStore, Effect, guard } from 'effector';

type Status = 'loading' | 'unsent' | 'success' | 'error';

type Filter = Parameters<typeof guard>[0]['filter'];

export function createFetchToolkitEvery<T, P extends BodyInit>(url: string, initialStateData: T) {
    const fetchFx = createFetchEffect<T, P>(url);
    return createFetchToolkit<T, P>(initialStateData, fetchFx, () => true);
}

export function createFetchToolkitLatest<T, P extends BodyInit>(url: string, initialStateData: T) {
    const fetchFx = createFetchEffect<T, P>(url);
    return createFetchToolkit<T, P>(initialStateData, fetchFx, fetchFx.pending.map(isPending => !isPending));
}

export function createFetchEffect<T, P extends BodyInit>(url: string) {
    const fetchFx = createEffect(async (payload: P) => {
        const response = await fetch(url, { body: payload });
        const data: unknown = await response.json();

        if (response.status >= 400) {
            throw new Error('network error');
        }

        return data as T;
    });

    return fetchFx;
}

export function createFetchToolkit<T, P extends BodyInit>(initialStateData: T, fetchFx: Effect<P, T, Error>, filter: Filter) {
    const request = createEvent<P>();

    const store = createStore({ status: 'unsent' as Status, data: initialStateData})
        .on(fetchFx.done, (_, { result }) => ({
            status: 'success',
            data: result,
        }))
        .on(fetchFx.fail, (prevState, error) => {
            console.error(error.error);

            return ({
                ...prevState,
                status: 'error'
        })})
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
