import { configureStore } from '@reduxjs/toolkit';
import { repositoryReducer } from './slice';
import { combineReducers } from 'redux';

export type Status = 'loading' | 'unsent' | 'success' | 'error';

const appReducer = combineReducers({
    repository: repositoryReducer,
});

export const store = configureStore({ reducer: appReducer})

export type RootState = ReturnType<typeof appReducer>;

export async function fetchData<T>(url: string) {
    const response = await fetch(url);
    const data: T = await response.json();

    if (response.status >= 400) {
        throw new Error('network error');
    }

    return data;
}

