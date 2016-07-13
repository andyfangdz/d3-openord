/**
 * Created by andy on 7/12/16.
 */

export default class Node {
    id: number;
    fixed: boolean;
    x: number;
    y: number;
    subX: number;
    subY: number;
    energy: number;

    constructor(id: number) {
        this.id = id;
        this.fixed = false;
        this.x = this.y = 0;
        this.subX = this.subY = 0;
        this.energy = 0;
    }

    clone() {
        return Object.assign({}, this);
    }

}