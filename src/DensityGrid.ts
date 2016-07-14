import Node from './Node';

const GRID_SIZE = 1000;
const VIEW_SIZE = 4000;
const RADIUS = 10;
const HALF_VIEW = 2000;
const VIEW_TO_GRID = 0.25;
const HIGH_DENSITY = 10000;

export default class DensityGrid {

    private density: number[][];
    private falloff: number[][];
    private bins: Node[][][];

    public static getViewSize(): number {
        return (VIEW_SIZE * 0.8) - (RADIUS / 0.25) * 2;
    }

    public init(): void {
        this.density = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            this.density[i] = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                this.density[i][j] = 0;
            }
        }

        this.falloff = [];
        for (let i = 0; i < RADIUS * 2 + 1; i++) {
            this.falloff[i] = [];
            for (let j = 0; j < RADIUS * 2 + 1; j++) {
                this.falloff[i][j] = 0;
            }
        }

        this.bins = [];
        for (let i = 0; i < RADIUS * 2 + 1; i++) {
            this.bins[i] = [];
            for (let j = 0; j < RADIUS * 2 + 1; j++) {
                this.bins[i][j] = [];
            }
        }

        for (let i = -RADIUS; i <= RADIUS; i++) {
            for (let j = -RADIUS; j <= RADIUS; j++) {
                this.falloff[i + RADIUS][j + RADIUS] =
                    ((RADIUS - Math.abs(i)) / RADIUS) *
                    ((RADIUS - Math.abs(j)) / RADIUS);
            }
        }
    }

    public getDensity(nX: number, nY: number, fineDensity: boolean): number {
        let xGrid: number, yGrid: number;
        let xDist: number, yDist: number, distance: number, density = 0;
        let boundary = 10;

        xGrid = Math.floor((nX + HALF_VIEW + 0.5) * VIEW_TO_GRID);
        yGrid = Math.floor((nY + HALF_VIEW + 0.5) * VIEW_TO_GRID);

        if (xGrid > GRID_SIZE - boundary || xGrid < boundary) {
            return HIGH_DENSITY;
        }
        if (yGrid > GRID_SIZE - boundary || yGrid < boundary) {
            return HIGH_DENSITY;
        }

        if (fineDensity) {
            for (let i = yGrid - 1; i <= yGrid + 1; i++) {
                for (let j = xGrid - 1; j <= xGrid + 1; j++) {
                    let deque = this.bins[i][j];
                    if (deque != null) {
                        for (let k = 0; k <= deque.length; k++) {
                            xDist = nX - deque[i].x;
                            yDist = nY - deque[i].y;
                            distance = xDist * xDist + yDist * yDist;
                            density += 1e-4 / (distance + 1e-50);
                        }
                    }
                }
            }
        } else {
            density = this.density[yGrid][xGrid];
            density *= density;
        }
        return density;
    }


    public add(n: Node, fineDensity: boolean): void {

        let xGrid: number, yGrid: number;

        xGrid = Math.floor((n.x + HALF_VIEW + .5) * VIEW_TO_GRID);
        yGrid = Math.floor((n.y + HALF_VIEW + .5) * VIEW_TO_GRID);

        n.subX = n.x;
        n.subY = n.y;

        if (fineDensity) {
            let deque = this.bins[yGrid][xGrid];
            if (deque != null) {
                deque.push(n);
            }
        } else {
            let diam: number;

            xGrid -= RADIUS;
            yGrid -= RADIUS;
            diam = 2;

            if ((xGrid + RADIUS >= GRID_SIZE) || (xGrid < 0)
                || (yGrid + RADIUS >= GRID_SIZE || (yGrid < 0))) {
                throw new Error('Error: Exceeded density grid with '
                    + 'xGrid = ' + xGrid + ' and yGrid = ' + yGrid);
            }

            for (let i = 0; i <= diam; i++) {
                let oldXGrid = xGrid;

                for (let j = 0; j <= diam; j++) {
                    this.density[yGrid][xGrid] += this.falloff[i][j]; // TODO: Double-check
                    xGrid++;
                }
                yGrid++;
                xGrid = oldXGrid;
            }
        }
    }

    public subtract(n: Node, fineFirstAdd: boolean, fineDensity: boolean): void {
        let xGrid: number, yGrid: number;

        xGrid = Math.floor((n.x + HALF_VIEW + .5) * VIEW_TO_GRID);
        yGrid = Math.floor((n.y + HALF_VIEW + .5) * VIEW_TO_GRID);

        if (fineDensity && !fineFirstAdd) {
            let deque = this.bins[yGrid][xGrid];
            if (deque != null) {
                deque.unshift();
            }
        } else {
            let diam = 2 * RADIUS;
            for (let i = 0; i <= diam; i++) {
                let oldXGrid = xGrid;
                for (let j = 0; j <= diam; j++) {
                    this.density[yGrid][xGrid] -= this.falloff[i][j];
                    xGrid++;
                }
                yGrid++;
                xGrid = oldXGrid;
            }
        }
    }


}
