import { allSettled, fork, getGraph } from 'effector';
import { start } from '../timer/timer';


// test('t', () => {
export function traverse() {
    const scope = fork();
    // allSettled(start, {scope, params: 1})
    console.log(scope)
    const visitedMap = new Map();
    //@ts-ignore
    const graph = start.graphite;
    const stack = [graph];
    let i = 0;

    while (stack.length > 0) {
        console.log('stack', stack);

        i++
        const node = stack.pop();
        visitedMap.set(node?.id, node);
    //@ts-ignore

        const newNodes = node?.next.filter(n => !visitedMap.has(n.id)) || [];
        console.log(newNodes, stack);
        stack.push(...newNodes);

        if (i > 100) {
            break;
        }
    }

    console.log(visitedMap);
}

    // console.log(graph);
    // console.log(graph.next[0])
    // console.log(graph.next[1])

    // console.log(graph.next[0].next[0]);
    // console.log(graph.next[1].next[0]);

// });
