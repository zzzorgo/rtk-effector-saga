import { createEffect, createEvent, createStore, forward, guard, sample } from 'effector';

function sleep(ms: number) {
    return new Promise((res) => {
        setTimeout(res, ms);
    });
}

async function updateSpentTime({problemId, delta}: {problemId: number, delta: number}) {
    await sleep(320);
    console.log('updateSpentTime done', delta, problemId);
}

async function getTime() {
    await sleep(170);
    const now = Date.now();
    await sleep(100);

    return now;
}

/* ================= */
export const finishProblem = createEvent();
const $problemFinished = createStore(false)
    .on(finishProblem, () => true);


/* ================= */

async function updateSpentTimeDelta(problemId: number) {
    const prevTime = $prevTime.getState();
    const now = Date.now();
    const delta = Math.round((now - prevTime) / 1000);

    updatePrevTime(now);
    return await updateSpentTime({problemId, delta});
}

export const start = createEvent<number>();
export const pause = createEvent();
export const updatePrevTime = createEvent<number>();

const intervalFx = createEffect((problemId: number) => {
    return window.setInterval(async () => {
        await updateSpentTimeDelta(problemId);
    }, 1000);
});

const clearIntervalFx = createEffect((timerHandler: number) => {
    clearInterval(timerHandler);
});

const getTimeForPauseFx = createEffect(getTime);

const updateFx = createEffect(async ({ problemId }: { problemId: number }) => {
    await updateSpentTimeDelta(problemId);
    console.log('final update done', problemId);
});

const $timer = createStore<number>(NaN)
    .on(intervalFx.done, (_, { result: intervalHandler }) => intervalHandler);

const $problemId = createStore<number>(NaN)
    .on(start, (_, id) => id);

const $prevProblemId = createStore<number>(NaN);

const $time = createStore<number>(NaN)
    .on(getTimeForPauseFx.done, (_, { result: now }) => {
        console.log('sync', now);
        return now;
    });

const $prevTime = createStore<number>(NaN)
    .on(updatePrevTime, (_, now) => now);

forward({
    from: start,
    to: intervalFx,
});

forward({
    from: start.map(() => Date.now()),
    to: updatePrevTime
});

forward({
    from: pause,
    to: getTimeForPauseFx,
});

sample({
    source: $problemId,
    clock: pause,
    target: $prevProblemId,
});

sample({
    source: $timer,
    clock: pause,
    target: clearIntervalFx,
});

guard({
    source: { problemId: $prevProblemId, now: $time },
    clock: getTimeForPauseFx.done,
    filter: (source) => {
        console.log('sync', source.now);
        console.log('selector', source.now, source.problemId);

        return !$problemFinished.getState();
    },
    target: updateFx,
});

/* =============== */

export const manually = createEvent<{ delta: number, problemId: number }>();

forward({
    from: manually,
    to: createEffect(updateSpentTime)
});
