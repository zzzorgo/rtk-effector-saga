import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, RootState, Status } from '.';

interface Repository {
    name: string;
}

interface State {
    data: Repository[],
    status: Status;
};

const fetchRepositories = createAsyncThunk('repositories/fetch', async () => {
    return fetchData<Repository[]>('https://api.github.com/repositories');
});

const slice = createSlice({
    name: 'root',
    initialState: { status: 'unsent', data: [] } as State,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRepositories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRepositories.rejected, (state) => {
                state.status = 'error';
            })
            .addCase(fetchRepositories.fulfilled, (state, { payload }) => {
                state.data = payload;
                state.status = 'success';
            });
    }
});

export const { reducer: repositoryReducer } = slice;

export function useRepositories() {
    const dispatch = useDispatch();
    const repositories = useSelector((state: RootState) => state.repository);
    const requestRepositories = () => dispatch(fetchRepositories());

    return {repositories, requestRepositories};
}
