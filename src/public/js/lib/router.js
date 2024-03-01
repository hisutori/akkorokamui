export default class Router {
    // Properties
    #routes;
    #views = new Map();
    #history = [];

    #main = document.body.children[2];

    // Constructor
    constructor(routes) {
        // Singleton
        if (Router._instance) {
            return Router._instance;
        }

        Router._instance = this;

        // Properties
        this.#routes = routes;

        // Listen
        window.addEventListener('popstate', (event) => {
            event.preventDefault();

            this.#run(location.pathname, true);
        });

        document.body.addEventListener('click', (event) => {
            const target = event.target;

            if (target.hasAttribute('data-link')) {
                event.preventDefault();

                this.#run(event.target.getAttribute('href'));
            }
        });

        history.replaceState({ index: 0 }, null, location.href);

        this.#run(location.pathname);

        Object.freeze(this);
    }

    // Private methods
    async #run(pathname, redo = false) {
        const routes = this.#routes;

        const potentialMatches = routes.map((route) => ({
            route: route,
            result: pathname.match(
                new RegExp('^' + route.path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$')
            ),
        }));

        let match = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);
        if (!match) {
            match = {
                route: routes[0],
                result: [pathname],
            };
        }

        let view;
        let html;

        if (this.#views.has(pathname)) {
            view = this.#views.get(pathname);
        } else {
            if ('html' in match.route) {
                const response = await fetch(match.route.html);

                view = await response.text();
                this.#views.set(pathname, view);
            } else {
                const loading = await match.route.view();
                view = loading.default
                    ? new loading.default(this.#getParams(match))
                    : new loading.view(this.#getParams(match));

                this.#views.set(pathname, view);
            }
        }

        const index = history.state.index;

        if (redo) {
            html = this.#history[index];

            history.replaceState({ index: index }, null, pathname);
        } else {
            if (typeof view === 'string') {
                const foo = document.createElement('main');
                foo.innerHTML = view;
                html = foo.childNodes;
            } else {
                html = await view.render();
            }

            if (pathname === location.pathname) {
                history.replaceState({ index: index }, null, pathname);
            } else {
                history.pushState({ index: index + 1 }, null, pathname);
            }

            this.#history[history.state.index] = html;

            scrollTo(0, 0);
        }

        const title = match.route.title ?? view.getTitle();
        document.title = title;

        this.#main.replaceChildren(...html);
    }

    #getParams(match) {
        const values = match.result.slice(1);
        const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]);

        return Object.fromEntries(
            keys.map((key, i) => {
                return [key, values[i]];
            })
        );
    }
}
