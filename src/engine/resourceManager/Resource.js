export class Resource {
	_url;
	_data;
	#isUnloaded;
	#isLasy;
	#usageCount = 0;

	constructor(url) {
		if (url instanceof URL) {
			url = url.href;
		}
		this._url = url;
	}

	addNamespace(namespace) {
		this.#isUnloaded = namespace.isUnloaded ? true : this.#isUnloaded ?? namespace.isUnloaded;
		this.#isLasy = !namespace.isLasy ? false : this.#isLasy ?? namespace.isLasy;
		if (!this.#isLasy && !this._isDataInited) this._load();
	}

	free() {
		this.#usageCount = Math.max(0, this.#usageCount--);
		if (!this.#isUnloaded && this.#usageCount === 0) this._data = undefined;
	}

	get url() {
		return this._url;
	}

	get isUnloaded() {
		return this.#isUnloaded;
	}

	get _isDataInited() {
		return this._data !== undefined;
	}

	get data() {
		this.#usageCount++;
		return this._data ?? this._load();
	}

	get ready() {
		return this._data ?? this._load();
	}

	async _load() {
		if (this._isDataInited) return this._data;

		console.log("start load", this._url);
		this._data = fetch(this._url).then(response => {
			console.log("done load", this._url);
			return response;
		});
		return this._data;
	}
}
