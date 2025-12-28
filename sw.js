const CACHE_NAME = "cotizador-v1.0.0";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// ==========================
// INSTALACIÓN
// ==========================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ==========================
// ACTIVACIÓN (limpieza)
// ==========================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// ==========================
// FETCH
// ==========================
self.addEventListener("fetch", event => {
  const request = event.request;

  // NO cachear HTML para evitar bugs con cambios frecuentes
  if (request.headers.get("accept")?.includes("text/html")) {
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(response => {
          // Guardar en cache dinámico
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // opcional: fallback si falla la red
          // return caches.match('/offline.html');
        });
    })
  );
});
