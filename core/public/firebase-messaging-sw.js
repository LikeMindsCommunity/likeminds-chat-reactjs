// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBWjDQEiYKdQbQNvoiVvvOn_cbufQzvWuo",
  authDomain: "collabmates-beta.firebaseapp.com",
  databaseURL: "https://collabmates-beta.firebaseio.com",
  projectId: "collabmates-beta",
  storageBucket: "collabmates-beta.appspot.com",
  messagingSenderId: "983690302378",
  appId: "1:983690302378:web:b2fa2c58f2351d5c1b91d3",
  measurementId: "G-R2PXYC9F4S",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
