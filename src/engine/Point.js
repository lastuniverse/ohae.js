export class Point {
	#x = 0;
	#y = 0;

	constructor(x, y) {
		this.init(x, y);
	}

	get x() {
		return this.#x;
	}

	set x(value) {
		this.#x = value ?? this.#x ?? 0;
	}

	get y() {
		return this.#y;
	}

	set y(value) {
		this.#y = value ?? this.#y ?? 0;
	}

	#paramsToPoint(x, y, defaultParams = {}) {
		const p = { x: 0, y: 0 };
		if (Array.isArray(x)) {
			p.x = x?.[0] ?? defaultParams?.x ?? 0;
			p.y = x?.[1] ?? defaultParams?.y ?? 0;
		} else if (typeof x === 'object') {
			p.x = x.x ?? defaultParams?.x ?? 0;
			p.y = x.y ?? defaultParams?.y ?? 0;
		} else {
			p.x = x ?? defaultParams?.x ?? 0;
			p.y = y ?? x ?? defaultParams?.y ?? 0;
		}
		return p;
	}

	add(x, y) {
		const p = this.#paramsToPoint(x, y);
		this.#x += p.x;
		this.#y += p.y;
	}

	substract(x, y) {
		const p = this.#paramsToPoint(x, y);
		this.#x -= p.x;
		this.#y -= p.y;
	}

	multiply(x, y) {
		const p = this.#paramsToPoint(x, y);
		this.#x *= p.x;
		this.#y *= p.y;
	}

	divide(x, y) {
		const p = this.#paramsToPoint(x, y);
		this.#x /= p.x;
		this.#y /= p.y;
	}

	init(x, y, context = this) {
		const p = this.#paramsToPoint(x, y, context);
		this.#x = p.x;
		this.#y = p.y;
	}
}
