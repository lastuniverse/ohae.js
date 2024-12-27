export class Resource {
	#url;
	#data;
	#isUnloaded;
	#isLasy;

	#isStartLoading = false;
	#isDataReady;
	#dataResolve;
	#usageCount = 0;

	constructor(url) {
		this.#url = url.href ?? url;
		this.#isDataReady = new Promise((resolve, reject) => {
			this.#dataResolve = resolve;
		});
	}

	addNamespace(namespace) {
		this.#isUnloaded = namespace.isUnloaded ? true : this.#isUnloaded ?? namespace.isUnloaded;
		this.#isLasy = !namespace.isLasy ? false : this.#isLasy ?? namespace.isLasy;
		if (!this.#isLasy) this._tryLoad();
	}

	free() {
		this.#usageCount = Math.max(0, this.#usageCount--);
		if (!this.#isUnloaded && this.#usageCount === 0) this.#data = undefined;
	}

	get url() {
		return this.#url;
	}

	get isUnloaded() {
		return this.#isUnloaded;
	}

	get data() {
		if (this.#data) this.#usageCount++;
		return this.#data;
	}

	get ready() {
		this._tryLoad();
		return this.#isDataReady;
	}

	async _tryLoad() {
		if (this.#isStartLoading) return this.#data;
		this.#isStartLoading = true;
		this.#data = await this._load();
		this.#dataResolve();
	}

	async _load() {
		return fetch(this.#url).then(response => {
			console.log("done load", this.#url);
			return response;
		});
	}
}
