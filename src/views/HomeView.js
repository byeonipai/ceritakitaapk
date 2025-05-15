import { gsap } from 'gsap';
import heroImage from '../assets/homeviewph.jpg'; // Tambahkan impor gambar

export default class HomeView {
  constructor(container, token) {
    this.container = container;
    this.token = token;
  }

  render() {
    this.container.innerHTML = this.getHTML();
    this.addAnimation();
  }

  addAnimation() {
    gsap.from('.animate-in', {
      duration: 1,
      y: 40,
      opacity: 0,
      ease: 'power2.out'
    });
  }

  getHTML() {
    return `
      <header class="main-header shadow-soft">
        <h1><i class="fas fa-book-reader"></i> CeritaKita</h1>
      </header>

      <main id="main-content">
        <div class="welcome-container card animate-in shadow-soft">
          <img src="${heroImage}" alt="Ilustrasi membaca" class="hero-image" />
          <h2>Selamat Datang di CeritaKita</h2>
          <p class="welcome-text"><i class="fas fa-quote-left"></i> Bagikan kisahmu, temukan inspirasi <i class="fas fa-quote-right"></i></p>
          ${this.renderAuthButtons()}
        </div>
      </main>
    `;
  }

  renderAuthButtons() {
    return `
      <div class="auth-buttons">
        <a href="#/login" class="auth-button"><i class="fas fa-sign-in-alt"></i> Login</a>
        <a href="#/register" class="auth-button"><i class="fas fa-user-plus"></i> Daftar</a>
      </div>
    `;
  }
}
