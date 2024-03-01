import Router from './lib/router.js';

new Router([
    {
        title: 'Page not found',
        path: '/404',
        html: './html/404.html',
    },
    {
        title: 'Shortcuts',
        path: '/shortcuts',
        html: './html/shortcuts.html',
    },
    {
        title: 'About',
        path: '/about',
        html: './html/about.html',
    },
    {
        title: 'Privacy',
        path: '/privacy',
        html: './html/privacy.html',
    },
    {
        title: 'Disclaimer',
        path: '/disclaimer',
        html: './html/disclaimer.html',
    },
    {
        path: '/t/:number',
        view: async () => await import('./views/thread.js'),
    },
    {
        path: '/s/:keywords',
        view: async () => await import('./views/overview.js'),
    },
    {
        path: '/',
        view: async () => await import('./views/overview.js'),
    },
]);
