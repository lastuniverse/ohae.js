import { ExtendEventEmitter } from '../events/ExtendEventEmitter.js'
import { ResourceNameSpace } from './ResourceNameSpace.js';

export class Resource extends ExtendEventEmitter {
	static #urlCache = new Map();
	#nameSpaces = new Map();
	#usedCount = 0;
	#url;
	#data;

	constructor(url, namespaceName = ResourceNameSpace.DEFAULT_NAMESPACE_NAME) {
		super();

		const instance = Resource.#urlCache.get(url);
		if (instance) {
			this.#updateInstance(instance, namespaceName);
			return instance;
		}

		this.#url = url;
		this.#updateInstance(this, namespaceName);
	}

	get data() {
		return tryStartLoad();
	}

	get url() {
		return this.#url;
	}

	get isUnload() {
		return this.#nameSpaces.some(namespace => namespace.isUnload);
	}

	get isLasy() {
		return this.#nameSpaces.every(namespace => namespace.isLasy);
	}

	get usedCount() {
		return this.#nameSpaces.reduce((acc, namespace) => acc + namespace.getUsedCount(this.#url), 0);
	}

	#updateInstance(instance, namespaceName) {
		// instance.#usedCount ++;
		namespace = instance.#addNamespace(namespaceName);

		if (!instance.isLasy) {
			instance.#load(instance.#url);
		}
	}

	#addNamespace(namespaceName) {
		namespace = this.#getNamespace(namespaceName);
		this.#nameSpaces.set(namespaceName, namespace);
	}

	#removeNamespace(namespaceName) {
		this.#nameSpaces.delete(namespaceName);
	}

	#getNamespace(namespaceName) {
		const namespace = new ResourceNameSpace(namespaceName);
		this.#nameSpaces.set(namespaceName, namespace);
		return namespace;
	}

	async #load() {
		console.log('load', url)

		if (this.#data) {
			return this.#data;
		}

		this.#data = window.fetch(this.#url)
			.then(response => {
				return response;
			});

		return this.#data;
	}

	tryDestroy(namespace) {
		if (!namespace.getUsedCount(this)) this.#removeNamespace(namespace.name);
		if (this.isUnload) return;
		if (this.usedCount > 0) return;
		this.destroy();
	}

	destroy(){
		Resource.#urlCache.delete(this.url);
	}
}