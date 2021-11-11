import { createEffect, createEvent, createStore, forward, guard, sample } from 'effector';

/* ====== mocks ======= */

type TimerData = { problemId: number, now: number, prevTime: number };

function sleep(ms: number) {
    return new Promise((res) => {
        setTimeout(res, ms);
    });
}

async function updateSpentTime({problemId, now, prevTime}: TimerData) {
    const delta = Math.round((now - prevTime) / 1000);
    await sleep(320);
    console.log('updateSpentTime done', delta, problemId);
}

async function getTime() {
    await sleep(170);
    const now = Date.now();
    await sleep(100);

    return now;
}

export const finishProblem = createEvent();
const $problemFinished = createStore(false)
    .on(finishProblem, () => true);

/* ================= */

export const start = createEvent<number>();
export const stop = createEvent();
export const update = createEvent<TimerData>();
const startNow = start.map((problemId) => ({ problemId, now: Date.now() }));

const intervalFx = createEffect((problemId: number) => {
    return window.setInterval(() => {
        const now = Date.now();
        const prevTime = $prevTime.getState();
        update({problemId, now, prevTime});
    }, 1000);
});

const clearIntervalFx = createEffect<number, void, Error>(window.clearInterval);
const getTimeForStopFx = createEffect(getTime);
const updateSpentTimeFx = createEffect(updateSpentTime);

const $timer = createStore<number>(NaN)
    .on(intervalFx.done, (_, { result: intervalHandler }) => intervalHandler);

const $problemId = createStore<number>(NaN)
    .on(start, (_, id) => id);

const $prevProblemId = createStore<number>(NaN);

const $time = createStore<number>(NaN)
    .on(getTimeForStopFx.done, (_, { result: now }) => now);

const $prevTime = createStore<number>(NaN)
    .on(update, (_, { now }) => now)
    .on(startNow, (_, { now }) => now);

forward({
    from: start,
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
    source: { problemId: $prevProblemId, now: $time, prevTime: $prevTime },
    clock: getTimeForStopFx.done,
    filter: (source) => {
        console.log('selector', source.now, source.problemId);
        return !$problemFinished.getState();
    },
    target: updateSpentTimeFx,
});

forward({
    from: update,
    to: updateSpentTimeFx,
});
