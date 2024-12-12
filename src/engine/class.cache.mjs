export class Cache {
    #data = new Map();

    constructor() {
    }

    has(...keys) {
        let data = this.#data;
        
        return keys.every(key => {
            if (!data.has(key)) return false;
            data = data.get(key);
            return true;
        });
    }

    set(...keys) {
        if (keys.length < 2) throw 'The method requires at least two arguments - a key and a value.';
        
        const value = keys.pop();
        if (value === undefined) throw `Data for cache item '${name}' cannot be undefined.`;

        let data = this.#data;

        return keys.forEach((key, index) => {
            const isLast = index + 1 === keys.length;
            const isPresent = data.has(key);

            if (isLast) {
                data.set(key, value)
            } else if (isPresent) {
                data = data.get(key);
            } else {
                const nextData = new Map();
                data.set(key, nextData)
                data = nextData;
            };
        });
    }

    get(...keys) {
        if (!keys.length) throw 'The method requires at least one argument.';

        let data = this.#data;
        
        const isPresent = keys.every(key => {
            if (!data.has(key)) return false;
            data = data.get(key);
            return true;
        });

        return isPresent ? data : undefined;
    }

    delete(...keys) {
        if (!keys.length) throw 'The method requires at least one argument.';

        const lastKey = keys.pop();
        const data = get(...keys);
        data?.delete(lastKey);
    }

    clear(...keys) {
        let data = keys.length ? get(...keys) : this.#data;
        data?.clear();
    }

    get size(){
        return this.#data.size;
    }
}
