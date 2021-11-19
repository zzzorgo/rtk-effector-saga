import { call, put, takeEvery, takeLatest } from '@redux-saga/core/effects';
import { createSlice, CreateSliceOptions, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import { castDraft } from 'immer';

export type FetchedState<T> = {
    status: Status;
    data: T;
};

export type Status = 'loading' | 'unsent' | 'success' | 'error';

interface SagaOptions {
    url: string;
    takeEffect?: typeof takeEvery | typeof takeLatest;
}

export function createSagaSlice<State extends FetchedState<State['data']>, CaseReducers extends SliceCaseReducers<State>, Name extends string = string>(
    options: CreateSliceOptions<State, CaseReducers, Name>,
    sagaOptions: SagaOptions
) {
    const slice = createSlice({
        ...options,
        reducers: {
            ...options.reducers,
            requestData: (draft) => {
                draft.status = 'loading';
            },
            requestDataSuccess: (draft, action: PayloadAction<State['data']>) => {
                // @ts-ignore
                draft.data = castDraft(action.payload);
                draft.status = 'success';
            },
            requestDataError: (draft) => {
                draft.status = 'error';
            },
        }
    });

    const { takeEffect = takeEvery, url } = sagaOptions;

    function* saga() {
        yield takeEffect(`${options.name}/requestData`, function*(action) {
            try {
                const data: State['data'] = yield call(fetchData, url);
                // @ts-ignore
                yield put(slice.actions.requestDataSuccess(data));
            } catch(error) {
                console.error(error);
                // @ts-ignore
                yield put(slice.actions.requestDataError());
            }
        });
    }

    return { ...slice, saga };
}

export async function fetchData<T>(url: string) {
    const response = await fetch(url);
    const data: T = await response.json();

    if (response.status >= 400) {
        throw new Error('network error');
    }

    return data;
}
