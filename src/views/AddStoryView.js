import { gsap } from 'gsap';
import Header from '../components/Header.js';

export default class AddStoryView {
  constructor(container, logoutCallback) {
    this.container = container;
    this.logoutCallback = logoutCallback;
    this.headerRendered = false; // Flag untuk memastikan header hanya dirender sekali
  }

  // Render method untuk tampilan utama halaman tambah cerita
  render() {
    this.clearContainer();
    this.renderMainContent();
  }

  // Clear container untuk memastikan tampilan yang bersih
  clearContainer() {
    this.container.innerHTML = '';
  }

  // Render konten utama untuk halaman tambah cerita
  renderMainContent() {
    const main = document.createElement('main');
    main.id = 'main-content';
    main.innerHTML = this.generateAddStoryFormHTML();

    this.container.appendChild(main);

    // Tambahkan animasi untuk form tambah cerita
    gsap.from('.add-story-card', {
      duration: 0.8,
      y: 40,
      opacity: 0,
      ease: 'power3.out',
    });
  }

  // Generate HTML untuk form tambah cerita
  generateAddStoryFormHTML() {
    return `
      <div class="add-story-card shadow-soft animate-in">
        <h2><i class="fas fa-pen-nib"></i> Tambah Cerita Baru</h2>
        <form id="add-story-form" class="add-story-form">
          <label for="description"><i class="fas fa-align-left"></i> Deskripsi:</label>
          <textarea id="description" name="description" rows="4" required></textarea>

          <label for="photo"><i class="fas fa-image"></i> Unggah atau Ambil Foto:</label>
          <input type="file" id="photo" name="photo" accept="image/*" style="margin-bottom: 10px" />
          <small class="note">* Klik tombol di bawah ini untuk ambil langsung dari kamera</small>

          <button type="button" id="take-photo-btn" class="auth-button" style="margin-top: 10px;">
            <i class="fas fa-camera"></i> Ambil Foto dari Kamera
          </button>
          <video id="camera-preview" autoplay playsinline style="display: none; width: 100%; border-radius: 10px; margin-top: 10px;"></video>
          <button type="button" id="capture-btn" class="auth-button" style="display: none; margin-top: 10px;">
            <i class="fas fa-camera-retro"></i> Capture Foto
          </button>
          <img id="photo-preview" style="margin-top: 10px; max-width: 100%; display: none; border-radius: 10px;" />

          <div id="map" style="height: 300px; margin: 20px 0; border-radius: 12px; overflow: hidden;"></div>

          <button type="submit" class="auth-button">
            <i class="fas fa-upload"></i> Kirim Cerita
          </button>
        </form>
      </div>
    `;
  }

  // ============================
  // Bagian untuk binding event
  // ============================
  bindSubmit(handler) {
    document.getElementById('add-story-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const description = document.getElementById('description').value;
      const photo = document.getElementById('photo').files[0];

      if (!photo) {
        this.showAlert('error', 'Gagal', 'Foto harus diunggah.');
        return;
      }

      handler(description, photo);
    });
  }

  bindTakePhoto(handler) {
    document.getElementById('take-photo-btn').addEventListener('click', handler);
  }

  bindCapturePhoto(handler) {
    document.getElementById('capture-btn').addEventListener('click', handler);
  }

  bindPhotoChange(handler) {
    document.getElementById('photo').addEventListener('change', (e) => {
      handler(e.target.files[0]);
    });
  }

  // ============================
  // Bagian untuk Update UI
  // ============================
  showAlert(icon, title, text) {
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({
        icon,
        title,
        text,
      });
    });
  }

  redirectHome() {
    window.location.hash = '/';
  }

  // ============================
  // Map Related Methods
  // ============================
  getMapContainer() {
    return document.getElementById('map');
  }

  showMapError(message) {
    const mapContainer = this.getMapContainer();
    mapContainer.innerHTML = `<p class="map-error">${message}</p>`;  // Tambahkan backtick di sini
  }

  showSelectedLocation(lat, lon) {
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: `Lokasi disetel: (${lat.toFixed(4)}, ${lon.toFixed(4)})`, // Tambahkan backtick di sini
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });
    });
  }

  // ============================
  // Camera Related Methods
  // ============================
  showCameraPreview(stream) {
    const video = this.getVideoElement();
    video.srcObject = stream;
    video.style.display = 'block';
    document.getElementById('capture-btn').style.display = 'inline-block';
  }

  getVideoElement() {
    return document.getElementById('camera-preview');
  }

  setCapturedPhoto(file) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    document.getElementById('photo').files = dataTransfer.files;

    const imgURL = URL.createObjectURL(file);
    const previewImg = document.getElementById('photo-preview');
    previewImg.src = imgURL;
    previewImg.style.display = 'block';

    const video = this.getVideoElement();
    video.style.display = 'none';
    document.getElementById('capture-btn').style.display = 'none';
  }

  previewSelectedPhoto(file) {
    const imgURL = URL.createObjectURL(file);
    const previewImg = document.getElementById('photo-preview');
    previewImg.src = imgURL;
    previewImg.style.display = 'block';
  }

  hidePhotoPreview() {
    const previewImg = document.getElementById('photo-preview');
    previewImg.style.display = 'none';
  }
}
