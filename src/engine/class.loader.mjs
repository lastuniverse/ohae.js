import ExtendEventEmitter from '../../tools/class.extend.event.emitter.mjs'
import { urlCache } from './single.url.cache.mjs'

export class Loader extends ExtendEventEmitter {
    static cacheName = "images";
    #amount = 0;
    #count = 0;
    #baseURL = '/';

    constructor(baseURL = '/') {
        super();
        this.baseURL = baseURL;
    }

    get isLoad() {
        return (this.#count === this.#amount)
    }

    get progress() {
        return {
            amount: this.#amount,
            count: this.#count,
            percent: Math.floor(100 * this.#count / this.#amount),
        };
    }

    get amount() {
        return this.#amount;
    }

    set amount(value) {
        const delta = value - this.#amount;
        this.#amount = value;

        if (!this.loader) return;

        this.loader.amount += delta;
    }

    get count() {
        return this.#count;
    }

    set count(value) {
        const delta = value - this.#count;
        this.#count = value;

        if (this.#count === this.#amount) {
            this.emit('progress', this.progress);
            this.emit('load', this.progress);
        } else {
            this.emit('progress', this.progress);
        }

        if (!this.loader) return;
        this.loader.count += delta;
    }

    get baseURL() {
        return this.#baseURL;
    }

    set baseURL(value) {
        if (typeof value !== 'string') throw `URL must be a non-empty string'`;
        this.#baseURL = value;
        this.emit('setBaseURL', value);
    }

    load(url) {
        console.log('load', url)

        if (urlCache.has(Loader.cacheName, url)) return urlCache.get(Loader.cacheName, url);

        this.amount++;

        const promise = window.fetch(this.baseURL + url)
            .then(response => {
                this.count++;
                return response;
            });

        urlCache.set(Loader.cacheName, url, promise);
        return promise;
    }

    get(name) {
        return urlCache.get(Loader.cacheName, name);
    }

}




