export function renderMarkerMap(container, lat, lon, popupText = 'Lokasi cerita ini') {
  // Hapus map lama jika sudah ada
  if (container._leaflet_id) {
    const oldMap = container._leaflet_map_instance;
    if (oldMap) {
      oldMap.remove(); // ini yang penting!
    }
    container._leaflet_map_instance = null;
  }

  // Buat map baru
  const map = L.map(container).setView([lat, lon], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  L.marker([lat, lon])
    .addTo(map)
    .bindPopup(popupText)
    .openPopup();

  // Simpan instance ke elemen agar bisa dihancurkan di render berikutnya
  container._leaflet_map_instance = map;

  return map;
}
