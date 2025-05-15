export default class StoryOfflineView {
    constructor(container) {
        this.container = container;
    }

    render(stories) {
        this.container.innerHTML = this.generateOfflineStoriesHTML(stories);
        // Tambahkan event listener untuk tombol hapus offline
        this.container.querySelectorAll('.delete-offline-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                if (this.onDeleteOffline) {
                    this.onDeleteOffline(id);
                }
            });
        });
    }

    generateOfflineStoriesHTML(stories) {
        if (!stories || stories.length === 0) {
            return `
                <h2>Offline Stories</h2>
                <p>No offline stories available.</p>
            `;
        }

        return `
            <h2>Offline Stories</h2>
            <ul>
                ${stories.map(story => {
                    // Handle photoUrl: jika string tampilkan langsung, jika Blob/File buat URL
                    let photoHTML = '';
                    if (story.photoUrl) {
                        if (typeof story.photoUrl === 'string') {
                            photoHTML = `<img src="${story.photoUrl}" alt="Foto cerita offline" style="max-width:200px;max-height:200px;" />`;
                        } else if (story.photoUrl instanceof Blob) {
                            const url = URL.createObjectURL(story.photoUrl);
                            photoHTML = `<img src="${url}" alt="Foto cerita offline" style="max-width:200px;max-height:200px;" />`;
                        }
                    }
                    return `
                        <li>
                            <h3>${story.name || 'Tanpa Nama'}</h3>
                            <p>${story.description || 'Tidak ada deskripsi.'}</p>
                            ${photoHTML}
                            <p><small>${story.createdAt ? new Date(story.createdAt).toLocaleString('id-ID') : ''}</small></p>
                            ${(story.lat && story.lon) ? `<p>Lokasi: (${story.lat}, ${story.lon})</p>` : ''}
                            <button class="delete-offline-btn" data-id="${story.id}"><i class="fas fa-trash"></i> Hapus dari Offline</button>
                        </li>
                    `;
                }).join('')}
            </ul>
        `;
    }

    // Tambahkan binding handler hapus offline
    bindDeleteOffline(handler) {
        this.onDeleteOffline = handler;
    }
}
