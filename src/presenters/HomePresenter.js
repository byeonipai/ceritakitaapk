export default class HomeViewPresenter {
  #view;
  #token;

  constructor(view, token) {
    this.#view = view;
    this.#token = token;
  }

  init() {
    this.#view.render();  // Pastikan render dipanggil
    this.#setupAuthButtons();
  }

  #setupAuthButtons() {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;

    if (this.#token) {
      this.#setLogoutButton(authButtons);
    } else {
      this.#setLoginAndRegisterButtons(authButtons);
    }
  }

  #setLoginAndRegisterButtons(authButtons) {
    authButtons.innerHTML = `
      <a href="#/login" class="auth-button"><i class="fas fa-sign-in-alt"></i> Login</a>
      <a href="#/register" class="auth-button"><i class="fas fa-user-plus"></i> Daftar</a>
    `;
  }

  #setLogoutButton(authButtons) {
    authButtons.innerHTML = `
      <button id="logout-button" class="auth-button"><i class="fas fa-sign-out-alt"></i> Logout</button>
    `;
    document.getElementById('logout-button').addEventListener('click', () => this.#logout());
  }

  #logout() {
    localStorage.removeItem('token');
    window.location.hash = '/login'; // Ganti reload dengan redirect ke login
  }
}
