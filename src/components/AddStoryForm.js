export default function AddStoryForm(onSubmit) {
    const form = document.createElement('form');
    form.className = 'add-story-form';
  
    form.innerHTML = `
      <label for="name">Nama:</label>
      <input type="text" id="name" name="name" required />
  
      <label for="description">Deskripsi:</label>
      <textarea id="description" name="description" required></textarea>
  
      <label for="photo">Foto:</label>
      <input type="file" id="photo" name="photo" accept="image/*" capture="environment" required />
  
      <label for="map">Pilih Lokasi:</label>
      <div id="map" class="map-selector"></div>
  
      <input type="hidden" id="lat" name="lat" />
      <input type="hidden" id="lon" name="lon" />
  
      <button type="submit">Kirim Cerita</button>
    `;
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const data = {
        name: form.name.value,
        description: form.description.value,
        photo: form.photo.files[0],
        lat: form.lat.value,
        lon: form.lon.value
      };
  
      if (onSubmit && typeof onSubmit === 'function') {
        onSubmit(data);
      }
    });
  
    return form;
  }
  