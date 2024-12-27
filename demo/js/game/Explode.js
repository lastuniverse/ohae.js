import { Group, Sprite } from '../src/engine/index.js'
import bus from '../tools/EventsBus.js'

bus.once('engine.init', game => {
});

bus.once('engine.preload', game => {
    game.resourceManager.addNamespace('explodes', false, false);
    game.resourceManager.addResource('explodes', 'explode', '/sprites/game/assets.explode.json', 'spritesheet');
    game.resourceManager.addResource('explodes', 'explode_sound', '/sounds/explode.02.mp3', 'sound');
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
        this.explodeSound = this.game.resourceManager.getResource('explodes', 'explode_sound');

        const sign = Math.round(Math.random()) * 2 - 1
        const explode = this.game.resourceManager.getResource('explodes', 'explode');
        this.explodeSprite = new Sprite(game, explode, 0, 0);
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
