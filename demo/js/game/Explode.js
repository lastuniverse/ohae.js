import { Group, Sprite } from '../src/engine/index.js'
import { AudioLoader } from '../src/engine/index.js'
import { urlCache } from '../src/engine/urlCache.js'
import bus from '../tools/EventsBus.js'

bus.once('engine.init', game => {
});

bus.once('engine.preload', game => {
    game.loader.image.load('explode', '/images/assets.explode.png', '/images/assets.explode.json');
    game.loader.audio.load('explode', '/sounds/explode.02.mp3');
});

bus.once('engine.create', game => {
});

export class Explode extends Group {
    #time = 0;
    #startTime = 0;
    #duration = 800;

    constructor(game, position, time) {
        super(game, position.x, position.y);
        this.#startTime = time / 2;
        this.visible = false;
        this.explodeSound = urlCache.get(AudioLoader.cacheName, 'explode');

        const sign = Math.round(Math.random()) * 2 - 1

        this.explodeSprite = new Sprite(game, 'explode', 0, 0);
        this.explodeSprite.scale = (0.5 + 0.5 * Math.random());
        this.explodeSprite.scale.x *= sign;
        this.add(this.explodeSprite);
    }

    set tintBrightness(value) {
	}

    update(timer) {
        this.#startTime -= timer.deltaTime;
        if (this.#startTime > 0) return;

        this.#time += timer.deltaTime;

        if (!this.visible) {
            this.visible = true;
            this.explodeSound.play(0.7);
        }

        const q = this.#time / this.#duration;

        const explodeFrameIndex = Math.floor(this.explodeSprite.atlas.frameDataList.length * q);
        this.explodeSprite.atlas.frameName = ('000' + explodeFrameIndex).substr(-3);

        this.opacity = 1 - q;

        if (this.#time > this.#duration) {
            this.visible = false;
            this.destroy();
        }
    }
}
