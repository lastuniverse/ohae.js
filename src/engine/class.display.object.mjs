import { Point } from './class.point.mjs'
const toRadMultiplier = Math.PI / 180;
const toGradMultiplier = 180 / Math.PI;

export class DisplayObject {
	#position = new Point();
	#scale = new Point(1, 1);
	#pivot = new Point(0.5, 0.5);
	#rotate = 0;
	#opacity = 1;
	_tint;
	_tintColor;
	_tintOpacity;
	_tintBrightness;
	smoothing = false;
	visible = true;
	mustDestroyed = false;
	pause = false;

	constructor(game) {
		this.game = game;
		this.context = game.context;
	}

	get position() {
		return this.#position;
	}

	set position(value) {
		this.#position.init(value);
	}

	get scale() {
		return this.#scale;
	}

	set scale(value) {
		this.#scale.init(value);
	}

	get pivot() {
		return this.#pivot;
	}

	set pivot(value) {
		this.#pivot.init(value);
	}

	get anchor() {
		return this.#pivot;
	}

	set anchor(value) {
		this.#pivot.init(value);
	}

	get rotate() {
		return this.#rotate;
	}

	set rotate(value) {
		this.#rotate = value ?? this.#rotate ?? 0;
	}

	get angle() {
		return this.#rotate * toGradMultiplier;
	}

	set angle(value) {
		this.#rotate = (value ?? this.#rotate ?? 0) * toRadMultiplier;
	}

	get opacity() {
		return this.#opacity;
	}

	set opacity(value) {
		this.#opacity = value ?? this.#opacity ?? 0;
	}

	get tint() {
		return this._tint;
	}

	set tint(value) {
		this._tint = value;
	}

	get tintColor() {
		return this._tintColor;
	}

	set tintColor(value) {
		if (!value) {
			this._tintColor = undefined;
			this.tint = undefined;
			return;
		}

		const isTintColorChanged = !this._tintColor || this._tintColor.toString() !== value.toString();
		if (!isTintColorChanged) return;

		this._tintColor = value;
		this.#setCalculatedTint(this._tintColor, this._tintOpacity);
	}

	get tintOpacity() {
		return this._tintOpacity;
	}

	set tintOpacity(value) {
		if (!isFinite(value)) {
			this._tintOpacity = undefined;
			this.tint = undefined;
			return;
		}

		const isTintOpacityChanged = !isFinite(this._tintOpacity) || this._tintOpacity !== value;
		if (!isTintOpacityChanged) return;

		this._tintOpacity = value;
		this.#setCalculatedTint(this._tintColor, this._tintOpacity);
	}

	get tintBrightness() {
		return this._tintBrightness;
	}

	set tintBrightness(value) {
		if (!isFinite(value)) {
			this._tintBrightness = undefined;
			this.tint = undefined;
			return;
		}
		this._tintBrightness = tintBrightness;
	}

	#setCalculatedTint() {
		if (!this._tintColor || !isFinite(this._tintOpacity)) {
			this.tint = undefined;
			return;
		}
		this.tint = `rgba(${this._tintColor.r}, ${this._tintColor.g}, ${this._tintColor.b}, ${this._tintOpacity})`;
	}

	destroy() {
		this.mustDestroyed = true;
	}

	update() {
	}

	render() {
	}
}