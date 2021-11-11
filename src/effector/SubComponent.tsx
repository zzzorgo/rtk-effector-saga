import React from 'react';
import { useRepositories } from './repository';

export const SubComponent = () => {
    const { repositoriesStore, repositoriesRequested } = useRepositories();

    const downloadRepositories = () => {
        if (repositoriesStore.status === 'unsent') {
            repositoriesRequested('facebook');
        }
    };

    return (
        <button onClick={downloadRepositories}>sub download</button>
    );
};
