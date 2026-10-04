import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';

// TravelTwin Firebase project config
const firebaseConfig = {
  apiKey: 'AIzaSyCAYoB30CK_9dpZA_ei0ZDVuz0ynQq00vY',
  authDomain: 'traveltwin-4f80a.firebaseapp.com',
  projectId: 'traveltwin-4f80a',
  storageBucket: 'traveltwin-4f80a.firebasestorage.app',
  messagingSenderId: '319685082117',
  appId: '1:319685082117:web:e8571b9ac9a26a0869f06c',
  measurementId: 'G-NF0Y8N0E6H',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Auth
export const auth = getAuth(app);

// Google provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Helper: sign in with Google popup
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Helper: sign out
export const firebaseSignOut = () => signOut(auth);

// Helper: listen to auth state
export const onFirebaseAuthStateChanged = (
  cb: (user: FirebaseUser | null) => void
) => onAuthStateChanged(auth, cb);

export type { FirebaseUser };
