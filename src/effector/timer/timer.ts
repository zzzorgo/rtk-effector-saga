import { createEffect, createEvent, createStore, forward, guard, sample, scopeBind } from 'effector';
import { getTime, updateSpentTime } from '../api/external';
import { ProblemNow, TimerData } from './types';

export const finishProblem = createEvent();
export const $problemFinished = createStore(false)
    .on(finishProblem, () => true);
/* =============== */

export const start = createEvent<number>();
export const startNow = start.map((problemId) => ({ problemId, now: Date.now() }));
export const stop = createEvent();
export const stopNow = stop.map(() => Date.now());
export const update = createEvent<ProblemNow>();
export const updateManually = createEvent<TimerData>();

export const intervalFx =  createEffect(({problemId}: { problemId: number }) => {
    const bindedUpdate = scopeBind(update);

    return window.setInterval(() => {
        const now = Date.now();
        bindedUpdate({problemId, now});
    }, 1000);
});

export const clearIntervalFx = createEffect<number, void, Error>((handler) => {
    window.clearInterval(handler);
});

export const getTimeForStopFx = createEffect(getTime);
export const updateSpentTimeFx = createEffect(updateSpentTime);

export const $timer = createStore<number>(NaN)
    .on(intervalFx.done, (_, { result: intervalHandler }) => intervalHandler);

export const $problemId = createStore<number>(NaN)
    .on(start, (_, id) => id);

export const $prevProblemId = createStore<number>(NaN);

const $timeFromServer =  createStore<number>(NaN)
    .on(getTimeForStopFx.done, (_, { result: now }) => now);

export const $stopTime =  createStore<number>(NaN)
    .on(stopNow, (_, now) => now);

export const $prevTime =  createStore<number>(NaN)
    .on(updateSpentTimeFx.done, (_, { params: { now } }) => now)
    .on(startNow, (_, { now }) => now);

forward({
    from: startNow,
    to: intervalFx,
});

forward({
    from: stop,
    to: getTimeForStopFx,
});

sample({
    source: $problemId,
    clock: stop,
    target: $prevProblemId,
});

sample({
    source: $timer,
    clock: stop,
    target: clearIntervalFx,
});

guard({
    source: {
        problemId: $prevProblemId,
        now: $stopTime,
        prevTime: $prevTime,
        serverTime: $timeFromServer,
    },
    clock: getTimeForStopFx.done,
    filter: (source, clock) => {
        console.log('selector', source, clock);
        return !$problemFinished.getState();
    },
    target: updateSpentTimeFx,
});

sample({
    source: $prevTime,
    clock: update,
    fn: (prevTime, clock) => ({
            prevTime,
            now: clock.now,
            problemId: clock.problemId
    }),
    target: updateSpentTimeFx,
});

forward({
    from: updateManually,
    to: updateSpentTimeFx,
});
