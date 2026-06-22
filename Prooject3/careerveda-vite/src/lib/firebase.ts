// ─── Firebase connection is COMMENTED OUT ──────────────────────────────
// The app now uses localStorage-based mock auth instead.
// Uncomment the block below to re-enable Firebase.
//
// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import { getFunctions } from 'firebase/functions';
//
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock-auth-domain.firebaseapp.com",
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock-project-id",
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mock-storage-bucket.appspot.com",
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
//   appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234:web:abcd",
// };
//
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
//
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);
// export const functions = getFunctions(app);
//
// export default app;

// Stub exports so other files don't break
export const auth = null as any;
export const db = null as any;
export const storage = null as any;
export const functions = null as any;
export default null as any;
