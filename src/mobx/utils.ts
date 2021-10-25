import { makeAutoObservable, runInAction } from 'mobx';

type Status = 'loading' | 'unsent' | 'success' | 'error';

export function createFetchToolkit<T>(url: string, initialStateData: T) {
    const store = new FetchStore(url, initialStateData);

    return [
        store,
        () => {
            store.fetchData().then(() => {})
        }
    ] as const;
}

class FetchStore<T> {
    data: T;
    status: Status = 'unsent';

    constructor(private url: string, initialStateData: T) {
        this.data = initialStateData;

        makeAutoObservable(this);
    }

    async fetchData() {
        try {
            this.status = 'loading';
            const data = await fetch(this.url).then(response => response.json());

            runInAction(() => {
                this.data = data;
                this.status = 'success';
            });
        } catch (e) {
            runInAction(() => {
                this.status = 'error';
            })
        }
    }
}
