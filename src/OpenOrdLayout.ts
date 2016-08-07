import {Params, DEFAULT} from "./Params";
import Control from "./Control";
import Node from "./Node";
import {InputGraph, InputLink, InputNode} from "./InputGraph";
import Worker from "./Worker";
/**
 * Created by andy on 8/2/16.
 */
export default class OpenOrdLayout {

    private running = true;

    private param: Params;
    private edgeCut: number;
    private numIterations: number;
    private realTime: number;


    private worker: Worker;
    private control: Control;
    private firstIteration = true;

    public inputGraph: InputGraph;


    public resetPropertiesValues() {
        this.edgeCut = 0.8;
        this.numIterations = 750;
        this.running = true;
        this.realTime = 0.2;
        this.param = DEFAULT;
    }

    public initAlgo(inputGraph: InputGraph) {
        this.inputGraph = inputGraph;
        if (this.param.getIterationsSum() != 1) {
            this.param = DEFAULT;
        }
        let numNodes = inputGraph.nodes.length;
        let nodes: Node[] = [];
        for (var i = 0; i < numNodes; i++) {
            nodes.push(new Node(0));
        }
        let neighbors: Map<number, number>[] = [];
        for (var i = 0; i < numNodes; i++) {
            neighbors.push(new Map<number, number>());
        }
        let idMap = new Map<number, number>();
        for (var i = 0; i < numNodes; i++ ) {
            let node = inputGraph.nodes[i];
            nodes[i].id = i;
            nodes[i].x = node.x;
            nodes[i].y = node.y;
            nodes[i].fixed = false; //TODO: support fixed
            idMap.set(node.index, i);
        }

        let highestSimilarity = -Infinity;
        let edges = inputGraph.links.length;
        for (var i = 0; i < edges; i++) {
            let edge = inputGraph.links[i];
            if (edge.source != edge.target) {
                let weight = 1; //TODO: custom weight
                let source = idMap.get(edge.source.index);
                let target = idMap.get(edge.target.index);
                neighbors[source].set(target, weight);
                neighbors[target].set(source, weight);
                highestSimilarity = Math.max(highestSimilarity, weight);

            }
        }
        let someFixed = false;
        for (var i = 0; i < nodes.length; i++) {
            let n = nodes[i];
            if (!n.fixed) {
                n.x = 0;
                n.y = 0;
            } else {
                someFixed = true;
            }
        }

        if (someFixed) {
            //TODO: support fixed
        }

        this.control = new Control();
        this.control.edgeCut = this.edgeCut;
        this.control.realParm = this.realTime;
        this.control.initParams(this.param, this.numIterations);
        this.control.numNodes = numNodes;
        this.control.highestSimilarity = highestSimilarity;

        this.worker = new Worker();
        this.control.initWorker(this.worker);
        this.worker.positions = nodes;
        this.worker.neighbors = neighbors;

        for (var i = 0; i < nodes.length; i++) {
            let n = nodes[i];
            if (n.fixed) {
                this.worker.densityGrid.add(n, this.worker.fineDensity);
            }
        }

        this.running = true;
        this.firstIteration = true;
    }

    public goAlgo(): void {
        //if (this.firstIteration) {
            this.worker.run();
            this.firstIteration = false;
        //}
        this.control.updateStage(this.worker.getTotEnergy());
        this.control.initWorker(this.worker);
        this.writeBack();
        if (!this.canAlgo()) {
            this.worker.done = true;
            this.endAlgo();
        }
    }

    public writeBack(): void {
        for (let i = 0; i < this.inputGraph.nodes.length; i++) {
            let n = this.worker.positions[i];
            this.inputGraph.nodes[i].x = n.x * 3 + 480;
            this.inputGraph.nodes[i].y = n.y * 3 + 300;
        }
    }

    private normalizeWeight(weight: number, highestSimilarity: number) {
        weight /= highestSimilarity;
        weight = weight * Math.abs(weight);
        return weight;
    }

    public endAlgo(): void {
        this.running = false;
    }

    public canAlgo(): boolean {
        return this.running;
    }

}