import {Params, Stage, STAGES} from "./Params";
import Worker from "./Worker";
/**
 * Created by andy on 8/2/16.
 */



export default class Control {
    get STAGE(): number {
        return this._STAGE;
    }

    set STAGE(value: number) {
        this._STAGE = value;
    }

    get iterations(): number {
        return this._iterations;
    }

    set iterations(value: number) {
        this._iterations = value;
    }

    get temperature(): number {
        return this._temperature;
    }

    set temperature(value: number) {
        this._temperature = value;
    }

    get attraction(): number {
        return this._attraction;
    }

    set attraction(value: number) {
        this._attraction = value;
    }

    get dampingMult(): number {
        return this._dampingMult;
    }

    set dampingMult(value: number) {
        this._dampingMult = value;
    }

    get minEdges(): number {
        return this._minEdges;
    }

    set minEdges(value: number) {
        this._minEdges = value;
    }

    get cutEnd(): number {
        return this._cutEnd;
    }

    set cutEnd(value: number) {
        this._cutEnd = value;
    }

    get cutLengthEnd(): number {
        return this._cutLengthEnd;
    }

    set cutLengthEnd(value: number) {
        this._cutLengthEnd = value;
    }

    get cutOffLength(): number {
        return this._cutOffLength;
    }

    set cutOffLength(value: number) {
        this._cutOffLength = value;
    }

    get cutRate(): number {
        return this._cutRate;
    }

    set cutRate(value: number) {
        this._cutRate = value;
    }

    get fineDensity(): boolean {
        return this._fineDensity;
    }

    set fineDensity(value: boolean) {
        this._fineDensity = value;
    }

    get edgeCut(): number {
        return this._edgeCut;
    }

    set edgeCut(value: number) {
        this._edgeCut = value;
    }

    get realParm(): number {
        return this._realParm;
    }

    set realParm(value: number) {
        this._realParm = value;
    }

    get startTime(): number {
        return this._startTime;
    }

    set startTime(value: number) {
        this._startTime = value;
    }

    get stopTime(): number {
        return this._stopTime;
    }

    set stopTime(value: number) {
        this._stopTime = value;
    }

    get numNodes(): number {
        return this._numNodes;
    }

    set numNodes(value: number) {
        this._numNodes = value;
    }

    get highestSimilarity(): number {
        return this._highestSimilarity;
    }

    set highestSimilarity(value: number) {
        this._highestSimilarity = value;
    }

    get realIterations(): number {
        return this._realIterations;
    }

    set realIterations(value: number) {
        this._realIterations = value;
    }

    get realFixed(): boolean {
        return this._realFixed;
    }

    set realFixed(value: boolean) {
        this._realFixed = value;
    }

    get totIterations(): number {
        return this._totIterations;
    }

    set totIterations(value: number) {
        this._totIterations = value;
    }

    get totExpectedIterations(): number {
        return this._totExpectedIterations;
    }

    set totExpectedIterations(value: number) {
        this._totExpectedIterations = value;
    }

    get totalTime(): number {
        return this._totalTime;
    }

    set totalTime(value: number) {
        this._totalTime = value;
    }

    get params(): Params {
        return this._params;
    }

    set params(value: Params) {
        this._params = value;
    }
    private _STAGE: number;
    private _iterations: number;
    private _temperature: number;
    private _attraction: number;
    private _dampingMult: number;
    private _minEdges: number;
    private _cutEnd: number;
    private _cutLengthEnd: number;
    private _cutOffLength: number;
    private _cutRate: number;
    private _fineDensity: boolean;

    private _edgeCut: number;
    private _realParm: number;

    private _startTime: number;
    private _stopTime: number;
    private _numNodes: number;
    private _highestSimilarity: number;
    private _realIterations: number;
    private _realFixed: boolean;
    private _totIterations: number;
    private _totExpectedIterations: number;
    private _totalTime: number;

    private _params: Params;


    public initParams(params: Params, totalIterations: number): void {
        this._params = params;
        this._STAGE = 0;
        this._iterations = 0;
        this.initStage(this._params.initial);
        this._minEdges = 20;
        this._fineDensity = false;
        this._cutEnd = this._cutLengthEnd = 40000 * (1 - this._edgeCut);
        if (this._cutLengthEnd <= 1) {
            this._cutLengthEnd = 1;
        }

        let cutLengthStart = 4 * this._cutLengthEnd;

        this._cutOffLength = cutLengthStart;

        this._cutRate = (cutLengthStart - this._cutLengthEnd) / 400;
        this._totExpectedIterations = totalIterations;

        let fullCompIters = this._totExpectedIterations + 3;

        if (this._realParm < 0) {
            this._realIterations = Math.floor(this._realParm);
        } else if (this._realParm == 1) {
            this._realIterations = fullCompIters + params.simmer.getIterationsTotal(totalIterations);
        } else {
            this._realIterations = Math.floor(this._realParm * fullCompIters);
        }
        //console.log("Real iterations " + this._realIterations);

        this._realFixed = this._realIterations > 0;

        //console.log("progress");

    }

    public updateParams(newParams: Params) {
        this._params = newParams;
        this.initStage(newParams[STAGES.get(this._STAGE)]);
    }

    private initStage(stage: Stage) {
        this._temperature = stage.temperature;
        this._attraction = stage.attraction;
        this._dampingMult = stage.dampingMult;
    }

    public initWorker(worker: Worker) {
        worker.attraction = this._attraction;
        worker.cutOffLength = this._cutOffLength;
        worker.dampingMult = this._dampingMult;
        worker.minEdges = this._minEdges;
        worker.STAGE = this._STAGE;
        worker.temperature = this._temperature;
        worker.fineDensity = this._fineDensity;
    }

    public updateStage(totEnergy: number): boolean {
        let MIN = 1;
        this._totIterations++;
        if (this._totIterations > this._realIterations) {
            this._realFixed = false;
        }

        console.log("Progress ");

        if (this._STAGE == 0) {
            if (this._iterations == 0) {
                let d = new Date();
                this._startTime = d.getMilliseconds() / 1000;
                console.log("Entering liquid stage...");
            }


            if (this._iterations < this._params.liquid.getIterationsTotal(this._totExpectedIterations)) {
                this.initStage(this._params.liquid);
                this._iterations++;
            } else {
                this._stopTime = (new Date()).getMilliseconds() / 1000;
                let timeElapsed = (this._stopTime - this._startTime);
                this._totalTime += timeElapsed;
                this.initStage(this._params.expansion);
                this._iterations = 0;
                console.log("Liquid stage completed in " + timeElapsed + " seconds, total energy =" + totEnergy);

                this._STAGE = 1;
                let d = new Date();
                this._startTime = d.getMilliseconds() / 1000;

                console.log("Entering expansion stage...");
            }
        }

        if (this._STAGE == 1) {
            if (this._iterations < this._params.expansion.getIterationsTotal(this._totExpectedIterations)) {
                if (this._attraction > 1) {
                    this._attraction -= 0.05;
                }

                if (this._minEdges > 12) {
                    this._minEdges -= 0.5;
                }
                this._cutOffLength -= this._cutRate;
                if (this._dampingMult > 0.1) {
                    this._dampingMult -= 0.005;
                }
                this._iterations++;
            } else {
                this._stopTime = (new Date()).getMilliseconds() / 1000;
                let timeElapsed = (this._stopTime - this._startTime);
                this._totalTime += timeElapsed;
                console.log("Expansion stage completed in " + timeElapsed + " seconds, total energy =" + totEnergy);

                this._STAGE = 2;
                this._minEdges = 12;
                this.initStage(this._params.cooldown);
                this._iterations = 0;
                this._startTime = (new Date()).getMilliseconds() / 1000;

                console.log("Entering cooldown stage...");
            }
        } else if (this._STAGE == 2) {
            if (this._iterations < this._params.cooldown.getIterationsTotal(this._totExpectedIterations)) {
                if (this._temperature > 50) {
                    this._temperature -= 10;
                }

                if (this._cutOffLength > this._cutLengthEnd) {
                    this._cutLengthEnd -= this._cutRate * 2;
                }
                if (this._minEdges > MIN) {
                    this._minEdges -= 0.2;
                }

                this._iterations++;
            } else {
                this._stopTime = (new Date()).getMilliseconds() / 1000;
                let timeElapsed = (this._stopTime - this._startTime);
                this._totalTime += timeElapsed;
                console.log("Cooldown stage completed in " + timeElapsed + " seconds, total energy =" + totEnergy);

                this._STAGE = 3;
                this._iterations = 0;
                this.initStage(this._params.cooldown);
                this._startTime = (new Date()).getMilliseconds() / 1000;

                console.log("Entering crunch stage...");
            }
        } else if (this._STAGE == 3) {
            if (this._iterations < this._params.cooldown.getIterationsTotal(this._totExpectedIterations)) {
                this._iterations++;
            } else {
                this._stopTime = (new Date()).getMilliseconds() / 1000;
                let timeElapsed = (this._stopTime - this._startTime);
                this._totalTime += timeElapsed;
                this._iterations = 0;
                this.initStage(this._params.simmer);
                this._minEdges = 99;
                this._fineDensity = true;
                console.log("crunch stage completed in " + timeElapsed + " seconds, total energy =" + totEnergy);

                this._STAGE = 5;
                this._startTime = (new Date()).getMilliseconds() / 1000;

                console.log("Entering simmer stage...");
            }
        } else if (this._STAGE == 5) {
            if (this._iterations < this._params.cooldown.getIterationsTotal(this._totExpectedIterations)) {
                if (this._temperature > 50) {
                    this._temperature -= 2;
                }
                this._iterations++;
            } else {
                this._stopTime = (new Date()).getMilliseconds() / 1000;
                let timeElapsed = (this._stopTime - this._startTime);
                this._totalTime += timeElapsed;

                console.log("crunch stage completed in " + timeElapsed + " seconds, total energy =" + totEnergy);

                this._STAGE = 6;

                console.log("Layout completed in " + this._totalTime + " seconds with " + this._totIterations + " _iterations");
            }
        } else if (this._STAGE == 6) {
            return false;
        }
        return true;
    }


}