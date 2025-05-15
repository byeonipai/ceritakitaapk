import HomeView from './views/HomeView.js';
import StoryListView from './views/StoryListView.js';
import AddStoryView from './views/AddStoryView.js';
import NotFoundView from './views/NotFoundView.js';
import LoginView from './views/LoginView.js';
import RegisterView from './views/RegisterView.js';
import Header from './components/Header.js';

import HomeViewPresenter from './presenters/HomePresenter.js';
import StoryListPresenter from './presenters/StoryListPresenter.js';
import AddStoryPresenter from './presenters/AddStoryPresenter.js';
import LoginPresenter from './presenters/LoginPresenter.js';
import RegisterPresenter from './presenters/RegisterPresenter.js';
import StoryOfflinePresenter from './presenters/StoryOfflinePresenter.js';

import StoryModel from './models/StoryModel.js';
import './style.css';

import { requestNotificationPermission, subscribeToPushNotifications, saveSubscriptionToServer } from './utils/notificationHelper.js';

class App {
  constructor() {
    this.container = document.getElementById('app');
    this.token = localStorage.getItem('token');
    this.routes = {
      '/': this.handleHomeRoute.bind(this),
      '/tambah': this.handleAddStoryRoute.bind(this),
      '/login': this.handleLoginRoute.bind(this),
      '/register': this.handleRegisterRoute.bind(this),
      '/offline': this.handleOfflineRoute.bind(this),
      '/404': this.handleNotFoundRoute.bind(this),
    };

    this.init();
    this.setupSkipToContent();
    this.registerServiceWorker();
    this.setupOfflineFallback();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRouting());
    this.handleRouting();
  }

  async handleRouting() {
    const path = window.location.hash.replace('#', '') || '/';
    const routeHandler = this.routes[path] || this.routes['/404'];

    console.log('Navigating to path:', path); // Debugging log

    if (this.currentPresenter?.destroy) {
      console.log('Destroying current presenter:', this.currentPresenter.constructor.name); // Debugging log
      this.currentPresenter.destroy(); // Hentikan presenter sebelumnya jika ada
    }

    const renderPage = async () => {
      this.clearContainer();
      this.renderHeaderIfAuthenticated(path);
      const presenter = await routeHandler();
      this.currentPresenter = presenter;
      if (presenter?.init) {
        console.log('Initializing presenter:', presenter.constructor.name); // Debugging log
        presenter.init();
      }
    };

    if (!document.startViewTransition) {
      await renderPage();
      return;
    }

    try {
      const transition = document.startViewTransition(() => renderPage());
      transition.finished.then(() => {
        document.body.animate(
          [
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          { duration: 400, easing: 'ease-in-out' }
        );
      });
    } catch (error) {
      console.error('Error during view transition:', error); // Debugging log
      await renderPage(); // Fallback jika terjadi error
    }
  }

  clearContainer() {
    this.container.innerHTML = '';
  }

  renderHeaderIfAuthenticated(path) {
    if (this.isAuthenticated() && path !== '/login' && path !== '/register') {
      const headerContainer = document.getElementById('header-container') || document.createElement('div');
      headerContainer.id = 'header-container';
      document.body.insertBefore(headerContainer, document.body.firstChild);

      const headerElement = Header(this.getLogoutCallback());
      headerContainer.innerHTML = ''; // Clear old header
      headerContainer.appendChild(headerElement);
    }
  }

  isAuthenticated() {
    return !!this.token;
  }

  handleHomeRoute() {
    const view = this.isAuthenticated() 
      ? new StoryListView(this.container, this.token, this.getLogoutCallback()) 
      : new HomeView(this.container);

    return this.isAuthenticated()
      ? new StoryListPresenter(view, StoryModel, this.token)
      : new HomeViewPresenter(view);    
  }

  handleAddStoryRoute() {
    if (!this.isAuthenticated()) return this.handleNotFoundRoute();
    const view = new AddStoryView(this.container, this.getLogoutCallback());
    return new AddStoryPresenter(view, StoryModel, this.token); 
  }

  handleLoginRoute() {
    const view = new LoginView(this.container);
    return new LoginPresenter(view, this.setToken.bind(this));
  }

  handleRegisterRoute() {
    const view = new RegisterView(this.container);
    const presenter = new RegisterPresenter(view);
    view.render(); // Pastikan untuk merender view
    return presenter;
  }

  handleOfflineRoute() {
    const presenter = new StoryOfflinePresenter(this.container);
    return presenter;
  }

  async handleNotFoundRoute() {
    const view = new NotFoundView(this.container);
    await view.render();
    return null;
  }

  async setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
    window.location.hash = '/';

    if (await requestNotificationPermission()) {
      try {
        const subscription = await subscribeToPushNotifications();
        console.log('Push subscription:', subscription);
        // Perbaikan: gunakan .toJSON() agar keys tidak undefined
        await saveSubscriptionToServer(subscription.toJSON(), token);
        console.log('Push notification subscription saved.');
      } catch (error) {
        console.error('Failed to subscribe to push notifications:', error.message);
      }
    }
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
    window.location.hash = '/';
  }

  getLogoutCallback() {
    return () => {
      this.clearToken();
      window.location.hash = '/login';
    };
  }

  setupSkipToContent() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (event) => {
        event.preventDefault();
        skipLink.blur(); 
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.setAttribute('tabindex', '-1');
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.bundle.js'); // Corrected path
        console.log('Service Worker registered:', registration);

        // Minta izin notifikasi
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            console.log('Notification permission granted.');
          } else {
            console.warn('Notification permission denied.');
          }
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        alert('Gagal mendaftarkan Service Worker. Beberapa fitur mungkin tidak tersedia.');
      }
    } else {
      console.warn('Service Worker tidak didukung di browser ini.');
    }
  }

  setupOfflineFallback() {
    window.addEventListener('offline', () => {
      alert('Anda sedang offline. Beberapa fitur mungkin tidak tersedia.');
    });
  }
}

const app = new App();
