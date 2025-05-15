// api.js

export const BASE_URL = 'https://story-api.dicoding.dev/v1';

/**
 * Fungsi untuk register user baru.
 */
export async function register({ name, email, password }) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const result = await response.json();
  if (!response.ok) {
    console.error('Registration failed:', result);
    throw new Error(result.message);
  }
  return result;
}

/**
 * Fungsi login user dan kembalikan token + user info.
 */
export async function login({ email, password }) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();
  if (!response.ok) {
    console.error('Login failed:', result);
    throw new Error(result.message);
  }

  return result.loginResult; // Mengembalikan {userId, name, token}
}

/**
 * Ambil daftar cerita. Token optional.
 */
export async function getStories(token = null, withLocation = true) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/stories?location=${withLocation ? 1 : 0}`, {
    method: 'GET',
    headers,
  });

  const result = await response.json();
  if (!response.ok) {
    console.error('Failed to fetch stories:', result);
    throw new Error(result.message);
  }

  return result;
}

/**
 * Tambah cerita baru dengan deskripsi, foto, dan lokasi.
 */
export async function postStory({ description, photo, lat, lon }, token) {
  if (!description || !photo || typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Invalid story data. Ensure all fields are filled correctly.');
  }

  if (!token || typeof token !== 'string') {
    throw new Error('Authorization token is invalid.');
  }

  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  formData.append('lat', String(lat));
  formData.append('lon', String(lon));

  // Debugging: Log FormData content and token
  console.log('FormData content:');
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  console.log('Authorization token:', token);

  const response = await fetch(`${BASE_URL}/stories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`, // Ensure token is valid
    },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    console.error('Failed to post story:', result);
    throw new Error(result.message);
  }

  return result;
}

/**
 * Subscribe to push notifications.
 */
export async function subscribePushNotification({ endpoint, keys }, token) {
  const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ endpoint, keys }),
  });

  const result = await response.json();
  if (!response.ok) {
    console.error('Failed to subscribe to push notifications:', result);
    throw new Error(result.message);
  }

  return result;
}

/**
 * Unsubscribe from push notifications.
 */
export async function unsubscribePushNotification(endpoint, token) {
  const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ endpoint }),
  });

  const result = await response.json();
  if (!response.ok) {
    console.error('Failed to unsubscribe from push notifications:', result);
    throw new Error(result.message);
  }

  return result;
}
