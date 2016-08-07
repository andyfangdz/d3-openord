/**
 * Created by andy on 8/6/16.
 */

export interface InputNode {
    group: number,
    id: string,
    index: number,
    vx: number,
    vy: number,
    x: number,
    y: number
}

export interface InputLink {
    index: number,
    source: InputNode,
    target: InputNode,
    value: number
}

export interface InputGraph {
    links: InputLink[],
    nodes: InputNode[]
}