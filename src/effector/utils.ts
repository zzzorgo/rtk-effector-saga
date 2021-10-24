import { createEffect, createEvent, createStore, forward } from 'effector';

type Status = 'loading' | 'unsent' | 'success' | 'error';

export function createFetchToolkit<T>(url: string, initialStateData: T) {
    const request = createEvent();

    const fetchFx = createEffect(async () => {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status >= 400) {
            throw new Error('network error');
        }

        return data;
    });

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

    forward({
        from: request,
        to: fetchFx,
    });

    return [store, request] as const;
}
