import { saveStory, getStories, clearStoriesCache, saveStoriesToCache } from '../utils/indexedDB.js';

export default class StoryListPresenter {
  #view;
  #model;
  #token;

  constructor(view, model, token) {
    this.#view = view;
    this.#model = model;
    this.#token = token;
  }

  async init() {
    try {
      const stories = await this.#model.fetchStories(this.#token);
      this.#view.render(stories);
      // Segarkan cache: hapus lama, simpan yang baru
      await clearStoriesCache();
      await saveStoriesToCache(stories);
    } catch (error) {
      console.error('Error memuat cerita dari API:', error);
      const offlineStories = await getStories(); // Ambil dari IndexedDB hanya jika API gagal
      if (offlineStories.length > 0) {
        console.log('Menampilkan cerita dari IndexedDB.');
        this.#view.render(offlineStories);
      } else {
        console.warn('Tidak ada data offline yang tersedia.');
        this.#view.render([]); // Tampilkan kosong jika tidak ada data
      }
    }
  }
}
