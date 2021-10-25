import { configureStore } from '@reduxjs/toolkit';
import { repositoryReducer } from './repository';
import { combineReducers } from 'redux';

const appReducer = combineReducers({
    repository: repositoryReducer,
    // more reducers here
});

export const store = configureStore({ reducer: appReducer})

export type RootState = ReturnType<typeof appReducer>;

