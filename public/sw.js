importScripts('./uv/uv.bundle.js');
importScripts('./uv/uv.config.js');
importScripts('./uv/uv.sw.js');

const sw = new UVServiceWorker();

// Add error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('fetch', event => {
    event.respondWith(
        sw.fetch(event).catch(err => {
            console.error('UV fetch error:', err);
            return new Response('UV fetch error: ' + err.message, {
                status: 500,
                headers: { 'Content-Type': 'text/plain' }
            });
        })
    );
});