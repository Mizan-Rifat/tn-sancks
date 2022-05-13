import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';
import { onBackgroundMessage } from 'firebase/messaging/sw';

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyD0j4pHa5i6pbPL2QpSSUo3peTGLNMsxzw',
  authDomain: 'tn-snacks.firebaseapp.com',
  projectId: 'tn-snacks',
  storageBucket: 'tn-snacks.appspot.com',
  messagingSenderId: '711588713745',
  appId: '1:711588713745:web:fab134a677c4f54bc9a8b0'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, payload => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: ''
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
