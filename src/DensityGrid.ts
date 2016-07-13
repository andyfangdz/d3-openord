/*
 Copyright 2007 Sandia Corporation. Under the terms of Contract
 DE-AC04-94AL85000 with Sandia Corporation, the U.S. Government retains
 certain rights in this software.
 All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are
 met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 * Neither the name of Sandia National Laboratories nor the names of
 its contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import Node from './Node';
import std from 'typescript-stl';
import Deque = std.Deque;

const GRID_SIZE = 1000;
const VIEW_SIZE = 4000;
const RADIUS = 10;
const HALF_VIEW = 2000;
const VIEW_TO_GRID = 0.25;
const HIGH_DENSITY = 10000;

export default class DensityGrid {

    private density: number[][];
    private falloff: number[][];
    private bins: Deque<Node>[][];

    init(): void {
        this.density = new number[GRID_SIZE][GRID_SIZE];
        this.falloff = new number[RADIUS * 2 + 1][RADIUS * 2 + 1];
        this.bins = new Deque<Node>[GRID_SIZE][GRID_SIZE];

        for (var i = -RADIUS; i <= RADIUS; i++) {
            for (var j = -RADIUS; j <= RADIUS; j++) {
                this.falloff[i + RADIUS][j + RADIUS] =
                    ((RADIUS - Math.abs(i)) / Radius) *
                    ((RADIUS - Math.abs(j)) / Radius)
            }
        }
    }

    getDensity(nX: number, nY: number, fineDensity: boolean): number {
        var xGrid: number, yGrid: number;
        var xDist: number, yDist: number, distance: number, density: number = 0;
        var boundary: number = 10;

        xGrid = Math.floor((nX + HALF_VIEW + 0.5) * VIEW_TO_GRID);
        yGrid = Math.floor((nY + HALF_VIEW + 0.5) * VIEW_TO_GRID);

        if (xGrid > GRID_SIZE - boundary || xGrid < boundary) {
            return HIGH_DENSITY;
        }
        if (yGrid > GRID_SIZE - boundary || yGrid < boundary) {
            return HIGH_DENSITY;
        }

        if (fineDensity) {
            for (var i = yGrid - 1; i <= yGrid + 1; i++) {
                for (var j = xGrid - 1; j <= xGrid + 1; j++) {
                    var deque: Deque<Node> = bins[i][j];
                    if (deque != null) {
                        for (let bi = deque.begin(); !bi.equal_to(deque.end()); bi = bi.next()) {
                            xDist = nX - bi.x;
                            yDist = nY - bi.y;
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


    add(n: Node, fineDensity: boolean): void {

        var xGrid: number, yGrid: number;

        xGrid = Math.floor((n.x + HALF_VIEW + .5) * VIEW_TO_GRID);
        yGrid = Math.floor((n.y + HALF_VIEW + .5) * VIEW_TO_GRID);

        n.subX = n.x;
        n.subY = n.y;

        if (fineDensity) {
            var deque: Deque<Node> = this.bins[yGrid][xGrid];
            if (deque != null) {
                deque.push_back(n);
            }
        } else {
            var diam: number;

            xGrid -= RADIUS;
            yGrid -= RADIUS;
            diam = 2;

            if ((xGrid + RADIUS >= GRID_SIZE) || (xGrid < 0)
                || (yGrid + RADIUS >= GRID_SIZE || (yGrid < 0))) {
                throw new Error("Error: Exceeded density grid with "
                    + "xGrid = " + xGrid + " and yGrid = " + yGrid);
            }

            for (var i = 0; i <= diam; i++) {
                var oldXGrid = xGrid;

                for (var j = 0; j <= diam; j++) {
                    this.density[yGrid][xGrid] += this.falloff[i][j]; // TODO: Double-check
                    xGrid++;
                }
                yGrid++;
                xGrid = oldXGrid;
            }
        }
    }

    subtract(n: Node, fineFirstAdd: boolean, fineDensity: boolean): void {
        var xGrid: number, yGrid: number;

        xGrid = Math.floor((n.x + HALF_VIEW + .5) * VIEW_TO_GRID);
        yGrid = Math.floor((n.y + HALF_VIEW + .5) * VIEW_TO_GRID);

        if (fineDensity && !fineFirstAdd) {
            var deque = bins[yGrid][xGrid];
            if (deque != null) {
                deque.pop_front();
            }
        } else {
            var diam: number = 2 * RADIUS;


        }

    }
}