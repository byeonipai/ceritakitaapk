import { register } from '../utils/api.js';

export default class RegisterPresenter {
  #view;

  constructor(view) {
    this.#view = view;
    this.#view.bindRegister(this.#handleRegister.bind(this));
  }

  async #handleRegister({ name, email, password }) {
    try {
      await register({ name, email, password });
      this.#view.showSuccess('Berhasil Daftar! Silakan login.');
      window.location.hash = '/login';  // Pindahkan ke halaman login setelah berhasil
    } catch (error) {
      this.#view.showError(error.message || 'Gagal Mendaftar. Coba lagi.');
    }
  }
}