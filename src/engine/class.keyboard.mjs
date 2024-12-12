export class Keyboard {

	constructor(lesteners = {}, context) {
		this.keys = {};
		this.keyList = [];
		this.listeners = {};
		this.isActive = false;

		window.addEventListener("keydown", this.downListener.bind(this), false);
		window.addEventListener("keyup", this.upListener.bind(this), false);

		this.setListeners(lesteners, context ?? this);
	}

	stop() {
		this.isActive = false;
	}

	start() {
		this.isActive = true;
	}

	setListeners(list, context) {
		if (!list || typeof list !== 'object') return;
		if (!context) context = null;
		this.listeners = {};
		this.keyList = [];
		Object.keys(list).forEach(key => {
			key = key.toUpperCase();
			if (typeof list[key] !== 'function') return;
			this.listeners[key] = function (...args) {
				list[key].call(context, ...args);
			};
			this.keyList.push(key);
		}, this);
	}

	downListener(event) {
		if (!this.isActive) return;
		const key = event.code.replace(/^(Key|Digit)/i, '').toUpperCase();
		if (this.keys[key]) return;
		this.keys[key] = true;

		if (this.listeners[key])
			this.listeners[key]('down', key);
	}

	upListener(event) {
		if (!this.isActive) return;
		const key = event.code.replace(/^(Key|Digit)/i, '').toUpperCase();
		if (!this.keys[key]) return;
		this.keys[key] = false;

		if (this.listeners[key])
			this.listeners[key]('up', key);
	}

	pressListener(timer) {
		if (!this.isActive) return;

		this.keyList.forEach(key => {
			if (!this.keys[key]) return;
			if (this.listeners[key])
				this.listeners[key]('press', key, timer);
		});
	}

	update(timer) {
		this.pressListener(timer);
	}
}
