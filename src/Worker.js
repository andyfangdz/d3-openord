"use strict";
/**
 * Created by andy on 8/1/16.
 */
var Worker = (function () {
    function Worker() {
        this._firstAdd = true;
        this._fineFirstAdd = true;
    }
    Object.defineProperty(Worker.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "done", {
        get: function () {
            return this._done;
        },
        set: function (value) {
            this._done = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "positions", {
        get: function () {
            return this._positions;
        },
        set: function (value) {
            this._positions = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "neighbors", {
        get: function () {
            return this._neighbors;
        },
        set: function (value) {
            this._neighbors = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "densityGrid", {
        get: function () {
            return this._densityGrid;
        },
        set: function (value) {
            this._densityGrid = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "firstAdd", {
        get: function () {
            return this._firstAdd;
        },
        set: function (value) {
            this._firstAdd = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "fineFirstAdd", {
        get: function () {
            return this._fineFirstAdd;
        },
        set: function (value) {
            this._fineFirstAdd = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "attraction", {
        get: function () {
            return this._attraction;
        },
        set: function (value) {
            this._attraction = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "STAGE", {
        get: function () {
            return this._STAGE;
        },
        set: function (value) {
            this._STAGE = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "temperature", {
        get: function () {
            return this._temperature;
        },
        set: function (value) {
            this._temperature = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "dampingMult", {
        get: function () {
            return this._dampingMult;
        },
        set: function (value) {
            this._dampingMult = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "minEdges", {
        get: function () {
            return this._minEdges;
        },
        set: function (value) {
            this._minEdges = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "cutEnd", {
        get: function () {
            return this._cutEnd;
        },
        set: function (value) {
            this._cutEnd = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "cutOffLength", {
        get: function () {
            return this._cutOffLength;
        },
        set: function (value) {
            this._cutOffLength = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Worker.prototype, "fineDensity", {
        get: function () {
            return this._fineDensity;
        },
        set: function (value) {
            this._fineDensity = value;
        },
        enumerable: true,
        configurable: true
    });
    Worker.prototype.run = function () {
        for (var i = this._id; i < this._positions.length; i++) {
        }
    };
    Worker.prototype.updateNodePos = function (nodeIndex) {
        var n = this._positions[nodeIndex];
        if (n.fixed) {
            this.getNextRandom();
            this.getNextRandom();
            return;
        }
        var energies;
        var updatedPos;
        for (var i = 0; i < 2; i++) {
            energies.push(0);
        }
        for (var i = 0; i < 2; i++) {
            updatedPos.push([0, 0]);
        }
        var jumpLength = 0.01 * this._temperature;
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
        }
        else {
            n.x = updatedPos[1][0];
            n.y = updatedPos[1][1];
            n.energy = energies[1];
        }
        this._densityGrid.add(n, this._fineDensity);
    };
    Worker.prototype.getNodeEnergy = function (nodeIndex) {
        var attraction_factor = this._attraction * this._attraction
            * this._attraction * this._attraction * 2e-2;
        var xDis, yDis;
        var energyDistance;
        var nodeEnergy = 0;
        var n = this._positions[nodeIndex];
        if (this._neighbors[nodeIndex] != null) {
            for (var key in this._neighbors[nodeIndex]) {
                if (this._neighbors[nodeIndex].hasOwnProperty(key)) {
                    var weight = this._neighbors[nodeIndex][key];
                    var m = this._positions[key];
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
                }
            }
            nodeEnergy += this._densityGrid.getDensity(n.x, n.y, this._fineDensity);
            return nodeEnergy;
        }
    };
    Worker.prototype.solveAnalytic = function (nodeIndex) {
        var totalWeight = 0;
        var xDis = 0, yDis = 0, xCen = 0, yCen = 0;
        var x = 0, y = 0;
        var damping = 0;
        var n = this._positions[nodeIndex];
        var map = this._neighbors[nodeIndex];
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                var weight = map[key];
                var m = this._positions[key];
                totalWeight += weight;
                x += weight * m.x;
                y += weight * m.y;
            }
        }
        if (totalWeight > 0) {
            xCen = x / totalWeight;
            yCen = y / totalWeight;
            damping = 1.0 - this._dampingMult;
            var posX = damping * n.x + (1 - damping) * xCen;
            var posY = damping * n.y + (1 - damping) * yCen;
            n.x = posX;
            n.y = posY;
        }
        if (this._minEdges == 99) {
            return;
        }
        if (this._cutEnd >= 39500) {
            return;
        }
        var maxLength = 0;
        var maxIndex = -1;
        var neighborsCount = Object.keys(map).length;
        if (neighborsCount > this._minEdges) {
            for (var key in this._neighbors[nodeIndex]) {
                if (this._neighbors[nodeIndex].hasOwnProperty(key)) {
                    var m = this._positions[key];
                    xDis = xCen - m.x;
                    yDis = yCen - m.y;
                    var dis = xDis * xDis + yDis * yDis;
                    dis *= Math.sqrt(neighborsCount);
                    if (dis > maxIndex) {
                        maxLength = dis;
                        maxIndex = parseInt(key);
                    }
                }
            }
            if (maxLength > this._cutOffLength && maxIndex != -1) {
                delete map[maxIndex];
            }
        }
    };
    Worker.prototype.getTotEnergy = function () {
        var myTotEnergy = 0;
        // TODO: Multi-thread
        for (var i = 0; i < this._positions.length; i++) {
            myTotEnergy += this._positions[i].energy;
        }
        return myTotEnergy;
    };
    Worker.prototype.getNextRandom = function () {
        return Math.random();
    };
    return Worker;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Worker;
