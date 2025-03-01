importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCrkYPnSTMFN04IiKuBzZJKUiU20A-_-04",
  authDomain: "talktomeapp-4d11c.firebaseapp.com",
  projectId: "talktomeapp-4d11c",
  storageBucket: "talktomeapp-4d11c.firebasestorage.app",
  messagingSenderId: "547903435256",
  appId: "1:547903435256:web:6b60c2676fc9b7ed07a60d"
});

const messaging = firebase.messaging();

// Manejar mensajes en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log(`Mensaje recibido de ${payload.data?.userNameWhoTalks}`, payload);
  
  const title = payload.notification?.title || "Nuevo Mensaje";
  const body = payload.notification?.body || "Tienes un nuevo mensaje";
  const chatId = payload.data?.chatId || null;

  const notificationOptions = {
    body: body,
    icon: "/firebase-logo.png",
    data: { chatId }
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  console.log("Notificación clickeada", event.notification.data);
  event.notification.close(); // Cierra la notificación

  const { chatId } = event.notification.data;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      console.log("📢 Service Worker ejecutando event.waitUntil");
      if (clientList.length > 0) {
        return clientList[0].navigate(`/chat/${chatId}`).then((client) => client.focus());
      }
      return clients.openWindow(`/chat/${chatId}`);
    })
  );
});
