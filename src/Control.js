"use strict";
/**
 * Created by andy on 8/2/16.
 */
var Control = (function () {
    function Control() {
    }
    Object.defineProperty(Control.prototype, "STAGE", {
        get: function () {
            return this._STAGE;
        },
        set: function (value) {
            this._STAGE = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "iterations", {
        get: function () {
            return this._iterations;
        },
        set: function (value) {
            this._iterations = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "temperature", {
        get: function () {
            return this._temperature;
        },
        set: function (value) {
            this._temperature = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "attraction", {
        get: function () {
            return this._attraction;
        },
        set: function (value) {
            this._attraction = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "dampingMult", {
        get: function () {
            return this._dampingMult;
        },
        set: function (value) {
            this._dampingMult = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "minEdges", {
        get: function () {
            return this._minEdges;
        },
        set: function (value) {
            this._minEdges = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "cutEnd", {
        get: function () {
            return this._cutEnd;
        },
        set: function (value) {
            this._cutEnd = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "cutLengthEnd", {
        get: function () {
            return this._cutLengthEnd;
        },
        set: function (value) {
            this._cutLengthEnd = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "cutOffLength", {
        get: function () {
            return this._cutOffLength;
        },
        set: function (value) {
            this._cutOffLength = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "cutRate", {
        get: function () {
            return this._cutRate;
        },
        set: function (value) {
            this._cutRate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "fineDensity", {
        get: function () {
            return this._fineDensity;
        },
        set: function (value) {
            this._fineDensity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "edgeCut", {
        get: function () {
            return this._edgeCut;
        },
        set: function (value) {
            this._edgeCut = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "realParm", {
        get: function () {
            return this._realParm;
        },
        set: function (value) {
            this._realParm = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "startTime", {
        get: function () {
            return this._startTime;
        },
        set: function (value) {
            this._startTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "stopTime", {
        get: function () {
            return this._stopTime;
        },
        set: function (value) {
            this._stopTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "numNodes", {
        get: function () {
            return this._numNodes;
        },
        set: function (value) {
            this._numNodes = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "highestSimilarity", {
        get: function () {
            return this._highestSimilarity;
        },
        set: function (value) {
            this._highestSimilarity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "realIterations", {
        get: function () {
            return this._realIterations;
        },
        set: function (value) {
            this._realIterations = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "realFixed", {
        get: function () {
            return this._realFixed;
        },
        set: function (value) {
            this._realFixed = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "totIterations", {
        get: function () {
            return this._totIterations;
        },
        set: function (value) {
            this._totIterations = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "totExpectedIterations", {
        get: function () {
            return this._totExpectedIterations;
        },
        set: function (value) {
            this._totExpectedIterations = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "totalTime", {
        get: function () {
            return this._totalTime;
        },
        set: function (value) {
            this._totalTime = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Control.prototype, "params", {
        get: function () {
            return this._params;
        },
        set: function (value) {
            this._params = value;
        },
        enumerable: true,
        configurable: true
    });
    Control.prototype.initParams = function (params, totalIterations) {
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
        var cutLengthStart = 4 * this._cutLengthEnd;
        this._cutOffLength = cutLengthStart;
        this._cutRate = (cutLengthStart - this._cutLengthEnd) / 400;
        this._totExpectedIterations = this._totIterations;
        var fullCompIters = this._totExpectedIterations + 3;
        if (this._realParm < 0) {
            this._realIterations = Math.floor(this._realParm);
        }
        else if (this._realParm == 1) {
            this._realIterations = fullCompIters + params.simmer.getIterationsTotal(totalIterations);
        }
        else {
            this._realIterations = Math.floor(this._realParm * fullCompIters);
        }
        console.log("Real iterations " + this._realIterations);
        if (this._realIterations > 0) {
            this._realFixed = true;
        }
        else {
            this._realFixed = false;
        }
        console.log("progress");
    };
    Control.prototype.initStage = function (stage) {
        this._temperature = stage.temperature;
        this._attraction = stage.attraction;
        this._dampingMult = stage.dampingMult;
    };
    Control.prototype.initWorker = function (worker) {
        worker.attraction = this._attraction;
        worker.cutOffLength = this._cutOffLength;
        worker.dampingMult = this._dampingMult;
        worker.minEdges = this._minEdges;
        worker.STAGE = this._STAGE;
        worker.temperature = this._temperature;
        worker.fineDensity = this._fineDensity;
    };
    Control.prototype.updateStage = function (totEnergy) {
        var MIN = 1;
        this._totIterations++;
        if (this._totIterations > this._realIterations) {
            this._realFixed = false;
        }
        console.log("Progress ");
        if (this._STAGE == 0) {
            if (this._iterations == 0) {
                var d = new Date();
                this._startTime = d.getMilliseconds() / 1000;
                console.log("Entering liquid stage...");
            }
            if (this._iterations < this._params.liquid.getIterationsTotal(this._totExpectedIterations)) {
                this.initStage(this._params.liquid);
                this._iterations++;
            }
            else {
                this._stopTime = (new Date()).getMilliseconds() / 1000;
                var timeElapsed = (this._stopTime - this._startTime);
                this._totalTime += timeElapsed;
                this.initStage(this._params.expansion);
                this._iterations = 0;
                console.log("Liquid stage completed in " + timeElapsed + " seconds, total energy =" + totEnergy);
                this._STAGE = 1;
                var d = new Date();
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
            }
            else {
                this._stopTime = (new Date()).getMilliseconds() / 1000;
                var timeElapsed = (this._stopTime - this._startTime);
                this._totalTime += timeElapsed;
                console.log("Expansion stage completed in " + timeElapsed + " seconds, total energy =" + totEnergy);
                this._STAGE = 2;
                this._minEdges = 12;
                this.initStage(this._params.cooldown);
                this._iterations = 0;
                this._startTime = (new Date()).getMilliseconds() / 1000;
                console.log("Entering cooldown stage...");
            }
        }
        else if (this._STAGE == 2) {
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
            }
            else {
                this._stopTime = (new Date()).getMilliseconds() / 1000;
                var timeElapsed = (this._stopTime - this._startTime);
                this._totalTime += timeElapsed;
                console.log("Cooldown stage completed in " + timeElapsed + " seconds, total energy =" + totEnergy);
                this._STAGE = 3;
                this._iterations = 0;
                this.initStage(this._params.cooldown);
                this._startTime = (new Date()).getMilliseconds() / 1000;
                console.log("Entering crunch stage...");
            }
        }
        else if (this._STAGE == 3) {
            if (this._iterations < this._params.cooldown.getIterationsTotal(this._totExpectedIterations)) {
                this._iterations++;
            }
            else {
                this._stopTime = (new Date()).getMilliseconds() / 1000;
                var timeElapsed = (this._stopTime - this._startTime);
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
        }
        else if (this._STAGE == 5) {
            if (this._iterations < this._params.cooldown.getIterationsTotal(this._totExpectedIterations)) {
                if (this._temperature > 50) {
                    this._temperature -= 2;
                }
                this._iterations++;
            }
            else {
                this._stopTime = (new Date()).getMilliseconds() / 1000;
                var timeElapsed = (this._stopTime - this._startTime);
                this._totalTime += timeElapsed;
                console.log("crunch stage completed in " + timeElapsed + " seconds, total energy =" + totEnergy);
                this._STAGE = 6;
                console.log("Layout completed in " + this._totalTime + " seconds with " + this._totIterations + " _iterations");
            }
        }
        else if (this._STAGE == 6) {
            return false;
        }
        return true;
    };
    return Control;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Control;
