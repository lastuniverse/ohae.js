import { Group, Sprite, Point } from '../src/engine/index.mjs'
import { Rerandom } from '../tools/class.rerandom.mjs'
import bus from '../tools/tool.events.bus.mjs'

const prng = new Rerandom(4);

bus.once('engine.init', game => {
});

bus.once('engine.preload', game => {
    game.loader.image.load('desert', './images/desert.real.png', './images/desert.json');
});

bus.once('engine.create', game => {
});

export class World extends Group {
    frames = [4, 4, 4, 4, 5, 5, 7, 7, 8];
    spriteSize = 115;
    chankSize;
    chanks = {};
    worldWidth;
    worldWidth;

    focus = {
        position: new Point(0, 0)
    };

    setChankSize(size = 8) {
        this.chankSize = size;
    }

    initChank(chankX, chankY) {
        const size = this.spriteSize * this.chankSize;

        const chank = {
            ground: new Group(this.game, size * chankX, size * chankY),
        };

        this.layers.ground.add(chank.ground);

        for (var x = 0; x < this.chankSize; x++) {
            const worldX = this.chankSize * chankX + x;
            for (var y = 0; y < this.chankSize; y++) {
                const worldY = this.chankSize * chankY + y;
                const tile = this.generateTile(worldX, worldY);
                chank.ground.add(tile);
            }
        };
        return chank;
    }

    getChank(chankX, chankY) {
        return this.initChank(chankX, chankY);
    }

    setTile(sprite, worldX, worldY) {

    }

    generateTile(worldX, worldY) {
        const x = Math.abs(this.spriteSize * (worldX % this.chankSize));
        const y = Math.abs(this.spriteSize * (worldY % this.chankSize));
        const sprite = new Sprite(this.game, 'desert', x, y);

        sprite.scale.x *= Math.round(prng.random(worldX, worldY, 1)) * 2 - 1;
        sprite.angle = Math.floor(prng.random(worldX, worldY, 3) * 360);
        sprite.atlas.frame = this.frames[Math.floor(prng.random(worldX, worldY) * this.frames.length)];
        // sprite.tintColor = {r: 96, g: 64, b: 32};
        sprite.tintBrightness = 0.5;

        return sprite;
    }

    constructor(game, width, height) {
        super(game, 0, 0);
        this.worldWidth = width;
        this.worldHeight = height;

        this.layers = {
            ground: new Group(this.game, 0, 0),
            decales: new Group(this.game, 0, 0),
            assets: new Group(this.game, 0, 0),
        }

        Object.values(this.layers).forEach(layer => {
            this.add(layer);
        });
        game.scene.add(this);

        this.setChankSize(8);

        const chank = this.initChank(-1, -1);
        console.log(chank)

    }

    setFocus(object) {
        this.focus = object;
    };

    calculateVisibleChanks() {
        this.layers.ground.clear();

        const divider = this.spriteSize * this.chankSize;
        const dx = this.game.width / 2 / this.scale.x;
        const dy = this.game.height / 2 / this.scale.y;
        const x1 = Math.floor((this.focus.position.x - dx) / divider);
        const y1 = Math.floor((this.focus.position.y - dy) / divider);
        const x2 = Math.ceil((this.focus.position.x + dx) / divider);
        const y2 = Math.ceil((this.focus.position.y + dy) / divider);

        const chanks = {};

        for (var chankX = x1; chankX <= x2; chankX++) {
            for (var chankY = y1; chankY <= y2; chankY++) {
                const key = '' + chankX + '.' + chankY;
                const chank = this.chanks[key] || this.getChank(chankX, chankY);
                chanks[key] = chank;

                if (!chank) continue;
                this.layers.ground.add(chank.ground);
            }
        }

        this.chanks = chanks;
    }

    calculateLighting(timer) {
        const period = 1000 * 60 * 2;
        const time = (timer % period) / period;
        const lighting = 0.1 + 0.4 * Math.abs(Math.sin(time * Math.PI * 2));
        const brightness = Math.floor(lighting * 256) / 256;

        if (brightness === this.tintBrightness) return;
        this.tintBrightness = brightness;
    }

    update(timer) {
        this.calculateLighting(timer.time);
        this.calculateVisibleChanks();
        super.update(timer);

        this.position.x = (this.scale.x * -this.focus.position.x) + this.game.width / 2;
        this.position.y = (this.scale.y * -this.focus.position.y) + this.game.height / 2;
    }
}
