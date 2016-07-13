/**
 * Created by andy on 7/12/16.
 */
export default class Node {
    constructor(id) {
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
