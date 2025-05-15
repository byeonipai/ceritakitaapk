import StoryItem from './StoryItem.js';
import { saveStory } from '../utils/indexedDB.js';

export default function StoryList(stories = []) {
  const section = document.createElement('section');
  section.className = 'story-list';
  section.id = 'main-content'; // Untuk aksesibilitas

  if (stories.length === 0) {
    section.innerHTML = `<p class="no-story">Belum ada cerita untuk ditampilkan.</p>`;
    return section;
  }

  const list = document.createElement('div');
  list.className = 'stories';

  // Handler untuk simpan offline
  async function handleSaveOffline(story, btn) {
    try {
      await saveStory(story);
      btn.textContent = 'Tersimpan Offline';
      btn.disabled = true;
      btn.classList.add('saved');
    } catch (e) {
      btn.textContent = 'Gagal Simpan';
    }
  }

  stories.forEach((story) => {
    const item = StoryItem(story, { onSaveOffline: handleSaveOffline });
    list.appendChild(item);
  });

  section.appendChild(list);
  return section;
}
