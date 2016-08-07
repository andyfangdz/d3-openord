/**
 * Created by andy on 8/2/16.
 */
"use strict";
var Stage = (function () {
    function Stage(iterations, temperature, attraction, dampingMult) {
        this._iterations = iterations;
        this._temperature = temperature;
        this._attraction = attraction;
        this._dampingMult = dampingMult;
    }
    Object.defineProperty(Stage.prototype, "iterations", {
        get: function () {
            return this._iterations;
        },
        set: function (value) {
            this._iterations = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "temperature", {
        get: function () {
            return this._temperature;
        },
        set: function (value) {
            this._temperature = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "attraction", {
        get: function () {
            return this._attraction;
        },
        set: function (value) {
            this._attraction = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "dampingMult", {
        get: function () {
            return this._dampingMult;
        },
        set: function (value) {
            this._dampingMult = value;
        },
        enumerable: true,
        configurable: true
    });
    Stage.prototype.getIterationsTotal = function (totalIterations) {
        return Math.floor(this.iterations * totalIterations);
    };
    Stage.prototype.getIterationsPercent = function () {
        return Math.floor(this.iterations * 100);
    };
    return Stage;
}());
exports.Stage = Stage;
var Params = (function () {
    function Params(initial, liquid, expansion, cooldown, crunch, simmer) {
        this._initial = initial;
        this._liquid = liquid;
        this._expansion = expansion;
        this._cooldown = cooldown;
        this._crunch = crunch;
        this._simmer = simmer;
    }
    Object.defineProperty(Params.prototype, "initial", {
        get: function () {
            return this._initial;
        },
        set: function (value) {
            this._initial = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Params.prototype, "liquid", {
        get: function () {
            return this._liquid;
        },
        set: function (value) {
            this._liquid = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Params.prototype, "expansion", {
        get: function () {
            return this._expansion;
        },
        set: function (value) {
            this._expansion = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Params.prototype, "cooldown", {
        get: function () {
            return this._cooldown;
        },
        set: function (value) {
            this._cooldown = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Params.prototype, "crunch", {
        get: function () {
            return this._crunch;
        },
        set: function (value) {
            this._crunch = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Params.prototype, "simmer", {
        get: function () {
            return this._simmer;
        },
        set: function (value) {
            this._simmer = value;
        },
        enumerable: true,
        configurable: true
    });
    Params.prototype.getIterationsSum = function () {
        return this.liquid.iterations +
            this.expansion.iterations +
            this.cooldown.iterations +
            this.crunch.iterations +
            this.simmer.iterations;
    };
    return Params;
}());
exports.Params = Params;
exports.DEFAULT = new Params(new Stage(0, 2000, 10, 1), new Stage(0.25, 2000, 10, 1), new Stage(0.25, 2000, 2, 1), new Stage(0.25, 2000, 1, 0.1), new Stage(0.1, 250, 1, 0.25), new Stage(0.15, 250, 0.5, 0));
