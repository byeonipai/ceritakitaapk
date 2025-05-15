import { saveStory, getStories, deleteStory } from './sw-indexeddb.js';
import { postStory } from './utils/api.js';

const CACHE_NAME = 'ceritakita-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.bundle.js', // Pastikan sesuai output Webpack
  '/sw.bundle.js',
  '/manifest.json',
  '/assets/open-book.png',
  '/assets/scrapbook.png',
];

// --- INSTALL & CACHE ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.error('Failed to cache resources:', err))
  );
});

// --- FETCH ---
self.addEventListener('fetch', (event) => {
  // Hanya cache request GET
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((networkResponse) => {
            // Cache the new resource
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => {
            // Fallback for HTML requests
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            // Fallback for images
            if (event.request.destination === 'image') {
              return new Response('<svg>...</svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
            }
          })
      );
    })
  );
});

// --- ACTIVATE ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// --- PUSH NOTIFICATION ---
self.addEventListener('push', async (event) => {
  let title = 'Notifikasi Baru';
  let options = {
    body: 'Ada notifikasi baru untuk Anda.',
    icon: '/assets/open-book.png',
    badge: '/assets/scrapbook.png',
  };

  if (event.data) {
    try {
      const data = await event.data.json(); // gunakan await
      title = data.title || title;
      options.body = data.options?.body || options.body;
    } catch (e) {
      // Jika bukan JSON, fallback ke text
      options.body = await event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options).catch((error) => {
      console.error('Failed to show notification:', error);
    })
  );
});

// --- SYNC CERITA OFFLINE ---
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-stories') {
    event.waitUntil(syncOfflineStories());
  }
});

async function syncOfflineStories() {
  console.log('[SW] Memulai sinkronisasi cerita offline...');
  const offlineStories = await getStories();
  if (offlineStories.length === 0) {
    console.log('[SW] Tidak ada cerita offline untuk disinkronkan.');
    return;
  }

  for (const story of offlineStories) {
    try {
      await postStory(story.data, story.token);
      await deleteStory(story.id);
      console.log('[SW] Cerita berhasil disinkronkan:', story.id);
    } catch (error) {
      console.error('[SW] Gagal sinkron cerita:', story.id, error);
      // Mungkin beri notifikasi atau simpan cerita yang gagal untuk dicoba lagi
    }
  }
}