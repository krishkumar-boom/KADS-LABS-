/**
 * KADS LABS Service Worker
 *
 * Cache strategy (production-ready, no stale content):
 *  - HTML (navigations): Network-first, fallback to cache. NEVER serve stale HTML.
 *  - Hashed JS/CSS (/_next/static/): Cache-first with hash busting (Next.js outputs content-hashed filenames, safe to cache forever).
 *  - Images/icons/fonts: Stale-while-revalidate (cache first, update in background).
 *  - Cross-origin: passthrough (no caching Supabase/Google APIs).
 *
 * Cache version is injected at build time from /VERSION; old caches are purged on activate.
 */

const CACHE_VERSION = 'kads-v4-' + Date.now() // fallback; overwritten via /VERSION when available
const STATIC_CACHE = 'static-immutable'
const RUNTIME_CACHE = 'runtime-'
const VERSION_URL = './VERSION?t=' + Date.now()

let activeVersion = CACHE_VERSION

// Core assets to pre-cache (all content-hashed/static — safe to cache long-term)
const PRECACHE_URLS = [
  './manifest.json',
  './favicon-32.png',
  './icon-192.png'
]

// Install: don't wait, precache core shell
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(STATIC_CACHE)
      await cache.addAll(PRECACHE_URLS)
    } catch (err) {
      console.warn('[sw] precache failed:', err)
    }
    // Fetch version file to determine current deploy version
    try {
      const v = await fetch(VERSION_URL, { cache: 'no-store' })
      if (v.ok) {
        const t = await v.text()
        if (t && t.trim()) activeVersion = 'kads-' + t.trim()
      }
    } catch {}
    await self.skipWaiting()
  })())
})

// Activate: delete ALL old caches (any cache that isn't the current static/runtime set)
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys()
    const keep = [STATIC_CACHE, activeVersion]
    await Promise.all(
      cacheNames
        .filter(name => !keep.includes(name) && (name.startsWith('kads') || name.startsWith('static') || name.startsWith('runtime')))
        .map(name => {
          console.log('[sw] deleting old cache:', name)
          return caches.delete(name)
        })
    )
    await self.clients.claim()
    // Notify all tabs that new version is active
    const clients = await self.clients.matchAll({ type: 'window' })
    clients.forEach(client => {
      client.postMessage({ type: 'NEW_VERSION_ACTIVATED', version: activeVersion })
    })
  })())
})

// Message listener for manual skip-wait + purge requests
self.addEventListener('message', (event) => {
  if (!event.data) return
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  if (event.data.type === 'PURGE_CACHE') {
    event.waitUntil((async () => {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(n => caches.delete(n)))
      event.source && event.source.postMessage({ type: 'CACHE_PURGED' })
    })())
  }
})

// Fetch handler — the smart cache strategy
self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return

  // Bypass all query-parameter cache busts (those are fresh fetches)
  const noCache = req.cache === 'no-store' || req.cache === 'no-cache' || url.searchParams.has('v') || url.searchParams.has('ts')

  // 1. NAVIGATIONS (HTML) — Network first, NEVER serve stale. Critical for deployments.
  if (req.mode === 'navigate' ||
      (req.headers.get('accept') || '').includes('text/html') && url.pathname.endsWith('/') ||
      url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(req, { cache: 'no-store', credentials: 'same-origin' })
        .then(res => {
          // Only cache successful responses. Don't wait for this.
          if (res.ok) {
            const clone = res.clone()
            caches.open(activeVersion).then(c => c.put(req, clone)).catch(() => {})
          }
          return res
        })
        .catch(async () => {
          // Offline fallback: serve cached shell if available
          const cache = await caches.open(activeVersion)
          const cached = await cache.match('./index.html')
          if (cached) return cached
          // Ultimate fallback: offline page (inline)
          return new Response(
            '<html><body style="font-family:system-ui;padding:2rem;text-align:center"><h2>You are offline</h2><p>KADS LABS will reconnect automatically when you are back online.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          )
        })
    )
    return
  }

  // 2. Hashed Next.js assets — these are immutable (filename contains content hash). Safe to cache forever.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache =>
        cache.match(req).then(cached => {
          if (cached) return cached
          return fetch(req).then(res => {
            if (res.ok) cache.put(req, res.clone()).catch(() => {})
            return res
          })
        })
      )
    )
    return
  }

  // 3. Static assets (images, icons, fonts, JSON, public/*). Stale-while-revalidate.
  if (/\.(png|jpg|jpeg|webp|gif|svg|ico|woff2|woff|ttf|json|webmanifest|mp4)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(activeVersion).then(cache =>
        cache.match(req).then(cached => {
          const fetchPromise = fetch(req, noCache ? { cache: 'no-store' } : undefined)
            .then(res => {
              if (res.ok) cache.put(req, res.clone()).catch(() => {})
              return res
            })
            .catch(() => cached)
          return cached || fetchPromise
        })
      )
    )
    return
  }

  // 4. All other same-origin GETs: network-first with short cache (don't over-cache)
  event.respondWith(
    fetch(req, { cache: 'no-store' })
      .then(res => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(activeVersion).then(c => c.put(req, clone)).catch(() => {})
        }
        return res
      })
      .catch(() => caches.match(req))
  )
})

// Push notifications
self.addEventListener('push', (event) => {
  try {
    const data = event.data ? event.data.json() : {}
    const title = data.title || 'KADS LABS'
    event.waitUntil(self.registration.showNotification(title, {
      body: data.body || 'New update from KADS LABS',
      icon: './icon-192.png',
      badge: './favicon-32.png',
      data: data.url || './'
    }))
  } catch {}
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(self.clients.openWindow(event.notification.data || './'))
})

// Periodic: check for new version every hour while SW is alive
setInterval(async () => {
  try {
    const res = await fetch(VERSION_URL, { cache: 'no-store' })
    if (res.ok) {
      const t = (await res.text()).trim()
      if (t && 'kads-' + t !== activeVersion) {
        // New deploy detected — force refresh next navigation
        self.registration.update()
      }
    }
  } catch {}
}, 60 * 60 * 1000)
