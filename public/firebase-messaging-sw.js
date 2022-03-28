/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyD0j4pHa5i6pbPL2QpSSUo3peTGLNMsxzw',
  authDomain: 'tn-snacks.firebaseapp.com',
  projectId: 'tn-snacks',
  storageBucket: 'tn-snacks.appspot.com',
  messagingSenderId: '711588713745',
  appId: '1:711588713745:web:fab134a677c4f54bc9a8b0'
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
