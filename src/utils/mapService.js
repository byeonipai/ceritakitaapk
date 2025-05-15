let map;
let marker;

export function initMap(containerId, location) {
  return new Promise((resolve, reject) => {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;

    if (!container) {
      console.error('Elemen container peta tidak ditemukan.');
      return reject('No container');
    }

    if (!location || !location.coords || typeof location.coords.latitude !== 'number' || typeof location.coords.longitude !== 'number') {
      console.warn('Lokasi tidak tersedia atau tidak valid.');
      container.innerHTML = '<p class="map-error">Lokasi tidak tersedia. Aktifkan izin lokasi atau coba lagi.</p>';
      return reject('Invalid location');
    }

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;

    map = L.map(container).setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    marker = L.marker([lat, lng], { draggable: true }).addTo(map)
      .bindPopup('Lokasi kamu')
      .openPopup();

    marker.on('dragend', function (e) {
      const { lat, lng } = e.target.getLatLng();
      console.log(`Marker dipindahkan ke: (${lat}, ${lng})`);
    });

    resolve(map); // map siap!
  });
}

export function addMarker({ lat, lon, popupText = '' }) {
  if (typeof lat !== 'number' || typeof lon !== 'number' || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    console.warn('Lokasi marker tidak valid. Menggunakan koordinat default (0,0).');
    lat = 0;
    lon = 0;
  }

  if (!map) {
    console.error('Map belum diinisialisasi. Panggil initMap() terlebih dahulu.');
    return;
  }

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([lat, lon]).addTo(map);
  if (popupText) {
    marker.bindPopup(popupText).openPopup();
  }
}

export function onMapClick(callback) {
  if (!map) {
    console.error('Map belum diinisialisasi. Tidak bisa mendaftarkan event click.');
    return;
  }

  map.on('click', function (e) {
    const { lat, lng } = e.latlng;

    // Update marker position
    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker([lat, lng]).addTo(map);

    callback({ lat, lon: lng });
  });
}

export function removeMapClick() {
  if (!map) return;
  map.off('click');
}

export function getMapInstance() {
  return map;
}