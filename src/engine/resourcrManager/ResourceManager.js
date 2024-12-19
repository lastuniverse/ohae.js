import { ExtendEventEmitter } from '../events/ExtendEventEmitter.js'
import { ResourceNameSpace } from './ResourceNameSpace.js';
import { Resource } from './Resource.js';

export class ResourceManager extends ExtendEventEmitter {
	static #namespaces = {};

	constructor() {
		super();
	}

	load(namespaceName, resourceName, url) {
		console.log('load', url)

		if (urlCache.has(url)) {
			return urlCache.get(url);
		}

		const promise = window.fetch(this.baseURL + url)
			.then(response => {
				this.count++;
				return response;
			});

		urlCache.set(Loader.cacheName, url, promise);
		return promise;
	}

	getNamespace(name) {
		return this.createNamespace(name);
	}

	createNamespace(name, isLasy, isUnload) {
		return new ResourceNameSpace(name, isLasy, isUnload);
	}

}
