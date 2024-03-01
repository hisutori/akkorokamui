import View from '../lib/view.js';
import Age from '../lib/age.js';

export default class extends View {
    // Constructor
    constructor(params) {
        super(params);
    }

    // Private methods
    #sectionListener(section) {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            section.addEventListener('click', () => {
                section.parentElement.removeAttribute('open');
            });
        }
    }

    #buildComments(comments, hidden = false) {
        const age = new Age();

        const { details, summary, section } = this.compose();

        let html = [];

        for (const comment of comments) {
            if (comment.dead || comment.deleted || comment.flagged) {
                continue;
            }

            const author = summary(
                `${comment.user} - ${age.get(new Date(comment.time * 1000), true, true)}`
            );

            const text = comment.content
                .replaceAll('…', '...')
                .replaceAll('“', '"')
                .replaceAll('”', '"')
                .replaceAll('‘', "'")
                .replaceAll('’', "'")
                .replace(/\s'(.*?)'/g, ' "$1"');
            const content = section();
            content.innerHTML = text;
            this.#sectionListener(content);

            const linkList = content.querySelectorAll('a');

            for (const link of linkList) {
                try {
                    const url = new URL(link.getAttribute('href'));

                    if (url.hostname === 'news.ycombinator.com') {
                        const thread = Number(url.search.match(/\d+/)[0]);

                        link.setAttribute('href', `/t/${thread}`);
                        link.setAttribute('data-link', '');
                        link.textContent = `${window.location.host}/t/${thread}`;
                    }
                } catch {}
            }

            const html2 = [author, content];

            if (comment.comments_count > 0) {
                html2.push(...this.#buildComments(comment.comments, true));
            }

            if (!hidden) {
                html.push(details(html2, { open: '' }));
            } else {
                html.push(details(html2));
            }
        }

        return html;
    }

    // Public methods
    async render() {
        const data = await this.get('/php/thread.php', { t: this.number });

        if (data !== Object(data)) {
            return this.retry(data);
        }

        const { h2, p } = this.compose();

        const html = [h2(data.title)];

        if ('text' in data) {
            html.push(p(data.text));
        } else {
            try {
                const { a } = this.compose();

                html.push(
                    p(
                        a(new URL(data.url).hostname.replace('www.', ''), {
                            href: data.url,
                            target: '_blank',
                            rel: 'noreferrer',
                        })
                    )
                );
            } catch {}
        }

        const comments = this.#buildComments(data.comments);

        if (comments.length) {
            html.push(...comments);
        } else {
            html.push(p('There are no comments yet.'));
        }

        this.setTitle(`${data.title} - Akkorokamui`);

        return html;
    }
}
