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
    data: { chatId: payload.data?.chatId }
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].navigate(`localhost:4200/chats/${event.notification.data.chatId}`).then(client => client.focus());
      }
      return clients.openWindow(`/chats/${event.notification.data.chatId}`);
    })
  );
});




self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// self.addEventListener('push', function(event) {
//   console.log("📩 Notificación push recibida:", event.data.json());

//   if (event.data) {
//       const notificationData = event.data.json();
//       const chatId = notificationData.data.chatId;

//       const notificationTitle = notificationData.notification.title;
//       const notificationOptions = {
//           body: notificationData.notification.body,
//           data: { chatId },
//       };

//       event.waitUntil(
//           self.registration.showNotification(notificationTitle, notificationOptions)
//       );
//   }
// });
