import { all } from 'redux-saga/effects';
import { repositoryReducer, repositorySaga } from './repository';
import { combineReducers } from 'redux';

import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

const appReducer = combineReducers({
    repository: repositoryReducer,
    // more reducers here
});

function* rootSaga() {
    yield all([
        repositorySaga(),
        // more sagas here
    ]);
}

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
    appReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof appReducer>;
