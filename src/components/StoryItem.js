export default function StoryItem(story, { onSaveOffline } = {}) {
  const { id, photoUrl, name, description, createdAt, lat, lon } = story;

  const article = document.createElement('article');
  article.className = 'story-item';

  article.innerHTML = `
    <img src="${photoUrl}" alt="Foto cerita oleh ${name}" class="story-photo" />
    <div class="story-content">
      <h2 class="story-author">${name}</h2>
      <p class="story-desc">${description}</p>
      <p class="story-date">Diposting pada: ${new Date(createdAt).toLocaleDateString('id-ID')}</p>
      <button class="save-offline-btn" data-id="${id}"><i class="fas fa-download"></i> Simpan Offline</button>
    </div>
    <div class="story-map-placeholder" data-lat="${lat}" data-lon="${lon}">
      <!-- Map akan dirender di sini -->
    </div>
  `;

  // Tambahkan event listener untuk tombol simpan offline
  const saveBtn = article.querySelector('.save-offline-btn');
  if (saveBtn && typeof onSaveOffline === 'function') {
    saveBtn.addEventListener('click', () => onSaveOffline(story, saveBtn));
  }

  return article;
}
