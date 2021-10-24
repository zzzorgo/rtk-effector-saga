import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import { castDraft } from 'immer';

export type FetchedState<T> = {
    status: Status;
    data: T;
};

export type Status = 'loading' | 'unsent' | 'success' | 'error';

export const defaultBuilder = <Returned, ThunkArg, ThunkApiConfig>(
    builder: ActionReducerMapBuilder<FetchedState<Returned>>,
    fetchEntity: AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
) => {
    builder
        .addCase(fetchEntity.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchEntity.rejected, (state) => {
            state.status = 'error';
        })
        .addCase(fetchEntity.fulfilled, (state, { payload }) => {
            state.data = castDraft(payload);
            state.status = 'success';
        });
    }

export async function fetchData<T>(url: string) {
    const response = await fetch(url);
    const data: T = await response.json();

    if (response.status >= 400) {
        throw new Error('network error');
    }

    return data;
}
