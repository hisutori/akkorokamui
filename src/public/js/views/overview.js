import View from '../lib/view.js';
import Age from '../lib/age.js';

export default class extends View {
    // Constructor
    constructor(params) {
        super(params);
    }

    // Private methods
    async #inputListener(input) {
        let controller;
        let signal;

        input.addEventListener('input', async () => {
            const query = input.value.trim();

            if (query.length > 2) {
                controller?.abort();

                controller = new AbortController();
                signal = controller.signal;

                const data = await this.get('/php/search.php', { q: query }, signal);

                let html;

                if (data !== Object(data)) {
                    const { tr, td } = this.compose();

                    html = [tr(td('Something went wrong, please try again.'))];
                } else {
                    html = this.#buildThreads(data.hits);
                }

                input.nextSibling.replaceChildren(...html);
            }
        });
    }

    #buildColumn(number) {
        const { td } = this.compose();

        if (!Number.isInteger(number)) {
            return td(0);
        }

        let type;

        if (number <= 5) {
            return td(number);
        } else if (number <= 25) {
            type = 'fresh';
        } else if (number <= 75) {
            type = 'trending';
        } else if (number <= 125) {
            type = 'popular';
        } else {
            type = 'famous';
        }

        return td(number, { class: type });
    }

    #buildThreads(threads) {
        if (threads.length === 0) {
            const { p } = this.compose();

            return p('No results found.');
        }

        const age = new Age();

        const { thead, tr, th, td, a } = this.compose();

        let html = [thead(tr(th('comments'), th('points'), th('age')))];

        for (const thread of threads) {
            const text = (thread.title ?? thread.link_text)
                .replaceAll('“', '"')
                .replaceAll('”', '"')
                .replaceAll('‘', "'")
                .replaceAll('’', "'")
                .replace(/\s'(.*?)'/g, ' "$1"');

            const heading = a(text, {
                href: `/t/${thread.id ?? thread.story_id}`,
                'data-link': '',
            });

            const html2 = [
                this.#buildColumn(thread.num_comments ?? thread.comments),
                this.#buildColumn(thread.points),
                td(age.get(new Date((thread.date ?? thread.created_at_i) * 1000))),
                td(heading, { class: 'title' }),
            ];

            const url = thread.link ?? thread.url;
            if (url) {
                try {
                    const domain = new URL(url).hostname.replace('www.', '');

                    html2.push(td(a(domain, { href: url, target: '_blank', rel: 'noreferrer' })));
                } catch {}
            }

            html.push(tr(html2));
        }

        return html;
    }

    // Public methods
    async render() {
        let data =
            'keywords' in this
                ? (await this.get('/php/search.php', { q: this.keywords })).hits
                : await this.get('/php/overview.php');

        if (data !== Object(data)) {
            return this.retry(data);
        }

        const { input, table } = this.compose();

        const searchBar = input({ type: 'text', placeholder: 'Search...', minlength: 3 });
        this.#inputListener(searchBar);
        const threads = table(this.#buildThreads(data));

        this.setTitle('Akkorokamui');

        return [searchBar, threads];
    }
}
