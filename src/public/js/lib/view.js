export default class View {
    // Properties
    #title;

    // Constructor
    constructor(params) {
        // Properties
        if (params !== undefined) {
            for (const [key, value] of Object.entries(params)) {
                this[key] = value;
            }
        }

        // Final methods
        Reflect.defineProperty(this, 'get', {
            value: async (url, body, signal = undefined) => {
                const response = await fetch(url, {
                    method: 'POST',
                    body: new URLSearchParams(body),
                    signal: signal,
                });

                return response.ok ? response.json() : response.status;
            },
            configurable: false,
            writable: false,
            enumerable: true,
        });

        Reflect.defineProperty(this, 'compose', {
            value: () => {
                return new Proxy(
                    (name, ...args) => {
                        const element = document.createElement(name);

                        for (const arg of args.flat(Infinity)) {
                            if (arg instanceof Element) {
                                element.appendChild(arg);
                            } else if (arg instanceof Object) {
                                for (const [key, val] of Object.entries(arg)) {
                                    element.setAttribute(key, val);
                                }
                            } else {
                                element.appendChild(document.createTextNode(arg));
                            }
                        }

                        return element;
                    },
                    { get: (tag, name) => tag.bind(null, name) }
                );
            },
            configurable: false,
            writable: false,
            enumerable: true,
        });

        Reflect.defineProperty(this, 'retry', {
            value: (responseCode) => {
                const { h1, p } = this.compose();

                return [h1(`Error ${responseCode}`), p('Something went wrong, please try again.')];
            },
            configurable: false,
            writable: false,
            enumerable: true,
        });

        Reflect.defineProperty(this, 'setTitle', {
            value: (title) => {
                this.#title = title;
            },
            configurable: false,
            writable: false,
            enumerable: true,
        });

        Reflect.defineProperty(this, 'getTitle', {
            value: () => {
                return this.#title;
            },
            configurable: false,
            writable: false,
            enumerable: true,
        });

        Object.freeze(this);
    }

    // Abstract methods
    async render() {
        throw new Error('Method must be implemented.');
    }
}
