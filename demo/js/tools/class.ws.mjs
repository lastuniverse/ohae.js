import ExtendEventEmitter from './class.extend.event.emitter.mjs'

const protocol = {
    "http:": "ws:",
    "https:": "wss:",
};

export class WS extends ExtendEventEmitter {
    #queue = [];
    #URL = Object.assign(
        new URL(window.location),
        {
            protocol: protocol[window.location.protocol],
            pathname: "/"
        }
    );

    constructor(options = {}) {
        super();
        this.#URL = Object.assign(this.#URL, options);
        this.#connect();
    }

    #connect() {
        this.socket = new WebSocket(this.#URL);

        this.socket.onopen = (...args) => {
            this.emit('open', ...args);
            this.#sendQueue();
        };

        this.socket.onmessage = event => {
            const message = JSON.parse(event.data);
            this.emit(message.name, ...message.data);
        };

        this.socket.onclose = (...args) => {
            this.#clearSocketHandlers();
            this.emit('close', ...args);
            setTimeout(() => { this.#connect() }, 500);
        };

        this.socket.onerror = (...args) => {
            this.#clearSocketHandlers();
            this.emit('error', ...args);
            setTimeout(() => { this.#connect() }, 500);
        };
    }

    #clearSocketHandlers() {
        this.socket.onclose = () => { };
        this.socket.onerror = () => { };
        this.socket.onopen = () => { };
        this.socket.onmessage = () => { };
    }

    #sendQueue() {
        if (this.socket.readyState !== 1) return;
        while (this.#queue.length) {
            if (this.socket.readyState !== 1) return;
            const message = this.#queue.shift();
            this.socket.send(message);
        }
    }

    send(name, ...data) {
        const message = JSON.stringify({
            name,
            data
        });
        this.#queue.push(message);
        this.#sendQueue();
    }
}
