// src/firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getRemoteConfig, RemoteConfig } from 'firebase/remote-config';
import { getPerformance, FirebasePerformance } from 'firebase/performance';
import { initializeAppCheck, AppCheck } from 'firebase/app-check';
// If you decide to use ReCaptchaV3Provider directly from here, import it.
// Otherwise, it can be initialized in App.tsx or a specific AppCheck setup file.

// Your web app's Firebase configuration
// IMPORTANT: These should ideally come from environment variables, similar to your API_KEY
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY, // See Step 3.2
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID, // For Google Analytics
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics: Analytics = getAnalytics(app);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const functions: Functions = getFunctions(app); // Optional: specify region e.g., getFunctions(app, 'us-central1')
const storage: FirebaseStorage = getStorage(app);
const remoteConfig: RemoteConfig = getRemoteConfig(app);
const performance: FirebasePerformance = getPerformance(app);
let appCheckInstance: AppCheck | null = null;

// Initialize App Check (example, reCAPTCHA site key will be needed)
// You might want to lazy load this or initialize it after user consent if needed
if (typeof window !== 'undefined' && process.env.RECAPTCHA_SITE_KEY) {
  // Dynamically import ReCaptchaV3Provider to avoid errors during SSR or build if not used immediately
  // import('firebase/app-check').then(({ ReCaptchaV3Provider }) => {
  //   appCheckInstance = initializeAppCheck(app, {
  //     provider: new ReCaptchaV3Provider(process.env.RECAPTCHA_SITE_KEY!),
  //     isTokenAutoRefreshEnabled: true,
  //   });
  // }).catch(err => console.error("Error initializing App Check:", err));
  // For now, we'll initialize it as null and properly set it up in a dedicated AppCheck phase.
}


// Configure Remote Config (optional, good practice)
remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
remoteConfig.defaultConfig = {
  // Define any default parameters your app might use
  "example_feature_flag": false,
};

export {
  app,
  analytics,
  auth,
  db,
  functions,
  storage,
  remoteConfig,
  performance,
  appCheckInstance // Export as potentially null, handle in usage
};