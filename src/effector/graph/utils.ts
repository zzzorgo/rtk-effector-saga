import { fork } from 'effector';
import { stop,start, updateManually, intervalFx, getTimeForStopFx, clearIntervalFx, updateSpentTimeFx, update } from '../timer/timer';

type OPERATION = 'on' | 'event' | 'store' | 'effect' | 'map' | 'combine';

interface Node {
    id: number;
    meta: {
        op: OPERATION;
        name: string;
    },
    next: Node[];
    family: {
        owners: Node[];
    };
    async?: true;
}

interface CyNode {
    data: {
        id: string;
        caption: string;
        type: string;
    },
}

interface CyEdge {
    data: {
        id: string;
        source: string;
        target: string;
        label: string;
    }
}

function getCaption(node: Node) {
    return `id: ${node.id}, name: ${node.meta.name}, op: ${node.meta.op}`;
}

function getId(node: Node) {
    return `${node.id}-${node.meta.name}-${node.meta.op}`;
}


function getEdgeId(from: Node, to: Node) {
    return `${getId(from)}->${getId(to)}`;
}

function getNodeType(op: string) {
    switch (op) {
        case 'store':
            return 'round-octagon'
        case 'event':
            return 'round-tag'
        case 'effect':
            return 'star'

        default:
            return 'vee';
    }
}

function getCyNode(node: Node): CyNode {
    return { data: {
        id: getId(node),
        caption: getCaption(node),
        type: getNodeType(node.meta.op),
    } };
}

function getCyEdge(from: Node, to: Node, label: string = '', lineStyle = 'solid') {
    return {
        data: {
            id: getEdgeId(from, to),
            source: getId(from), 
            target: getId(to),
            label, 
            lineStyle,
        },
    };
}

export function traverse() {
    const scope = fork();
    const visitedMap = new Map();
    const existingEdge = new Map();
    // @ts-ignore
    const graph1 = stop.graphite;
    //@ts-ignore
    const graph2 = start.graphite;
    // //@ts-ignore
    // const graph3 = updateManually.graphite;
    //@ts-ignore
    const graph4: Node = clearIntervalFx.graphite;
    //@ts-ignore
    const graph7: Node = clearIntervalFx.done.graphite;
    //@ts-ignore
    const graph5: Node = getTimeForStopFx.done.graphite;
    graph5.async = true;
    graph7.async = true;
    //@ts-ignore
    const graph6: Node = getTimeForStopFx.graphite;
    graph6.next.push(graph5);
    graph4.next.push(graph7);
    
    //@ts-ignore
    const graph8: Node = updateSpentTimeFx.graphite;
    //@ts-ignore
    const graph9: Node = updateSpentTimeFx.done.graphite;
    graph9.async = true;
    graph8.next.push(graph9);

    //@ts-ignore
    const graph10: Node = intervalFx.graphite;
    //@ts-ignore
    const graph11: Node = intervalFx.done.graphite;
    graph11.async = true;
    graph10.next.push(graph11);

    //@ts-ignore
    const graph12 = update.graphite;

    
    //@ts-ignore
    const graph13: Node = updateSpentTimeFx.graphite;
    //@ts-ignore
    const graph14: Node = updateSpentTimeFx.done.graphite;
    //@ts-ignore
    const graph15: Node = updateManually.graphite;
    graph14.async = true;
    graph13.next.push(graph14);


    const stack = [
        graph1,
        graph2,
        graph4,
        graph5,
        graph6,
        graph7,
        graph8,
        graph9,
        graph10,
        graph11,
        graph12,
        graph13,
        graph14,
        graph15,
    ];

    const newGraph = {
        nodes: [] as CyNode[],
        edges: [] as CyEdge[],
    };

    let i = 0;
    let j = 0;
    while (stack.length > 0) {
        // i++
        const node = stack.pop();

        if (!node) {
            throw Error();
        }

        const cyNode = getCyNode(node);

        // if (!visitedMap.has(getId(node))) {
            newGraph.nodes.push(cyNode);
            visitedMap.set(node.id, node);
        // }

        for (let index = 0; index < node.family.owners.length; index++) {
            const owner = node.family.owners[index];

            if (!visitedMap.has(getId(owner)) ) {
                visitedMap.set(getId(owner), owner);
                stack.push(owner);
                // console.log(owner)
                // console.log(node)
                // j++
            }

            const edgeId = getEdgeId(owner, node);
            if (!existingEdge.has(edgeId)) {

                // console.warn(node.id, child.id);
                const lineStyle = node.async ? 'dashed' : 'solid';
                const label = node.async ? 'async' : '';
                const edge = getCyEdge(owner, node , label, lineStyle );
                existingEdge.set(edgeId, edge);
                newGraph.edges.push(edge);
            }
        }

        for (let index = 0; index < node.next.length; index++) {
            const child = node.next[index];

            if ( true && (
                child.meta.op === 'on'
                || child.meta.op === 'map'
                || (child.meta.op === 'event' && child.meta.name === 'updates'))
                || (child.meta.op === 'combine')
            ) {
                if (child.next[0]) {
                    stack.push(child.next[0]);
                    const edge = getCyEdge(node, child.next[0], child.meta.op);
                    existingEdge.set(getEdgeId(node, child.next[0]), edge);
                    newGraph.edges.push(edge);
                }

                continue;

            // } else if (child.meta.op === 'event' && child.next.length === 0) {
            //     continue;
            } else if (!visitedMap.has(child.id)) {
                stack.push(child);
            }
            
            const edgeId = getEdgeId(node, child);
            if (!existingEdge.has(edgeId)) {

                // console.warn(node.id, child.id);
                const lineStyle = child.async ? 'dashed' : 'solid';
                const label = child.async ? 'async' : '';
                const edge = getCyEdge(node, child, label, lineStyle );
                existingEdge.set(edgeId, edge);
                newGraph.edges.push(edge);
            }
        }
    }

    // console.log(newGraph);
    // console.log(visitedMap);

    return newGraph;
}

