/**
 * Created by andy on 8/2/16.
 */
export let STAGES = new Map<number, string>();

STAGES.set(0, "liquid");
STAGES.set(1, "expansion");
STAGES.set(2, "cooldown");
STAGES.set(3, "crunch");
STAGES.set(5, "simmer");
STAGES.set(6, "complete");
export class Stage {
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

    private _iterations: number;
    private _temperature: number;
    private _attraction: number;
    private _dampingMult: number;

    constructor(iterations: number, temperature: number, attraction: number, dampingMult: number) {
        this._iterations = iterations;
        this._temperature = temperature;
        this._attraction = attraction;
        this._dampingMult = dampingMult;
    }

    public getIterationsTotal(totalIterations: number): number {
        return Math.floor(this.iterations * totalIterations);
    }

    public getIterationsPercent(): number {
        return Math.floor(this.iterations * 100);
    }

}

export class Params {
    constructor(initial: Stage, liquid: Stage, expansion: Stage, cooldown: Stage, crunch: Stage, simmer: Stage) {
        this._initial = initial;
        this._liquid = liquid;
        this._expansion = expansion;
        this._cooldown = cooldown;
        this._crunch = crunch;
        this._simmer = simmer;
    }

    get initial(): Stage {
        return this._initial;
    }

    set initial(value: Stage) {
        this._initial = value;
    }

    get liquid(): Stage {
        return this._liquid;
    }

    set liquid(value: Stage) {
        this._liquid = value;
    }

    get expansion(): Stage {
        return this._expansion;
    }

    set expansion(value: Stage) {
        this._expansion = value;
    }

    get cooldown(): Stage {
        return this._cooldown;
    }

    set cooldown(value: Stage) {
        this._cooldown = value;
    }

    get crunch(): Stage {
        return this._crunch;
    }

    set crunch(value: Stage) {
        this._crunch = value;
    }

    get simmer(): Stage {
        return this._simmer;
    }

    set simmer(value: Stage) {
        this._simmer = value;
    }

    private _initial: Stage;
    private _liquid: Stage;
    private _expansion: Stage;
    private _cooldown: Stage;
    private _crunch: Stage;
    private _simmer: Stage;

    public getIterationsSum(): number {
        return this.liquid.iterations +
            this.expansion.iterations +
            this.cooldown.iterations +
            this.crunch.iterations +
            this.simmer.iterations;
    }
}

export let DEFAULT = new Params(
    new Stage(0, 2000, 10, 1),
    new Stage(0.25, 2000, 10, 1),
    new Stage(0.25, 2000, 2, 1),
    new Stage(0.25, 2000, 1, 0.1),
    new Stage(0.1, 250, 1, 0.25),
    new Stage(0.15, 250, 0.5, 0)
);

export let COARSEN = new Params(
    new Stage(0, 2000, 10, 1),
    new Stage(0.2, 2000, 2, 1),
    new Stage(0.2, 2000, 10, 1),
    new Stage(0.2, 2000, 1, 0.1),
    new Stage(0.05, 250, 1, 0.25),
    new Stage(0.1, 250, 0.5, 0)
);

export let COARSEST = new Params(
    new Stage(0, 2000, 10, 1),
    new Stage(0.2, 2000, 2, 1),
    new Stage(0.2, 2000, 10, 1),
    new Stage(0.2, 2000, 1, 0.1),
    new Stage(0.2, 250, 1, 0.25),
    new Stage(0.1, 250, 0.5, 0)
);

export let REFINE = new Params(
    new Stage(0, 50, 0.5, 0),
    new Stage(0, 2000, 2, 1),
    new Stage(0.05, 500, 0.1, 0.25),
    new Stage(0.05, 200, 1, 0.1),
    new Stage(0.05, 250, 1, 0.25),
    new Stage(0, 250, 0.5, 0)
);
export let FINAL = new Params(
    new Stage(0, 50, 0.5, 0),
    new Stage(0, 2000, 2, 1),
    new Stage(0.05, 50, 0.1, 0.25),
    new Stage(0.05, 200, 1, 0.1),
    new Stage(0.05, 250, 1, 0.25),
    new Stage(0.025, 250, 0.5, 0)
);
export let Presets = {
    DEFAULT, COARSEN, COARSEST, REFINE, FINAL
};