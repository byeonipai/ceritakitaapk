// sw-indexeddb.js

const DB_NAME = 'ceritakita-db';
const STORE_NAME = 'stories';

// Open IndexedDB
async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject('Gagal membuka IndexedDB: ' + event.target.error);
    };
  });
}

// Save story to IndexedDB
async function saveStory(story) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(story);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject('Gagal menyimpan cerita: ' + event.target.error);
    };
  });
}

// Get all stories from IndexedDB
async function getStories() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      reject('Gagal mengambil cerita: ' + event.target.error);
    };
  });
}

// Delete story by ID from IndexedDB
async function deleteStory(id) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject('Gagal menghapus cerita: ' + event.target.error);
    };
  });
}

// Export functions for use inside Service Worker
self.saveStory = saveStory;
self.getStories = getStories;
self.deleteStory = deleteStory;
