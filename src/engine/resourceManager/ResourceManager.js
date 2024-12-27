import { Resource } from './Resource.js';
import { ResourceOfImage } from './ResourceOfImage.js'
import { ResourceOfSpriteSheet } from './ResourceOfSpriteSheet.js'
import { ResourceOfSound } from './ResourceOfSound.js'
import { ResourceNamespace } from './ResourceNameSpace.js';

export class ResourceManager {
    static #resourceTypes = new Map();
    static #nameSpaces = new Map();
    static #baseURL = '/';
    static DEFAULT_RESOURCE_TYPE = 'raw';

    constructor() { }

    static setBaseURL(baseURL) {
        ResourceManager.#baseURL = baseURL;
    }

    static addResourceType(resourceType, ResourceClass) {
        if (ResourceManager.#resourceTypes.has(resourceType)) {
            console.warn(`Class of Resource for type '${resourceType}' is already registered.`)
            return;
        }
        ResourceManager.#resourceTypes.set(resourceType, ResourceClass);
    }

    getResourceType(resourceType) {
        if (!ResourceManager.#resourceTypes.has(resourceType)) {
            throw new Error(`Not found registered class of Resource for type '${resourceType}'.`);
        }
        return ResourceManager.#resourceTypes.get(resourceType);
    }

    addNamespace(namespaceName, isLasy = true, isUnloaded = false) {
        if (ResourceManager.#nameSpaces.has(namespaceName)) {
            // return ResourceManager.#nameSpaces.get(namespaceName);            
            throw new Error(`Namespace '${namespaceName}' is already exist.`);
        }
        const namespace = new ResourceNamespace(namespaceName, isLasy, isUnloaded);
        ResourceManager.#nameSpaces.set(namespaceName, namespace);
    }

    deleteNamespace(namespaceName) {
        if (ResourceManager.#nameSpaces.has(namespaceName)) {
            console.warn(`Namespace '${namespaceName}' does not exist.`);
            return;
        }
        const namespace = this.getNamespace(namespaceName);
        namespace.destroy();
        ResourceManager.#nameSpaces.delete(namespaceName);
    }

    getNamespace(namespaceName) {
        if (!ResourceManager.#nameSpaces.has(namespaceName)) {
            throw new Error(`Namespace '${namespaceName}' does not exist.`);
        }
        return ResourceManager.#nameSpaces.get(namespaceName);
    }

    addResource(namespaceName, resourceName, url, resourceType = ResourceManager.DEFAULT_RESOURCE_TYPE) {
        const namespace = this.getNamespace(namespaceName);
        const ResourceClass = this.getResourceType(resourceType);
        const targetURL = new URL(url, ResourceManager.#baseURL);

        const resource = new ResourceClass(targetURL);
        namespace.addResource(resourceName, resource);
    }

    addNamespaceResources(targetNamespaceName, sourceNamespaceName) {
        const targetNamespace = this.getNamespace(targetNamespaceName);
        const sourceNamespace = this.getNamespace(sourceNamespaceName);
        targetNamespace.addNamespaceResources(sourceNamespace)
    }

    getResource(namespaceName, resourceName) {
        const namespace = this.getNamespace(namespaceName);
        return namespace.getResource(resourceName);
    }


    ready(namespaceName) {
        const promises = [];

        if (namespaceName) {
            const namespace = this.getNamespace(namespaceName);
            promises.push(namespace.ready);
        } else {
            ResourceManager.#nameSpaces.forEach(namespace => {
                promises.push(namespace.ready);
            });
            
        }
        return Promise.all(promises);
    }


    // clearResource(url) {
    //     this.urlCache.delete(url);
    // }

    // freeResource(url) {
    //     const resource = this.urlCache.get(url);

    //     if (!resource) return;
    //     resource.usageCount = Math.max(0, resource.usageCount - 1);

    // 	if (resource.isUnloaded || resource.usageCount > 0) return;
    //     this.clearResource(url);
    // }
}

const url = new URL(window.location);
url.pathname = url.pathname.replace(/\/[^\/]*$/, '');

ResourceManager.setBaseURL(url.href);
ResourceManager.addResourceType(ResourceManager.DEFAULT_RESOURCE_TYPE, Resource);
ResourceManager.addResourceType('image', ResourceOfImage);
ResourceManager.addResourceType('spritesheet', ResourceOfSpriteSheet);
ResourceManager.addResourceType('sound', ResourceOfSound);