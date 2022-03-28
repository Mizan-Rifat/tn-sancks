import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';

//live
const firebaseConfig = {
  apiKey: 'AIzaSyD0j4pHa5i6pbPL2QpSSUo3peTGLNMsxzw',
  authDomain: 'tn-snacks.firebaseapp.com',
  projectId: 'tn-snacks',
  storageBucket: 'tn-snacks.appspot.com',
  messagingSenderId: '711588713745',
  appId: '1:711588713745:web:fab134a677c4f54bc9a8b0'
};

//test
// const firebaseConfig = {
//   apiKey: 'AIzaSyBv7H9Si3ytdgB79Vp06YmLZBt_Y5bRoWw',
//   authDomain: 'tn-snacks-staging.firebaseapp.com',
//   projectId: 'tn-snacks-staging',
//   storageBucket: 'tn-snacks-staging.appspot.com',
//   messagingSenderId: '810232991026',
//   appId: '1:810232991026:web:90e8376ddfcbc187011b2b'
// };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export const currentUser = auth.currentUser;
