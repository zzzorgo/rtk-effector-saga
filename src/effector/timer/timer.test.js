import { allSettled, fork } from 'effector';
import { updateSpentTime } from '../api/external';
import { destroyTimerMocks, fastSleep, initTimerMocks } from '../utils/timeMachine';
import { $problemId, finishProblem, start, stop, updateManually } from './timer';

jest.mock('../api/external', () => ({
    updateSpentTime: jest.fn(async function() {}),
    getTime: async function() { return 999; },
}));

describe('Name of the group', () => {
    beforeEach(() => {
        destroyTimerMocks();
        initTimerMocks();
        jest.clearAllMocks();
    });

    it('should start timer', async  () => {
        const scope = fork();

        await allSettled(start, {
            params: 123,
            scope
        });

        expect(scope.getState($problemId)).toBe(123);

        await fastSleep(3000);

        expect(updateSpentTime).toBeCalledTimes(3);
        expect(updateSpentTime.mock.calls).toEqual(
            [[{"now": 2, "prevTime": 1, "problemId": 123}],
            [{"now": 3, "prevTime": 2, "problemId": 123}],
            [{"now": 4, "prevTime": 3, "problemId": 123}]]
        );
    });

    it('should stop timer and send last update', async  () => {
        const scope = fork();

        await allSettled(start, {
            params: 321,
            scope
        });

        await fastSleep(3000);

        await allSettled(stop, { scope });

        expect(updateSpentTime).toBeCalledTimes(4);
        expect(window.clearInterval).toBeCalledTimes(1);
        expect(updateSpentTime.mock.calls).toEqual(
            [[{"now": 2, "prevTime": 1, "problemId": 321}],
            [{"now": 3, "prevTime": 2, "problemId": 321}],
            [{"now": 4, "prevTime": 3, "problemId": 321}],
            [{"now": 5, "prevTime": 4, "problemId": 321, "serverTime": 999}]]
        );
    });

    it('should stop timer without last update', async  () => {
        const scope = fork();

        await allSettled(start, {
            params: 321,
            scope
        });

        await fastSleep(3000);
        await allSettled(finishProblem, { scope });
        await allSettled(stop, { scope });

        expect(updateSpentTime).toBeCalledTimes(3);
        expect(window.clearInterval).toBeCalledTimes(1);
        expect(updateSpentTime.mock.calls).toEqual(
            [[{"now": 2, "prevTime": 1, "problemId": 321}],
            [{"now": 3, "prevTime": 2, "problemId": 321}],
            [{"now": 4, "prevTime": 3, "problemId": 321}]]
        );
    });

    it('hould restart timer', async  () => {
        const scope = fork();

        await allSettled(start, {
            params: 321,
            scope
        });

        expect(scope.getState($problemId)).toBe(321);

        await fastSleep(3000);
        await allSettled(finishProblem, { scope });
        await allSettled(stop, { scope });

        updateSpentTime.mockClear();

        await allSettled(start, {
            params: 444,
            scope
        });

        expect(scope.getState($problemId)).toBe(444);

        await fastSleep(3000);

        expect(updateSpentTime).toBeCalledTimes(3);
        expect(updateSpentTime.mock.calls).toEqual(
            [[{"now": 7, "prevTime": 6, "problemId": 444}],
            [{"now": 8, "prevTime": 7, "problemId": 444}],
            [{"now": 9, "prevTime": 8, "problemId": 444}]]
        );
    });

    it('should send manual update', async  () => {
        const scope = fork();

        await allSettled(updateManually, {
            params: { now: 1000, prevTime: 0, problemId: 555 },
            scope
        });

        expect(updateSpentTime).toBeCalledTimes(1);
        expect(updateSpentTime.mock.calls).toEqual(
            [[{"now": 1000, "prevTime": 0, "problemId": 555}]]
        );
    });

});
