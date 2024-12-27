export class ResourceNamespace {
	#name;
	#isLasy = false;
	#isUnloaded = false;
	#resources = new Map();

	constructor(namespaceName, isLasy = false, isUnloaded = false) {
		this.#name = namespaceName;
		this.#isLasy = isLasy;
		this.#isUnloaded = isUnloaded;
	}

	addNamespaceResources(namespace) {
		namespace.resources.forEach((resource, resourceName) => {
			this.addResource(`${namespace.name}.${resourceName}`, resource);
		});
	}

	addResource(resourceName, resource) {
		if (this.#resources.has(resourceName)) {
			throw new Error(`Resource ${resourceName} is already exists in namespace.`);
		}

		this.#resources.set(resourceName, resource);
		resource.addNamespace(this);
	}

	getResource(resourceName) {
		if (!this.hasResource(resourceName)) {
			throw new Error(`Resource ${resourceName} not found in namespace.`);
		}

		return this.#resources.get(resourceName).data;
	}

	hasResource(resourceName) {
		return this.#resources.has(resourceName);
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

	get resources() {
		return new Map(this.#resources);
	}

	get ready() {
		const promises = [];
		this.#resources.forEach(resource => {
			promises.push(resource.ready);
		});
		return Promise.all(promises);
	}

	destroy() {
		// this.#resources.forEach(resource => {
		// 	resource.free();
		// });
		this.#resources.clear();
	}
}