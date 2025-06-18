import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { auth, db } from "../config/firebase"; // Adjust the path if necessary
import { User, onAuthStateChanged, reload } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { safeGetDoc, createDocRef } from "../utils/firestoreUtils";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isEmailVerified: boolean;
  needsOnboarding: boolean;
  refreshUser: () => Promise<void>;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to avoid infinite loading
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  const refreshUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      setIsEmailVerified(auth.currentUser.emailVerified);
      await checkOnboardingStatus(auth.currentUser);
    }
  };

  const checkOnboardingStatus = async (user: User) => {
    try {
      const userDocRef = createDocRef("users", user.uid);
      const result = await safeGetDoc<{ onboardingCompleted?: boolean }>(
        userDocRef,
        {
          retryAttempts: 1,
          retryDelay: 500,
          fallbackToOffline: true,
        },
      );

      if (result.success && result.data) {
        const userData = result.data;
        const onboardingCompleted = userData.onboardingCompleted || false;
        const isNewUser = userData.isNewUser || false;

        // Only show onboarding survey for NEW users who haven't completed it yet
        // AND are email verified
        const shouldShowOnboarding =
          user.emailVerified && isNewUser && !onboardingCompleted;

        setNeedsOnboarding(shouldShowOnboarding);

        console.log("🔍 Onboarding check:", {
          isEmailVerified: user.emailVerified,
          isNewUser,
          onboardingCompleted,
          shouldShowOnboarding,
        });
      } else if (result.error === "offline") {
        console.log("🔌 Firestore offline - skipping onboarding for safety");
        // When offline, don't show onboarding to avoid interrupting user experience
        setNeedsOnboarding(false);
      } else {
        console.log(
          "🔒 Firestore access issue - skipping onboarding for safety",
        );
        // When Firestore is inaccessible, don't show onboarding
        setNeedsOnboarding(false);
      }
    } catch (error: any) {
      console.error("Error checking onboarding status:", error);
      // Fallback: assume no onboarding needed to avoid blocking users
      setNeedsOnboarding(false);
    }
  };

  const completeOnboarding = () => {
    setNeedsOnboarding(false);
  };

  useEffect(() => {
    console.log("AuthContext: Setting up auth state listener");

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(
        "AuthContext: Auth state changed. User is:",
        user ? "logged in" : "no user",
      );
      setUser(user);
      setIsEmailVerified(user?.emailVerified ?? false);

      if (user) {
        await checkOnboardingStatus(user);
      } else {
        setNeedsOnboarding(false);
      }

      setLoading(false); // Always ensure loading is false after auth state change
    });

    // Immediate fallback - ensure we're never stuck loading
    setTimeout(() => {
      console.log("AuthContext: Emergency timeout - ensuring loading is false");
      setLoading(false);
    }, 100);

    return () => {
      console.log("AuthContext: Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  console.log(
    "AuthContext: Rendering with user:",
    user ? "logged in" : "not logged in",
    " loading:",
    loading,
    " emailVerified:",
    isEmailVerified,
    " needsOnboarding:",
    needsOnboarding,
  );
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isEmailVerified,
        needsOnboarding,
        refreshUser,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
