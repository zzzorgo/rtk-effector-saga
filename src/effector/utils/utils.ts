import { createEffect } from 'effector';

export const createErrorLoggingEffect = new Proxy(createEffect, {
    apply(target, thisArg, args: Parameters<typeof createEffect>) {
        const effect = target.apply(thisArg, args);

        effect.fail.watch(({ error }) => console.error(error));

        return effect;
    },
});
