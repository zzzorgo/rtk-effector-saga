const oldSetInterval = window.setInterval;
const oldClearInterval = window.clearInterval;
const oldDate = window.Date;

const state = {
    timePassed: 0,
    spies: [],
    handlers: [],
    now: 0,
};

export function sleep(ms) {
    return new Promise((res) => {
        setTimeout(res, ms);
    });
}

export async function fastSleep(ms) {
    state.timePassed += ms;
    await sleep(0);
}

export function initTimerMocks() {
    window.Date = {
        now() {
            state.now++;
            return state.now;
        }
    };

    window.setInterval = jest.fn((callback, ms) => {
        const timerState = {
            timeRemained: 0,
        };
        const spy = jest.fn(callback);
        state.spies.push(spy);
        const newCallback = () => {
            const trueTimePassed = (state.timePassed + timerState.timeRemained);
            if (trueTimePassed >= ms) {
                const timesToCall = Math.floor(trueTimePassed / ms);

                for (let i = 0; i < timesToCall; i++) {
                    spy();
                }

                timerState.timeRemained = trueTimePassed - timesToCall * ms;
                state.timePassed = 0;
            }
        };
        const handler = oldSetInterval(newCallback, 0);
        state.handlers.push(handler);

        return handler;
    });

    window.clearInterval = jest.fn((handler) => {
        oldClearInterval(handler);
    });

    return state.spies;
}

export function destroyTimerMocks() {
    window.clearInterval = oldClearInterval;
    window.setInterval = oldSetInterval;
    window.Date = oldDate;
    state.timePassed = 0;
    state.now = 0;
    state.spies = [];
    state.handlers.forEach((handler) => {
        oldClearInterval(handler);
    });
    state.handlers = [];
}
