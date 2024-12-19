import { ExtendEventEmitter } from '../events/ExtendEventEmitter.js'

export class ResourceNameSpace extends ExtendEventEmitter {
	static DEFAULT_NAMESPACE_NAME = "defaultNamespace";
	static #namespaceCache = new Map();
	#resourceCache = new Map();
	#urlCache = new Map();
	#usedCount = 0;
	#name;
	#isLasy;
	#isUnloaded;

	constructor(name = ResourceNameSpace.DEFAULT_NAMESPACE_NAME, isLasy, isUnloaded) {
		super();

		const instance = ResourceNameSpace.#namespaceCache.get(name);
		if (instance) {
			if (isLasy && instance.isLasy !== isLasy) {
				throw new Error(`A namespace with the name "${name}" already exists, the "isLasy" paroperty cannot be changed for an existing namespace!`);
			}
			if (isUnloaded && instance.isUnloaded !== isUnloaded) {
				throw new Error(`A namespace with the name "${name}" already exists, the "isUnloaded" paroperty cannot be changed for an existing namespace!`);
			}
			instance.#usedCount ++;
			return instance;
		}

		this.#name = name;
		this.#isLasy = isLasy ?? false;
		this.#isUnloaded = isUnloaded ?? false;
		this.#usedCount ++;
	}

	addResource(resourceName, resource) {
		if (this.#resourceCache.has(resourceName)) {
			throw new Error(`There is already a resource named "${resourceName}" in the namespace "${this.#name}"!`);
		}

		this.#resourceCache.set(resourceName, resource);
	}

	setResource(resourceName, resource) {
		if (this.#resourceCache.has(resourceName)) {
			console.warn(`There is already a resource named "${resourceName}" in the namespace "${this.#name}"!`);
		}

		this.#resourceCache.set(resourceName, resource);
	}

	getResource(resourceName) {
		const resource = this.#resourceCache.get(resourceName);
		if (!resource) {
			throw new Error(`There is no resource named "${resourceName}" in the namespace "${this.#name}"!`);
		}
		this.#updateResourceUsedCount(resource, 1);
		return resource;
	}

	doneResource(resource) {
		this.#updateResourceUsedCount(resource, -1);
		resource.tryDestroy(this);
	}

	deleteResource(resource) {
		this.#urlCache.delete(resource.url);
		resource.tryDestroy(this);
	}

	getUsedCount(resource) {
		return this.#urlCache.get(resource.url);
	}

	get name() {
		return this.#name;
	}

	get isLasy() {
		return this.#isLasy;
	}

	get isUnloaded() {
		return this.#isUnloaded;
	}

	#updateResourceUsedCount(resource, value) {
		const count = Math.max(0, this.#urlCache.get(resource.url) ?? 0);
		this.#urlCache.set(resource.url, count + value);
	}

	done(){
		this.#usedCount --;
		tryDestroy();
	}

	tryDestroy() {
		if(this.#usedCount>=0) return;
		this.destroy();
	}

	destroy(){
		const list = this.#resourceCache.keys();
		list.forEach(resource=>{
			this.deleteResource(resource)
		});
		this.#resourceCache.clear();
		this.#urlCache.clear();
	}
}