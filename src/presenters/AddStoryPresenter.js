import StoryModel from '../models/StoryModel.js';
import { initMap, onMapClick } from '../utils/mapService.js';
import { subscribePushNotification } from '../utils/api.js';
import { requestNotificationPermission, subscribeToPushNotifications, saveSubscriptionToServer } from '../utils/notificationHelper.js';

export default class AddStoryPresenter {
  #view;
  #model;
  #token;
  #lat = null;
  #lon = null;
  #stream = null;

  constructor(view, model, token) {
    this.#view = view;
    this.#model = model;
    this.#token = token;
  }

  async init() {
    this.#view.render();     // <-- render dulu
    this.#bindEvents();      // <-- baru bind
    await this.#setupMap();  // <-- lalu setup map
  }  

  #bindEvents() {
    const form = document.getElementById('add-story-form');
    if (!form) {
      console.error('Form Add Story tidak ditemukan!');
      return;
    }

    this.#view.bindSubmit(this.#handleSubmit.bind(this));
    this.#view.bindTakePhoto(this.#handleTakePhoto.bind(this));
    this.#view.bindCapturePhoto(this.#handleCapturePhoto.bind(this));
    this.#view.bindPhotoChange(this.#handlePhotoChange.bind(this));
  }

  async #setupMap() {
    const mapContainer = this.#view.getMapContainer();
    const defaultLocation = { lat: -6.200000, lon: 106.816666 }; // Default to Jakarta

    const initializeMap = (lat, lon) => {
      initMap(mapContainer, { coords: { latitude: lat, longitude: lon } });
      onMapClick(({ lat, lon }) => {
        this.#lat = lat;
        this.#lon = lon;
        this.#view.showSelectedLocation(lat, lon);
      });
    };

    if (!navigator.geolocation) {
      this.#view.showMapError('Geolocation tidak didukung. Menggunakan lokasi default.');
      initializeMap(defaultLocation.lat, defaultLocation.lon);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.#lat = position.coords.latitude;
        this.#lon = position.coords.longitude;
        initializeMap(this.#lat, this.#lon);
      },
      () => {
        this.#view.showMapError('Gagal mengakses lokasi. Menggunakan lokasi default.');
        initializeMap(defaultLocation.lat, defaultLocation.lon);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  async #handleSubmit(description, photoFile) {
    if (!photoFile || photoFile.size > 1024 * 1024) {
      this.#view.showAlert('error', 'Gagal', 'Foto harus diupload dan < 1MB.');
      return;
    }
    if (this.#lat === null || this.#lon === null) {
      this.#view.showAlert('warning', 'Pilih lokasi dulu.');
      return;
    }

    try {
      await this.#model.addStory({ description, photo: photoFile, lat: this.#lat, lon: this.#lon }, this.#token); // Pass the correct token
      this.#view.showAlert('success', 'Berhasil!', 'Cerita berhasil ditambahkan.');

      // Trigger push notification subscribe (jika belum)
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        if (await requestNotificationPermission()) {
          const registration = await navigator.serviceWorker.ready;
          let subscription = await registration.pushManager.getSubscription();
          if (!subscription) {
            subscription = await subscribeToPushNotifications();
          }
          if (subscription) {
            await saveSubscriptionToServer(subscription.toJSON(), this.#token);
            console.log('Push notification subscription saved after story upload.');
          }
        }
      }

      this.#view.redirectHome();
    } catch (error) {
      this.#view.showAlert('error', 'Gagal mengirim cerita.', error.message);
    }
  }

  async #handleTakePhoto() {
    try {
      this.#stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.#view.showCameraPreview(this.#stream);
    } catch {
      this.#view.showAlert('error', 'Tidak bisa akses kamera.');
    }
  }

  #handleCapturePhoto() {
    if (!this.#stream) return;
    const video = this.#view.getVideoElement();
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
      this.#view.setCapturedPhoto(file);
      this.#stopCamera();
    }, 'image/jpeg');
  }

  #handlePhotoChange(file) {
    if (file) {
      this.#view.previewSelectedPhoto(file);
    } else {
      this.#view.hidePhotoPreview();
    }
  }

  #stopCamera() {
    this.#stream?.getTracks().forEach((track) => track.stop());
    this.#stream = null;
  }

  destroy() {
    this.#stopCamera(); // Pastikan kamera dimatikan saat presenter dihancurkan
  }
}