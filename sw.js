const V = "hoc-cchn-20261108093309", ND = "hoc-cchn-noidung";
const PF = ["BCTC-fc721c108573.r", "BCTC-fdad3f49c764.z", "BL-088a0a77ed70.r", "BL-d7a60abc2d9b.z", "CB-a5ece47c4b7a.z", "CB-f1b6d50fa9db.r", "MG-b87692220646.z", "MG-f487cea0bf8e.r", "PL-c5a57d6d9a62.r", "PL-f128a01ccf2b.z", "PS-8908b8a9b424.z", "PS-9fc6acae3c0e.r", "PT-e419f8cbf408.z", "PT-fc560299d581.r", "QLQ-2bdada68f968.z", "QLQ-9daf532bfd40.r", "common-8950d4e632ce.z", "common-ac039169997a.r", "free-127c6b7adfe6.z", "free-a9183aaa5d6a.r"];
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())) });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== ND).map(k => caches.delete(k))))
  .then(() => caches.open(ND)).then(c => c.keys().then(rs => Promise.all(rs.filter(q => !PF.some(f => new URL(q.url).pathname.endsWith("/" + f))).map(q => c.delete(q))))).then(() => self.clients.claim())) });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url), same = u.origin === location.origin;
  if (same && u.pathname.includes("/p/")) {
    e.respondWith(caches.open(ND).then(c => c.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res }))));
    return;
  }
  if (same && (r.mode === "navigate" || u.pathname.endsWith("/") || u.pathname.endsWith("index.html"))) {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put("index.html", cp)); return res }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok || res.type === "opaque") { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)) } return res })));
});
