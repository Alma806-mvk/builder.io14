import { useState, useCallback } from "react";
import { AuthService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

interface UseAuthHelpersReturn {
  loading: boolean;
  error: string | null;
  message: string | null;
  sendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
  clearMessages: () => void;
}

export const useAuthHelpers = (): UseAuthHelpersReturn => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setMessage(null);
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    if (!user) {
      setError("No user is currently signed in");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      await AuthService.sendVerificationEmail(user);
      setMessage("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      setError(AuthService.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user, clearMessages]);

  const sendPasswordReset = useCallback(
    async (email: string) => {
      if (!email) {
        setError("Please provide an email address");
        return;
      }

      setLoading(true);
      clearMessages();

      try {
        await AuthService.sendPasswordReset(email);
        setMessage(
          "Password reset email sent! Check your inbox for instructions.",
        );
      } catch (err: any) {
        setError(AuthService.getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [clearMessages],
  );

  const refreshUserData = useCallback(async () => {
    setLoading(true);
    clearMessages();

    try {
      await refreshUser();
      if (user?.emailVerified) {
        setMessage("Email verification status updated!");
      }
    } catch (err: any) {
      setError("Failed to refresh user data");
    } finally {
      setLoading(false);
    }
  }, [user, refreshUser, clearMessages]);

  return {
    loading,
    error,
    message,
    sendVerificationEmail,
    sendPasswordReset,
    refreshUserData,
    clearMessages,
  };
};
