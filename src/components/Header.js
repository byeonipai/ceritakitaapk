import { gsap } from "gsap";
import Swal from "sweetalert2";

export default function Header(logoutCallback, navigateToAddStory) {
  const header = document.createElement('header');
  header.className = 'header';

  header.innerHTML = `
        <nav class="nav">
      <h1 class="logo" aria-label="CeritaKita">
  <i class="fas fa-book-reader logo-icon" aria-hidden="true"></i>
  <span class="logo-text">CeritaKita</span>
</h1>
      <ul class="nav-list">
        <li><a href="#/" class="nav-link">Beranda</a></li>
        <li><a href="#/tambah" class="nav-link">Tambah Cerita</a></li>
        <li><a href="#/offline" class="nav-link">Story Offline</a></li>
        <li><button id="logout-btn" class="logout-btn">Logout</button></li>
      </ul>
    </nav>
  `;


  // Logout logic
  if (logoutCallback) {
    header.querySelector('#logout-btn').addEventListener('click', () => {
      Swal.fire({
        title: 'Yakin mau logout?',
        text: 'Kamu akan keluar dari sesi sekarang.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, logout',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          logoutCallback(); // Fungsi logout dari App.js
        }
      });
    });
  }

  // Tambah Cerita button logic
  const addStoryBtn = header.querySelector('#add-story-btn');
  if (addStoryBtn && typeof navigateToAddStory === 'function') {
    addStoryBtn.addEventListener('click', () => {
      navigateToAddStory(); // Panggil navigateToAddStory untuk mengarahkan ke halaman tambah cerita
    });
  }

  function animateHeader() {
    // Check if elements exist before animating
    const logoIcon = header.querySelector('.logo-icon');
    const navLinks = header.querySelectorAll('.nav-link');
    const logoutBtn = header.querySelector('.logout-btn');
  
    if (logoIcon) {
      gsap.from(logoIcon, { opacity: 0, y: -20, duration: 1, delay: 0.2 });
    }
  
    if (navLinks.length > 0) {
      gsap.from(navLinks, { opacity: 0, x: -20, stagger: 0.15, duration: 1, delay: 0.4 });
    }
  
    if (logoutBtn) {
      gsap.from(logoutBtn, { opacity: 0, y: 20, duration: 1, delay: 0.6 });
    }
  }
  
  // Scroll event for sticky header
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Run animation after the header is appended to the DOM
  setTimeout(animateHeader, 100); // Ensure animation runs after the header is fully in the DOM

  return header;
}
