import React, { useState } from 'react';
import { finishProblem, pause, start } from './timer';

export const TimerControls = () => {
    const [problemId, setProblemId] = useState(1);

    return (
        <div>
            <button onClick={() => start(problemId)}>start</button>
            <button onClick={() => pause()}>pause</button>
            <button onClick={() => {
                pause();
                start(problemId + 1);
                setProblemId((id) => id + 1);
            }}>restart</button>
            <button onClick={() => finishProblem()}>finish problem in store</button>
            <button>manually</button>
        </div>
    );
};
