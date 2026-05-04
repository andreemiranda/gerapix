import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// App Check initialization
if (import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}

// TEST CONNECTION (As per guidelines)
async function testConnection() {
  try {
    // Only test if we have at least an API key
    if (firebaseConfig.apiKey) {
      await getDocFromServer(doc(db, 'test', 'connection'));
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error(
        'Firebase Connection Error: The client is offline. Please check your network or Firebase configuration.'
      );
    } else {
      // Ignore other errors during connection test (e.g. Permission Denied is fine, it means we ARE connected)
      console.debug('Firebase connection test performed.');
    }
  }
}
testConnection();

export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut };
