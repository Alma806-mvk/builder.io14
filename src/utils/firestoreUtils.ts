import {
  doc,
  getDoc,
  setDoc,
  DocumentReference,
  DocumentSnapshot,
} from "firebase/firestore";
import {
  db,
  isFirestoreConnected,
  reconnectFirestore,
  safeFirestoreOperation,
  isOfflineMode,
} from "../config/firebase";

export interface FirestoreOptions {
  retryAttempts?: number;
  retryDelay?: number;
  fallbackToOffline?: boolean;
}

const DEFAULT_OPTIONS: FirestoreOptions = {
  retryAttempts: 2,
  retryDelay: 1000,
  fallbackToOffline: true,
};

/**
 * Enhanced Firestore getDoc with offline handling and retries
 */
export const safeGetDoc = async <T>(
  docRef: DocumentReference,
  options: FirestoreOptions = DEFAULT_OPTIONS,
): Promise<{ data: T | null; success: boolean; error?: string }> => {
  // Immediately return offline mode for Builder.codes environment
  if (isOfflineMode() || window.location.hostname.includes("builder.codes")) {
    return {
      data: null,
      success: false,
      error: "offline",
    };
  }

  try {
    const result = await safeFirestoreOperation(
      async () => {
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data() as T) : null;
      },
      null,
      `getDoc(${docRef.path})`,
    );

    return {
      data: result,
      success: true,
    };
  } catch (error: any) {
    return {
      data: null,
      success: false,
      error: error?.message || "Firestore error",
    };
  }
};

/**
 * Enhanced Firestore setDoc with offline handling and retries
 */
export const safeSetDoc = async <T>(
  docRef: DocumentReference,
  data: T,
  options: FirestoreOptions = DEFAULT_OPTIONS,
): Promise<{ success: boolean; error?: string }> => {
  // Immediately return offline mode for Builder.codes environment
  if (isOfflineMode() || window.location.hostname.includes("builder.codes")) {
    return {
      success: false,
      error: "offline",
    };
  }

  try {
    await safeFirestoreOperation(
      async () => {
        await setDoc(docRef, data, { merge: true });
        return true;
      },
      false,
      `setDoc(${docRef.path})`,
    );

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Firestore error",
    };
  }
};

/**
 * Get document with automatic fallback to default value
 */
export const getDocWithFallback = async <T>(
  docRef: DocumentReference,
  fallbackValue: T,
  options: FirestoreOptions = DEFAULT_OPTIONS,
): Promise<T> => {
  const result = await safeGetDoc<T>(docRef, options);

  if (result.success && result.data !== null) {
    return result.data;
  }

  if (result.error === "offline") {
    console.log("🔌 Using fallback value due to Firestore offline status");
  } else if (result.error) {
    console.warn(
      "⚠️ Using fallback value due to Firestore error:",
      result.error,
    );
  }

  return fallbackValue;
};

/**
 * Create document reference helper
 */
export const createDocRef = (
  collection: string,
  docId: string,
): DocumentReference => {
  return doc(db, collection, docId);
};

/**
 * Check if an error is due to Firestore being offline
 */
export const isOfflineError = (error: any): boolean => {
  return (
    error?.code === "unavailable" ||
    error?.message?.includes("offline") ||
    error?.code === "permission-denied"
  );
};
