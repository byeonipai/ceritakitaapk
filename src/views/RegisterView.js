import { gsap } from 'gsap';
import Swal from 'sweetalert2';

export default class RegisterView {
  constructor(container) {
    this.container = container;
    this.registerHandler = null;
  }

  bindRegister(handler) {
    this.registerHandler = handler;
  }

  async render() {
    this.container.innerHTML = this.getHTML();
    this.animateForm();
    this.setupFormSubmit();
  }

  animateForm() {
    gsap.from('.animate-in', { duration: 0.8, y: 30, opacity: 0, ease: 'power2.out' });
  }

  setupFormSubmit() {
    const form = document.getElementById('register-form');
    if (form) { // Pastikan form ada sebelum menambahkan event listener
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (this.registerHandler) {
          this.registerHandler({ name, email, password });
        }
      });
    }
  }

  getHTML() {
    return `
      <header class="main-header shadow-soft">
        <h1><i class="fas fa-book-reader"></i> CeritaKita</h1>
      </header>
      <main id="main-content">
        <div class="register-card animate-in shadow-soft">
          <h2><i class="fas fa-user-plus"></i> Daftar Akun</h2>
          <form id="register-form" class="register-form">
            <div class="form-group">
              <label for="name"><i class="fas fa-user"></i> Nama</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div class="form-group">
              <label for="email"><i class="fas fa-envelope"></i> Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div class="form-group">
              <label for="password"><i class="fas fa-lock"></i> Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" class="auth-button">Daftar</button>
          </form>
          <p class="login-note">Sudah punya akun? <a href="#/login">Login</a></p>
        </div>
      </main>
    `;
  }

  showError(message) {
    Swal.fire({ icon: 'error', title: 'Oops...', text: message });
  }

  showSuccess(message) {
    Swal.fire({ icon: 'success', title: message, timer: 1500, showConfirmButton: false });
  }
}