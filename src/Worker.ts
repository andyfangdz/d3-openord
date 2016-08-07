import Node from './Node';
import DensityGrid from './DensityGrid';
/**
 * Created by andy on 8/1/16.
 */

export default class Worker {
    private _id:number;
    private _done:boolean;

    private _positions:Node[];
    private _neighbors:Map<number, number>[];
    private _densityGrid:DensityGrid;
    private _firstAdd = true;
    private _fineFirstAdd = true;

    private _attraction:number;
    private _STAGE:number;
    private _temperature:number;
    private _dampingMult:number;
    private _minEdges:number;
    private _cutEnd:number;
    private _cutOffLength:number;
    private _fineDensity:boolean;

    get id():number {
        return this._id;
    }

    set id(value:number) {
        this._id = value;
    }

    get done():boolean {
        return this._done;
    }

    set done(value:boolean) {
        this._done = value;
    }

    get positions():Node[] {
        return this._positions;
    }

    set positions(value:Node[]) {
        this._positions = value;
    }

    get neighbors():Map<number, number>[] {
        return this._neighbors;
    }

    set neighbors(value:Map<number, number>[]) {
        this._neighbors = value;
    }

    get densityGrid():DensityGrid {
        return this._densityGrid;
    }

    set densityGrid(value:DensityGrid) {
        this._densityGrid = value;
    }

    get firstAdd():boolean {
        return this._firstAdd;
    }

    set firstAdd(value:boolean) {
        this._firstAdd = value;
    }

    get fineFirstAdd():boolean {
        return this._fineFirstAdd;
    }

    set fineFirstAdd(value:boolean) {
        this._fineFirstAdd = value;
    }

    get attraction():number {
        return this._attraction;
    }

    set attraction(value:number) {
        this._attraction = value;
    }

    get STAGE():number {
        return this._STAGE;
    }

    set STAGE(value:number) {
        this._STAGE = value;
    }

    get temperature():number {
        return this._temperature;
    }

    set temperature(value:number) {
        this._temperature = value;
    }

    get dampingMult():number {
        return this._dampingMult;
    }

    set dampingMult(value:number) {
        this._dampingMult = value;
    }

    get minEdges():number {
        return this._minEdges;
    }

    set minEdges(value:number) {
        this._minEdges = value;
    }

    get cutEnd():number {
        return this._cutEnd;
    }

    set cutEnd(value:number) {
        this._cutEnd = value;
    }

    get cutOffLength():number {
        return this._cutOffLength;
    }

    set cutOffLength(value:number) {
        this._cutOffLength = value;
    }

    get fineDensity():boolean {
        return this._fineDensity;
    }

    set fineDensity(value:boolean) {
        this._fineDensity = value;
    }


    constructor() {
        this.densityGrid = new DensityGrid();
        this.densityGrid.init();
    }

    public run():void {
        while (!this.done) {
            for(var i = 0; i < this.positions.length; i++) {
                this.updateNodePos(i);
            }
            this.firstAdd = false;
            if (this.fineDensity) {
                this.fineFirstAdd = false;
            }

            //TODO: multithread?
            return;
        }
    }

    private updateNodePos(nodeIndex:number):void {
        let n = this._positions[nodeIndex];
        if (n.fixed) {
            this.getNextRandom();
            this.getNextRandom();
            return;
        }

        let energies:number[] = [];
        let updatedPos:number[][] = [];
        for (let i = 0; i < 2; i++) {
            energies.push(0);
        }
        for (let i = 0; i < 2; i++) {
            updatedPos.push([0, 0]);
        }
        let jumpLength = 0.01 * this._temperature;
        this._densityGrid.subtract(n, this._firstAdd, this._fineFirstAdd, this._fineDensity);


        energies[0] = this.getNodeEnergy(nodeIndex);
        this.solveAnalytic(nodeIndex);
        updatedPos[0][0] = n.x;
        updatedPos[0][1] = n.y;

        updatedPos[1][0] = updatedPos[0][0] + (.5 - this.getNextRandom()) * jumpLength;
        updatedPos[1][1] = updatedPos[0][1] + (.5 - this.getNextRandom()) * jumpLength;

        n.x = updatedPos[1][0];
        n.y = updatedPos[1][1];

        energies[1] = this.getNodeEnergy(nodeIndex);

        if (energies[0] < energies[1]) {
            n.x = updatedPos[0][0];
            n.y = updatedPos[0][1];
            n.energy = energies[0];
        } else {
            n.x = updatedPos[1][0];
            n.y = updatedPos[1][1];
            n.energy = energies[1];
        }

        this._densityGrid.add(n, this._fineDensity);
    }

    private getNodeEnergy(nodeIndex:number):number {
        let attraction_factor = this._attraction * this._attraction
            * this._attraction * this._attraction * 2e-2;

        let xDis:number, yDis:number;
        let energyDistance:number;
        let nodeEnergy = 0;

        let n = this._positions[nodeIndex];

        if (this._neighbors[nodeIndex] != null) {
            this._neighbors[nodeIndex].forEach((value: number, key: number) => {
                let weight = value;
                let m = this._positions[key];

                xDis = n.x - m.x;
                yDis = n.y - m.y;

                energyDistance = xDis * xDis + yDis * yDis;

                if (this._STAGE < 2) {
                    energyDistance *= energyDistance;
                }

                if (this._STAGE == 0) {
                    energyDistance *= energyDistance;
                }

                nodeEnergy += weight * attraction_factor * energyDistance;
            });

            nodeEnergy += this._densityGrid.getDensity(n.x, n.y, this._fineDensity);
            return nodeEnergy;
        }

    }

    private solveAnalytic(nodeIndex:number):void {
        let totalWeight = 0;
        let xDis = 0, yDis = 0, xCen = 0, yCen = 0;
        let x = 0, y = 0;
        let damping = 0;

        let n = this._positions[nodeIndex];

        let map = this._neighbors[nodeIndex];
        map.forEach((value: number, key: number) => {
            let weight = value;
            let m = this._positions[key];
            totalWeight += weight;
            x += weight * m.x;
            y += weight * m.y;
        });

        if (totalWeight > 0) {
            xCen = x / totalWeight;
            yCen = y / totalWeight;
            damping = 1.0 - this._dampingMult;
            let posX = damping * n.x + (1 - damping) * xCen;
            let posY = damping * n.y + (1 - damping) * yCen;
            n.x = posX;
            n.y = posY;
        }

        if (this._minEdges == 99) {
            return;
        }

        if (this._cutEnd >= 39500) {
            return;
        }

        let maxLength = 0;
        let maxIndex = -1;
        let neighborsCount = Object.keys(map).length;
        if (neighborsCount > this._minEdges) {
            this._neighbors[nodeIndex].forEach((value: number, key: number) => {
                let m = this._positions[key];

                xDis = xCen - m.x;
                yDis = yCen - m.y;
                let dis = xDis * xDis + yDis * yDis;
                dis *= Math.sqrt(neighborsCount);
                if (dis > maxIndex) {
                    maxLength = dis;
                    maxIndex = key;
                }
            });
            if (maxLength > this._cutOffLength && maxIndex != -1) {
                delete map[maxIndex];
            }
        }
    }

    public getTotEnergy():number {
        let myTotEnergy = 0;
        // TODO: Multi-thread
        for (let i = 0; i < this._positions.length; i++) {
            myTotEnergy += this._positions[i].energy;
        }
        return myTotEnergy;

    }

    public getNextRandom():number {
        return Math.random();
    }
}