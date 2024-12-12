import ExtendEventEmitter from '../../tools/class.extend.event.emitter.mjs'

export class Timer extends ExtendEventEmitter {
    #parentTime = 0;
    #timers = {};
    #speed = 1
    time = 0;
    deltaTime = 0;

    constructor() {
        super();
        setTimeout(() => this.#loop(Date.now()), 0)
    }

    get speed() {
        return this.#speed
    }

    set speed(value) {
        if (typeof value !== 'number') throw `Speed must be a number`
        return this.#speed = value;
    }

    create(name, fps = 60) {
        if (typeof name !== 'string') throw `Name of scene must be a string`;
        this.#timers[name] = {
            name,
            time: 0,
            count: 0,
            deltaTime: 0,
            deltaFrame: 0,
            __elapsed: 0,
            ...(this.#timers[name] || {}),
            fps,
            frameTime: 1000 / fps,

        };
    }

    destroy(name) {
        delete this.#timers[name];
    }

    #loop(time) {
        this.deltaTime = time - this.#parentTime;
        this.time += this.deltaTime;


        Object.values(this.#timers).forEach(timer => {
            timer.count++;
            timer.time += this.deltaTime;
            timer.deltaTime += this.deltaTime;
            timer.__elapsed += this.deltaTime;

            if (timer.__elapsed < timer.frameTime) return;

            timer.deltaFrame = timer.deltaTime / timer.frameTime;
            timer.speed = this.#speed;
            this.emit(timer.name, timer);

            timer.count = 0;
            timer.__elapsed = timer.__elapsed % timer.frameTime;
            timer.deltaTime = 0;

        })

        this.#parentTime = time;
        setTimeout(() => this.#loop(Date.now()), 1)
    }
}
