import { login } from "../utils/api.js";  // ⬅️ Import langsung fungsi login()
import { requestNotificationPermission, subscribeToPushNotifications, saveSubscriptionToServer } from '../utils/notificationHelper.js';

export default class LoginPresenter {
  #view;
  #setToken;

  constructor(view, setToken) {
    this.#view = view;
    this.#setToken = setToken;
  }

  init() {
    this.#view.render();
    this.#view.bindLogin(this.#login.bind(this));  // Menyambungkan handler login dengan view
  }

  async #login(email, password) {
    try {
      // Pastikan email dan password benar-benar diterima
      console.log("Attempting to login with:", email, password);
  
      if (!email || !password) {
        throw new Error('Email or password is missing');
      }
  
      const result = await login({ email, password });
      console.log("Login result:", result);
  
      if (result && result.token) {
        this.#setToken(result.token);
        this.#view.showSuccess('Login Berhasil!');
        // Trigger push notification permission & subscribe
        if (await requestNotificationPermission()) {
          try {
            const subscription = await subscribeToPushNotifications();
            await saveSubscriptionToServer(subscription.toJSON(), result.token);
            console.log('Push notification subscription saved after login.');
          } catch (error) {
            console.error('Failed to subscribe to push notifications after login:', error.message);
          }
        }
        window.location.hash = '/';
      } else {
        this.#view.showError('Login Gagal. Coba lagi.');
      }
    } catch (error) {
      console.error("Login failed", error);
      this.#view.showError('Login Gagal. Coba lagi.');
    }
  }  
}
