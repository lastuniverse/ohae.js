import { Loader } from './class.loader.js'
import { audioContext, Sound } from './Sound.js'
import { urlCache } from './urlCache.js'

export class AudioLoader extends Loader {
    static cacheName = "sounds";

    constructor(loader) {
        super();

        if (!loader instanceof Loader) return;

        this.loader = loader;
        this.loader.audio = this;

        this.baseURL = loader.baseURL;
        loader.on('setBaseURL', baseURL => {
            this.baseURL = baseURL;
        });
    }

    load(name, audioURL) {
        if (!name || typeof name !== 'string') throw `Name must be a non-empty string`;
        if (urlCache.has(AudioLoader.cacheName, name)) throw `Image with name '${name}' already loaded. Change image name for load.`;

        this.amount++;

        this.loader.load(audioURL)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.count++;
                urlCache.set(AudioLoader.cacheName, name, new Sound(audioBuffer));
            });
    }
}



