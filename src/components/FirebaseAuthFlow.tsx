// src/components/FirebaseAuthFlow.tsx
import React, { useEffect, useRef, useContext } from "react";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css"; // Import default FirebaseUI styles
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  User as FirebaseUser, // Renamed to avoid conflict if you have a local User type
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Import your initialized Firebase auth and db instances
// MAKE SURE THE PATH IS CORRECT FOR YOUR PROJECT STRUCTURE
import {
  auth as firebaseAuthService,
  db as firestoreService,
} from "../firebase"; // Assuming firebase.ts is in src/

interface FirebaseAuthFlowProps {
  onSignInSuccess: (user: FirebaseUser) => void;
  onUiShown?: () => void;
}

const FirebaseAuthFlow: React.FC<FirebaseAuthFlowProps> = ({
  onSignInSuccess,
  onUiShown,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const uiInstanceRef = useRef<firebaseui.auth.AuthUI | null>(null);

  useEffect(() => {
    if (!firebaseAuthService) {
      console.error(
        "FirebaseAuthFlow: Firebase Auth service is not available. Ensure firebase.ts is initialized and exporting 'auth'.",
      );
      return;
    }
    if (!firestoreService) {
      console.error(
        "FirebaseAuthFlow: Firestore service is not available. Ensure firebase.ts is initialized and exporting 'db'.",
      );
      return;
    }

    // Get or create a FirebaseUI instance.
    // Pass your initialized Firebase Auth instance.
    uiInstanceRef.current =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseAuthService);

    const uiConfig: firebaseui.auth.Config = {
      signInFlow: "popup", // Recommended for SPAs to avoid page reloads.
      signInSuccessUrl: "#", // Not strictly needed as we use a callback.
      signInOptions: [
        GoogleAuthProvider.PROVIDER_ID,
        EmailAuthProvider.PROVIDER_ID,
        // Add other providers from firebase.auth.* here if you enable them
        // e.g., firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          const user = authResult.user as FirebaseUser; // Cast to FirebaseUser
          const isNewUser = authResult.additionalUserInfo?.isNewUser;

          if (user) {
            // Firestore user profile creation/update logic
            (async () => {
              try {
                const userDocRef = doc(firestoreService, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (!userDocSnap.exists() || isNewUser) {
                  await setDoc(
                    userDocRef,
                    {
                      uid: user.uid,
                      email: user.email,
                      displayName:
                        user.displayName || user.email?.split("@")[0] || "User", // Fallback display name
                      createdAt: serverTimestamp(),
                      photoURL: user.photoURL || "",
                      onboardingCompleted: false, // Explicitly set for new users
                      isNewUser: isNewUser || false, // Track if this was a new signup
                      // TODO: Initialize other app-specific fields (e.g., subscriptionStatus: 'free')
                    },
                    { merge: true },
                  ); // Use merge:true if you want to update if user exists but signs in with a new provider (e.g., displayName, photoURL)
                  console.log(
                    "FirebaseUI: User profile created/updated in Firestore for",
                    user.uid,
                  );
                } else {
                  console.log("FirebaseUI: Existing user signed in:", user.uid);
                  // Optionally update last login time or other non-critical fields
                }
                onSignInSuccess(user); // Notify parent component
              } catch (dbError: any) {
                console.error(
                  "FirebaseUI: Error writing user to Firestore:",
                  dbError,
                );

                // Handle specific Firestore offline errors gracefully
                if (
                  dbError?.code === "unavailable" ||
                  dbError?.message?.includes("offline")
                ) {
                  console.log(
                    "🔌 Firestore offline during user creation - authentication still successful",
                  );
                } else if (dbError?.code === "permission-denied") {
                  console.log(
                    "�� Firestore permissions not set up - authentication still successful",
                  );
                }

                // Still call onSignInSuccess as authentication itself was successful
                // User profile will be created when Firestore becomes available
                onSignInSuccess(user);
              }
            })();
          }
          return false; // Prevent FirebaseUI from redirecting, we handle it via callback.
        },
        uiShown: () => {
          if (onUiShown) onUiShown();
          console.log("FirebaseUI widget has been rendered.");
        },
        signInFailure: (error) => {
          // Handle sign-in errors.
          // error.code and error.message will contain useful information.
          console.error("FirebaseUI Sign-In Error:", error);
          // You could set an error state in a parent component here if needed.
          // For example, if error.code === 'firebaseui/anonymous-upgrade-merge-conflict'
          // you might need to handle merging user data as shown in the FirebaseUI docs.
          // For now, we'll just log it.
          return Promise.resolve(); // Indicate error handling is done
        },
      },
      // Optional: Add Terms of Service and Privacy Policy URLs (recommended for production)
      // tosUrl: '/terms-of-service', // You would need to create this page/route
      // privacyPolicyUrl: '/privacy-policy', // You would need to create this page/route
    };

    if (elementRef.current) {
      try {
        uiInstanceRef.current.start(elementRef.current, uiConfig);
      } catch (e) {
        console.error("Error starting FirebaseUI:", e);
      }
    }

    // Cleanup function
    return () => {
      if (uiInstanceRef.current) {
        try {
          uiInstanceRef.current.reset();
        } catch (e) {
          console.error("Error resetting FirebaseUI:", e);
        }
      }
    };
  }, [onSignInSuccess, onUiShown]); // Dependencies for the useEffect hook

  return (
    <div ref={elementRef} id="firebaseui-auth-container" className="w-full" />
  );
};

export default FirebaseAuthFlow;
