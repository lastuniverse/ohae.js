import { DisplayObject } from './class.display.object.mjs'

export class Group extends DisplayObject {
    #childrens = [];

    constructor(game, x, y) {
        super(game);
        this.position = { x, y };

    }

    get childrens() {
        return this.#childrens;
    }

    set tint(value) {
        this._tint = value;
        this.#childrens.forEach(item => {
            if (!item.visible) return;
            if (item.mustDestroyed) return;
            item.tint = value;
        });
    }

    set tintOpacity(value) {
        this._tintOpacity = value;
        this.#childrens.forEach(item => {
            if (!item.visible) return;
            if (item.mustDestroyed) return;
            item.tintOpacity = value;
        });
    }

    set tintColor(value) {
        this._tintColor = value;
        this.#childrens.forEach(item => {
            if (!item.visible) return;
            if (item.mustDestroyed) return;
            item.tintColor = value;
        });
    }

    set tintBrightness(value) {
        this._tintBrightness = value;
        this.#childrens.forEach(item => {
            if (!item.visible) return;
            if (item.mustDestroyed) return;
            item.tintBrightness = value;
        });
    }

    clear() {
        this.#childrens = [];
    }

    add(item) {
        if (item instanceof DisplayObject) {
            this.#childrens.push(item);
            item.item = this._tint;
        }
        item.parent = this;
    }

    update(timer) {
        if (this.pause) return;
        if (this.mustDestroyed) return;

        this.#childrens = this.#childrens.filter(item => {
            if (item.mustDestroyed) return false;
            item.update(timer);
            return true;
        });
    }

    render() {
        if (!this.visible) return;
        if (this.mustDestroyed) return;

        this.context.save();

        this.context.translate(this.position.x, this.position.y);
        this.context.scale(this.scale.x, this.scale.y);
        this.context.rotate(this.rotate);
        this.context.globalAlpha *= this.opacity;
        this.context.imageSmoothingEnabled = this.smoothing;

        this.#childrens.forEach(item => {
            if (!item.visible) return;
            if (item.mustDestroyed) return;
            item.render();
        });

        this.context.restore();
    }
}
