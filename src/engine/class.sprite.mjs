import { DisplayObject } from './class.display.object.mjs'
import { Frames } from './class.frames.mjs'
import { ImageLoader } from './class.loader.image.mjs'
import { urlCache } from './single.url.cache.mjs'

export class Sprite extends DisplayObject {

	constructor(game, name, x, y) {
		super(game);
		this.position = { x, y };

		const atlas = urlCache.get(ImageLoader.cacheName, name);
		if (!atlas) throw `Image with name '${name}' not found in cache. You must download it before using it.`

		this.atlas = new Frames(atlas.image, atlas);
	}

	get tint() {
		return this.atlas.tint;
	}

	set tint(value) {
		this.atlas.tint = value;
	}

	get tintBrightness() {
		return this.atlas.brightness;
	}

	set tintBrightness(value) {
		this.atlas.brightness = value;
	}

	update() {

	}

	render() {
		if (!this.visible) return;
		if (this.mustDestroyed) return;

		const px = this.pivot.x * this.atlas.width;
		const py = this.pivot.y * this.atlas.height;

		this.context.save();

		this.context.translate(this.position.x, this.position.y);
		this.context.scale(this.scale.x, this.scale.y);
		this.context.rotate(this.rotate);
		this.context.globalAlpha *= this.opacity;
		this.context.imageSmoothingEnabled = this.smoothing;

		this.atlas.draw(this.context, -px, -py, this.atlas.width, this.atlas.height);

		this.context.restore();
	}
}
