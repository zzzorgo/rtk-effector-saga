import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { createSagaSlice, Status } from './utils';

interface Repository {
    name: string;
}

const slice = createSagaSlice({
    name: 'repository',
    initialState: { status: 'unsent' as Status, data: [] as Repository[] },
    reducers: {},
}, { url: 'https://api.github.com/repositories' });

export const { reducer: repositoryReducer, saga: repositorySaga } = slice;

export function useRepositories() {
    const dispatch = useDispatch();
    const repositories = useSelector((state: RootState) => state.repository);
    const requestRepositories = () => dispatch(slice.actions.requestData());

    return {repositories, requestRepositories};
}
