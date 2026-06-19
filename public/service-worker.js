const CACHE = 'mb-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	if (url.origin !== location.origin || request.method !== 'GET') return;

	const isAsset =
		request.destination === 'style' ||
		request.destination === 'script' ||
		request.destination === 'font' ||
		request.destination === 'image';

	if (isAsset) {
		event.respondWith(
			caches.match(request).then((cached) => {
				if (cached) return cached;
				return fetch(request).then((response) => {
					const clone = response.clone();
					caches.open(CACHE).then((cache) => cache.put(request, clone));
					return response;
				});
			})
		);
		return;
	}

	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request)
				.then((response) => {
					if (response.ok) {
						const clone = response.clone();
						caches.open(CACHE).then((cache) => cache.put(request, clone));
					}
					return response;
				})
				.catch(() => caches.match(request))
		);
	}
});
