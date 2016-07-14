/**
 * Created by andy on 7/12/16.
 */

export default class Node {
    public id: number;
    public fixed: boolean;
    public x: number;
    public y: number;
    public subX: number;
    public subY: number;
    public energy: number;

    constructor(id: number) {
        this.id = id;
        this.fixed = false;
        this.x = this.y = 0;
        this.subX = this.subY = 0;
        this.energy = 0;
    }

    public clone() {
        return Object.assign({}, this);
    }

}
