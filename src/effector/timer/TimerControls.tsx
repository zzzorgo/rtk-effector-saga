import React, { useState } from 'react';
import { stop, start, finishProblem, updateManually } from './timer';

export const TimerControls = () => {
    const [problemId, setProblemId] = useState(1);

    return (
        <div>
            <button onClick={() => start(problemId)}>start</button>
            <button onClick={() => stop()}>stop</button>
            <button onClick={() => {
                stop();
                start(problemId + 1);
                setProblemId((id) => id + 1);
            }}>restart</button>
            <button onClick={() => finishProblem()}>finish problem in store</button>
            <button onClick={() => updateManually({problemId, now: 1000, prevTime: 0})} >manually</button>
        </div>
    );
};
