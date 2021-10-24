import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '.';
import { defaultBuilder, fetchData, FetchedState } from './utils';

interface Repository {
    name: string;
}

const fetchRepositories = createAsyncThunk('repositories/fetch', async () => {
    return fetchData<Repository[]>('https://api.github.com/repositories');
});

const slice = createSlice({
    name: 'repository',
    initialState: { status: 'unsent', data: [] } as FetchedState<Repository[]>,
    reducers: {},
    extraReducers: (builder) => {
        defaultBuilder(builder, fetchRepositories);
    }
});

export const { reducer: repositoryReducer } = slice;

export function useRepositories() {
    const dispatch = useDispatch();
    const repositories = useSelector((state: RootState) => state.repository);
    const requestRepositories = () => dispatch(fetchRepositories());

    return {repositories, requestRepositories};
}
