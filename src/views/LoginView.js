import { gsap } from 'gsap';

export default class LoginView {
  constructor(container) {
    this.container = container;
    this.loginHandler = null;
  }

  bindLogin(handler) {
    this.loginHandler = handler;
  }

  async render() {
    this.container.innerHTML = this.getHTML();
    gsap.from('.animate-in', { duration: 0.8, y: 30, opacity: 0, ease: 'power2.out' });

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.loginHandler) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        this.loginHandler(email, password);
      }
    });
  }

  getHTML() {
    return `
      <header class="main-header shadow-soft">
        <h1><i class="fas fa-book-reader"></i> CeritaKita</h1>
      </header>
      <main id="main-content">
        <div class="login-card animate-in shadow-soft">
          <h2><i class="fas fa-sign-in-alt"></i> Login ke CeritaKita</h2>
          <form id="login-form" class="login-form">
            <div class="form-group">
              <label for="email"><i class="fas fa-envelope"></i> Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div class="form-group">
              <label for="password"><i class="fas fa-lock"></i> Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" class="auth-button">Login</button>
          </form>
          <p class="login-note">Belum punya akun? <a href="#/register">Daftar sekarang</a></p>
        </div>
      </main>
    `;
  }

  showSuccess(message) {
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({ icon: 'success', title: message, timer: 1500, showConfirmButton: false });
    });
  }

  showError(message) {
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({ icon: 'error', title: 'Error', text: message });
    });
  }
}
