// const CACHE_NAME = "pos-cache-v1";
// const ASSETS_CACHE = "assets-cache-v1";

// // Assets that should be cached immediately during installation
// const PRECACHE_ASSETS = [
//   "/",
//   "/pos",
//   "/pos/menu",
//   "/pos/orders",
//   "/offline.html",
//   "/manifest.json",
//   "/icons/icon-192x192.png",
//   "/icons/icon-512x512.png",
// ];

// self.addEventListener("install", (event) => {
//   console.log("[Service Worker] Installing...");
//   event.waitUntil(
//     Promise.all([
//       caches.open(CACHE_NAME).then((cache) => {
//         console.log("[Service Worker] Caching app shell");
//         // Use Promise.allSettled to prevent complete failure if one resource fails
//         return Promise.allSettled(
//           PRECACHE_ASSETS.map((url) => {
//             console.log(`[Service Worker] Attempting to cache: ${url}`);
//             return fetch(url, { credentials: "same-origin" })
//               .then((response) => {
//                 if (!response.ok) {
//                   throw new Error(`Failed to fetch ${url}: ${response.status}`);
//                 }
//                 return cache.put(url, response);
//               })
//               .catch((err) => {
//                 console.error(`[Service Worker] Failed to cache ${url}:`, err);
//               });
//           })
//         );
//       }),
//       caches.open(ASSETS_CACHE),
//     ]).then(() => {
//       console.log("[Service Worker] Install completed");
//       return self.skipWaiting();
//     })
//   );
// });

// self.addEventListener("fetch", (event) => {
//   // Skip non-GET requests
//   if (event.request.method !== "GET") {
//     return;
//   }

//   try {
//     const url = new URL(event.request.url);

//     // Skip requests with unsupported schemes
//     if (url.protocol !== "http:" && url.protocol !== "https:") {
//       return;
//     }

//     // Handle API requests differently
//     if (url.pathname.startsWith("/api/")) {
//       event.respondWith(
//         fetch(event.request).catch(() => {
//           // If it's a GET request, try to return cached data
//           if (event.request.method === "GET") {
//             return caches.match(event.request);
//           }
//           // For other methods, return offline response
//           return new Response(
//             JSON.stringify({
//               error: "Currently offline, request will be synced when online",
//               offline: true,
//             }),
//             {
//               headers: { "Content-Type": "application/json" },
//               status: 503,
//             }
//           );
//         })
//       );
//       return;
//     }

//     // For navigation requests (HTML pages)
//     if (event.request.mode === "navigate") {
//       event.respondWith(
//         fetch(event.request).catch(() => {
//           return caches
//             .match(event.request)
//             .then((response) => response || caches.match("/offline.html"));
//         })
//       );
//       return;
//     }

//     // For all other requests (assets, etc.)
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         if (response) {
//           return response; // Return cached response
//         }

//         return fetch(event.request)
//           .then((response) => {
//             // Don't cache if not a valid response
//             if (
//               !response ||
//               response.status !== 200 ||
//               response.type !== "basic"
//             ) {
//               return response;
//             }

//             // Clone the response
//             const responseToCache = response.clone();

//             // Store in cache
//             caches.open(ASSETS_CACHE).then((cache) => {
//               cache.put(event.request, responseToCache);
//             });

//             return response;
//           })
//           .catch(() => {
//             // If fetch fails, return a default response
//             if (event.request.destination === "image") {
//               return caches.match("/images/fallback.png");
//             }
//             return new Response("Offline content not available");
//           });
//       })
//     );
//   } catch (error) {
//     console.error("[Service Worker] Error processing fetch request:", error);
//     return;
//   }
// });

// // Clean up old caches
// self.addEventListener("activate", (event) => {
//   console.log("[Service Worker] Activating...");

//   const cacheWhitelist = [CACHE_NAME, ASSETS_CACHE];

//   event.waitUntil(
//     caches
//       .keys()
//       .then((cacheNames) => {
//         return Promise.all(
//           cacheNames.map((cacheName) => {
//             if (!cacheWhitelist.includes(cacheName)) {
//               return caches.delete(cacheName);
//             }
//           })
//         );
//       })
//       .then(() => {
//         return self.clients.claim();
//       })
//   );
// });

// // Handle sync events
// self.addEventListener("sync", (event) => {
//   if (event.tag === "sync-orders") {
//     event.waitUntil(syncOrders());
//   }
// });

// async function syncOrders() {
//   try {
//     const db = await import("./lib/offlineDB");
//     const pendingOrders = await db.getUnsyncedOrders();

//     for (const order of pendingOrders) {
//       try {
//         const response = await fetch("/api/orders", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(order),
//         });

//         if (response.ok) {
//           await db.markAsSynced(order.id);
//         }
//       } catch (error) {
//         console.error("Failed to sync order:", error);
//       }
//     }
//   } catch (error) {
//     console.error("[Service Worker] Error in syncOrders:", error);
//   }
// }

// Service Worker with all caching disabled
self.addEventListener("install", (event) => {
  console.log("Service Worker installing");
  // Skip waiting to activate immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating");

  // Delete all existing caches
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Bypass cache completely and go straight to network
  event.respondWith(fetch(event.request));
});
