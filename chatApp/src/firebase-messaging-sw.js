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

messaging.onBackgroundMessage((payload) => {
  console.log(`Mensaje recibido de ${payload.body}`, payload);
  self.registration.showNotification(payload.notification, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});
