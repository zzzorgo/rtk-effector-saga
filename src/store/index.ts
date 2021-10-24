import { configureStore } from '@reduxjs/toolkit';
import { repositoryReducer } from './slice';
import { combineReducers } from 'redux';

const appReducer = combineReducers({
    repository: repositoryReducer,
});

export const store = configureStore({ reducer: appReducer})

export type RootState = ReturnType<typeof appReducer>;

