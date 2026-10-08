const VERSION='1.0.1';
const CACHE='mutabaati-new-'+VERSION;
const ASSETS=["./", "./index.html", "./duas.js", "./tales.js", "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png", "./laundry.html", "./consequences.html", "./house.html", "./adhkar.html", "./protection.html"];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mutabaati-new-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy))}return response}).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):Response.error())))});
