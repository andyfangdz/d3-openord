/**
 * Created by andy on 7/13/16.
 */
"use strict";
function make2DArray(value, xDimension, yDimension) {
    var res;
    res = [];
    for (var i = 0; i < xDimension; i++) {
        res[i] = [];
        for (var j = 0; j < yDimension; j++) {
            res[i][j] = value;
        }
    }
    return res;
}
exports.make2DArray = make2DArray;
