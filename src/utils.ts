/**
 * Created by andy on 7/13/16.
 */

export function make2DArray(value: any, xDimension: number, yDimension: number): any[][] {
    let res: any[][];

    res = [];
    for (let i = 0; i < xDimension; i++) {
        res[i] = [];
        for (let j = 0; j < yDimension; j++) {
            res[i][j] = value;
        }
    }
    return res;
}
