const SWCODE = `
function createCacheBustedRequest(url) {
    let request = new Request(url, { cache: "reload" });
    if ("cache" in request) {
        return request;
    }
    let bustedUrl = new URL(url, self.location.href);
    bustedUrl.search += (bustedUrl.search ? "&" : "") + "cachebust=" + Date.now();
    return new Request(bustedUrl);
}

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
        .then(cache => cache.addAll(PRECACHE_URLS))
        .then(self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {

    if (
        event.request.mode === "navigate" ||
        (event.request.method === "GET" && event.request.headers.get("accept").indexOf("text/html") > -1)
    ) {
        console.log("Handling fetch event for", event.request.url)
        event.respondWith(fetch(createCacheBustedRequest(event.request.url)).catch(error => {
            console.log("Fetch failed; returning offline page instead.", error)
            return caches.match("index.html")
        }));
    }
});

self.addEventListener('fetch', event => {

    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(RUNTIME).then(cache => {
                    return fetch(event.request).then(response => {
                        return cache.put(event.request, response.clone()).then(() => {
                            return response;
                        });
                    }).catch((err) => { return err; });
                });
            })
        );
    }
});
`;

const REGISTERCODE = `<script>if ('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('sw.js?v={{VERSION}}');});}</script>`;

class ServiceWorkerPlugin {
    constructor ({ version }) {
        this.version = version;
    }
    apply (compiler) {

        compiler.hooks.emit.tapAsync('swfile', (compilation, callback) => {
            console.log(`Service worker is using version ${this.version}.`);

            let filelist = '';
            for (let filename in compilation.assets) {
                filelist += "    '" + filename + "',\n";
            }

            const cacheVars = `const PRECACHE = 'precache-v${this.version}';
const RUNTIME = 'runtime-v${this.version}';
const PRECACHE_URLS = [
    './',
${filelist}];

`;

            compilation.assets['sw.js'] = {
                source: function() {
                    return cacheVars + SWCODE;
                },
                size: function() {
                    return filelist.length;
                }
            };

            callback();
        });

        compiler.hooks.compilation.tap('swregister', compilation => {
            compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap('swregister', ({ html }) => {


                return {
                    html: html.replace('</body>', REGISTERCODE.replace(/{{VERSION}}/g, this.version) + '</body>')
                };
            });
        });
    }
}

module.exports = ServiceWorkerPlugin;
