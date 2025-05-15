const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function convertBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
  const base64WithPadding = base64 + padding;
  const rawData = atob(base64WithPadding);
  return Uint8Array.from(rawData, char => char.charCodeAt(0));
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.error('Notification API is not supported.');
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Notification permission denied.');
    return false;
  }
  return true;
}

export async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    throw new Error('Subscription failed: ' + error.message);
  }
}

export async function saveSubscriptionToServer(subscription, token) {
  const { endpoint, keys } = subscription;
  const sanitizedSubscription = {
    endpoint,
    keys: {
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
  };

  console.log('Sending subscription data:', sanitizedSubscription);

  try {
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sanitizedSubscription),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Failed to save subscription:', errorResponse);
      throw new Error(errorResponse.message || 'Failed to save subscription.');
    }

    return response.json();
  } catch (error) {
    console.error('Error in saveSubscriptionToServer:', error);
    throw new Error('Error saving subscription: ' + error.message);
  }
}
