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
  const req = event.request;
  // صفحة index.html: جرّبي الشبكة أولاً دائماً، حتى يظهر كل تحديث فوراً
  // عند توفّر الإنترنت، ولا يبقى هاتفكِ عالقاً على نسخة قديمة إلى الأبد.
  // إن تعذّرت الشبكة (بلا إنترنت)، استعملي النسخة المخزَّنة كخطة بديلة.
  const isPageRequest = req.mode === "navigate" || req.url.endsWith("/") || req.url.endsWith("index.html");
  if (isPageRequest) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }
  // بقية الملفات (الأيقونات، manifest): كاش أولاً، فهي نادراً ما تتغيّر
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
