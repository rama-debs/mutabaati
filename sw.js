/*
  اسم الكاش مبني على رقم النسخة الممرَّر من index.html عبر رابط التسجيل
  (sw.js?v=1.0.0). ارفعي VERSION في index.html عند كل تحديث فقط —
  لا حاجة لتعديل هذا الملف يدوياً.
*/
const VERSION = new URL(location.href).searchParams.get("v") || "0";
const CACHE_NAME = "mutabaati-" + VERSION;

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.svg",
  "./icon-512.svg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
