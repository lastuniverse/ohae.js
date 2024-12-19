import { tint } from '../../tools/ImageTint.js'
import { Loader} from './class.loader.js'
import { SpriteFrames } from './SpriteFrames.js'
import { urlCache } from './urlCache.js'

export class ImageLoader extends Loader {
    cacheName = "images";

    constructor(loader) {
        super();

        if (!loader instanceof Loader) return;
        this.loader = loader;
        this.loader.image = this;

        this.baseURL = loader.baseURL;
        loader.on('setBaseURL', baseURL => {
            this.baseURL = baseURL;
        });
    }

    load(name, imageURL, atlasURL) {
        if (!name || typeof name !== 'string') throw `Name must be a non-empty string`;
        if (urlCache.has(ImageLoader.cacheName, name)) throw `Image with name '${name}' already loaded. Change image name for load.`;

        this.amount++;
        const img = new Image();

        if (atlasURL) {
            this.loader.load(atlasURL)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    img.addEventListener('load', () => {
                        const frames = new SpriteFrames(img);
                        frames.setAtlasData(data);
                        urlCache.set(ImageLoader.cacheName, name, frames);
                        this.count++;
                    }, false);

                    img.src = this.baseURL + imageURL;
                });
        } else {
            const img = new Image();
            img.addEventListener('load', () => {
                const frames = new SpriteFrames(img);
                urlCache.set(ImageLoader.cacheName, name, frames)
                this.count++;
            }, false);

            img.src = this.baseURL + imageURL;
        }


    }

    tint(name, sourceName, hue = 0.5, saturation = 1, white = 1, black = 0) {
        if (!name || typeof name !== 'string') throw `Name must be a non-empty string`;
        if (urlCache.has(ImageLoader.cacheName, name)) throw `Image with name '${name}' already exists. Change image name for use tint().`;

        if (!sourceName || typeof sourceName !== 'string') throw `SourceName must be a non-empty string`;
        const sourceFrames = urlCache.get(ImageLoader.cacheName, sourceName);

        if (!sourceFrames) throw `Image with sourceName '${sourceName}' not found in cache. You must download it before using it.`

        const destinationImage = tint(sourceFrames.image, hue, saturation, white, black);
        const destinationFrames = new SpriteFrames(destinationImage, sourceFrames);

        urlCache.set(ImageLoader.cacheName, name, destinationFrames);
    }
}
