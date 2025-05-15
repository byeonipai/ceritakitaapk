import { openDB } from 'idb';

const DB_NAME = 'ceritakita-db';
const STORE_NAME = 'stories';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function saveStory(story) {
  const db = await initDB();
  return db.put(STORE_NAME, story);
}

export async function getStories() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function deleteStory(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}

export async function clearStoriesCache() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  await tx.done;
}

export async function saveStoriesToCache(stories) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const story of stories) {
    await tx.store.put(story);
  }
  await tx.done;
}

export async function getStoriesFromCache() {
  // Ambil stories dari IndexedDB
  // Implementasi tergantung struktur IndexedDB Anda
}
