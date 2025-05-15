export default class MapModel {
  constructor() {
    this.lat = null;
    this.lon = null;
  }

  // Fungsi untuk mengupdate lokasi
  updateLocation(lat, lon) {
    this.lat = lat;
    this.lon = lon;
  }

  // Mengembalikan lokasi terkini
  getLocation() {
    return { lat: this.lat, lon: this.lon };
  }

  // Fungsi untuk memformat lokasi untuk digunakan dalam request API
  formatLocationForAPI() {
    return {
      lat: this.lat,
      lon: this.lon,
    };
  }

  // Reset lokasi jika diperlukan
  resetLocation() {
    this.lat = null;
    this.lon = null;
  }
}
