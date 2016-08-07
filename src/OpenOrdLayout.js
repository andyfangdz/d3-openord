"use strict";
var Params_1 = require("./Params");
/**
 * Created by andy on 8/2/16.
 */
var OpenOrdLayout = (function () {
    function OpenOrdLayout() {
        this.running = true;
        this.firstIteration = true;
    }
    OpenOrdLayout.prototype.resetPropertiesValues = function () {
        this.edgeCut = 0.8;
        this.numIterations = 750;
        this.running = true;
        this.realTime = 0.2;
        this.param = Params_1.DEFAULT;
    };
    OpenOrdLayout.prototype.initAlgo = function () {
        if (this.param.getIterationsSum() != 1) {
            this.param = Params_1.DEFAULT;
        }
        var neighbors = new Map();
    };
    return OpenOrdLayout;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OpenOrdLayout;
