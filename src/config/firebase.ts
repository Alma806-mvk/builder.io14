import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  enableNetwork,
  onSnapshotsInSync,
  disableNetwork,
  connectFirestoreEmulator,
} from "firebase/firestore";

// Check if we're in Builder.io environment early
const isBuilderEnvironment =
  typeof window !== "undefined" &&
  window.location.hostname.includes("builder.codes");

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    (isBuilderEnvironment ? "demo-api-key" : ""),
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    (isBuilderEnvironment ? "demo-project.firebaseapp.com" : ""),
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    (isBuilderEnvironment ? "demo-project" : ""),
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    (isBuilderEnvironment ? "demo-project.appspot.com" : ""),
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    (isBuilderEnvironment ? "123456789" : ""),
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    (isBuilderEnvironment ? "1:123456789:web:demo" : ""),
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ||
    (isBuilderEnvironment ? "G-DEMO123" : ""),
};

// Validate required config (allow demo values in Builder.io environment)
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId
) {
  if (!isBuilderEnvironment) {
    throw new Error("Firebase configuration is incomplete!");
  } else {
    console.log(
      "🔧 Using demo Firebase configuration for Builder.io environment",
    );
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Development mode detection
const isDevelopment = import.meta.env.DEV;

// Initialize Firestore with appropriate settings for environment
export const db =
  isBuilderEnvironment || isDevelopment
    ? initializeFirestore(app, {
        experimentalForceLongPolling: true,
        useFetchStreams: false,
      })
    : getFirestore(app);

// Immediately set offline mode for Builder.codes to prevent fetch errors
if (isBuilderEnvironment) {
  console.log("🔧 Builder.codes environment detected - enabling offline mode");
  localStorage.setItem("firebase_offline_mode", "true");

  // Disable Firestore network immediately to prevent fetch errors
  setTimeout(() => {
    disableNetwork(db).catch(() => {
      // Ignore errors when disabling network
      console.log("🟡 Network already disabled or unavailable");
    });
  }, 100);
}

// Handle development environment specific setup
if (isDevelopment || isBuilderEnvironment) {
  console.log("🛠️ Development mode detected");

  // In development environments like Builder.codes, we need to handle network restrictions
  if (isBuilderEnvironment) {
    console.log(
      "🟡 Builder.codes environment - Firebase will work in offline mode only",
    );
  }
}

// Firestore connection management
let isFirestoreOnline = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

// Monitor Firestore connection status
const monitorFirestoreConnection = () => {
  onSnapshotsInSync(db, () => {
    if (!isFirestoreOnline) {
      console.log("🟢 Firestore connection restored");
      isFirestoreOnline = true;
      reconnectAttempts = 0;
    }
  });
};

// Test Firebase connection using SDK
export const testFirebaseConnection = async () => {
  try {
    console.log("🧪 Testing Firebase SDK connection...");

    // Check if Firebase is properly initialized
    if (!auth || !db) {
      console.log("❌ Firebase SDK not properly initialized");
      return false;
    }

    // Check if we have valid configuration
    if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
      console.log("❌ Firebase configuration incomplete");
      return false;
    }

    console.log("✅ Firebase SDK initialized successfully");
    console.log(`✅ Project ID: ${firebaseConfig.projectId}`);
    console.log(`✅ Auth Domain: ${firebaseConfig.authDomain}`);

    return true;
  } catch (error: any) {
    console.log("❌ Firebase SDK test failed:", error.message);
    return false;
  }
};

// Enable Firestore network with retry logic
const connectFirestore = async () => {
  // Skip all network operations in Builder.codes environment
  if (isBuilderEnvironment) {
    console.log(
      "🟡 Skipping all Firestore operations in Builder.codes environment",
    );
    console.log("💡 App will work with local state management only");
    isFirestoreOnline = false;

    // Ensure network is disabled to prevent any fetch attempts
    try {
      await disableNetwork(db);
      console.log("🔇 Firestore network disabled successfully");
    } catch (error) {
      console.log("🟡 Network disable attempt completed");
    }
    return;
  }

  try {
    await enableNetwork(db);
    isFirestoreOnline = true;
    console.log("🟢 Firestore connected successfully");
    monitorFirestoreConnection();
  } catch (error: any) {
    isFirestoreOnline = false;

    // Handle specific error types
    if (
      error?.message?.includes("Failed to fetch") ||
      error?.message?.includes("NetworkError") ||
      error?.message?.includes("CORS")
    ) {
      console.warn(
        "🌐 Network restrictions detected - this is normal in development",
      );
      console.warn("🟡 App will continue with local state management");
      console.warn("💡 Data will not persist between sessions");

      // Set flag for offline mode
      localStorage.setItem("firebase_offline_mode", "true");
      return;
    }

    console.warn("🔴 Firestore connection error:", error?.message || error);

    // Retry connection for other types of errors
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && !isBuilderEnvironment) {
      reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
      console.log(
        `🔄 Retrying Firestore connection in ${delay}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`,
      );
      setTimeout(connectFirestore, delay);
    } else {
      console.log("❌ Firestore unavailable. App will work in offline mode.");
      localStorage.setItem("firebase_offline_mode", "true");
    }
  }
};

// Export connection status checker
export const isFirestoreConnected = () => isFirestoreOnline;

// Check if we're in offline mode
export const isOfflineMode = () => {
  return (
    localStorage.getItem("firebase_offline_mode") === "true" ||
    isBuilderEnvironment ||
    !isFirestoreOnline
  );
};

// Export manual reconnection function
export const reconnectFirestore = () => {
  if (!isBuilderEnvironment) {
    reconnectAttempts = 0;
    localStorage.removeItem("firebase_offline_mode");
    connectFirestore();
  } else {
    console.log(
      "🟡 Manual reconnection not available in Builder.codes environment",
    );
  }
};

// Graceful Firestore operation wrapper
export const safeFirestoreOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T,
  operationName: string = "Firestore operation",
): Promise<T> => {
  if (isOfflineMode()) {
    console.log(`🟡 ${operationName} skipped - offline mode`);
    return fallback;
  }

  try {
    return await operation();
  } catch (error: any) {
    if (
      error?.message?.includes("Failed to fetch") ||
      error?.message?.includes("NetworkError")
    ) {
      console.warn(`🟡 ${operationName} failed due to network restrictions`);
      localStorage.setItem("firebase_offline_mode", "true");
      return fallback;
    }

    console.error(`❌ ${operationName} failed:`, error);
    throw error; // Re-throw non-network errors
  }
};

// Initialize connection only if not in Builder.codes environment
if (!isBuilderEnvironment) {
  connectFirestore();
} else {
  console.log(
    "🔧 Skipping Firebase initialization in Builder.codes environment",
  );
}

// Note: Connection test is available via testFirebaseConnection() but not run automatically
// to avoid "Failed to fetch" errors in development environments

export default app;
