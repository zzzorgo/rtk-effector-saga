/* ====== mocks ======= */

import { sleep } from '../utils/timeMachine';
import { TimerData } from '../timer/types';

export async function updateSpentTime({problemId, now, prevTime}: TimerData) {
    const delta = Math.round((now - prevTime) / 1000);
    await sleep(0);
    console.log('updateSpentTime done', delta, problemId, now, prevTime);
}

export async function getTime() {
    await sleep(0);
    const now = Date.now();
    await sleep(0);

    return now;
}

/* ================= */
