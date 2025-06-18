import React, { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

interface EmailVerificationPromptProps {
  className?: string;
  onDismiss?: () => void;
}

const EmailVerificationPrompt: React.FC<EmailVerificationPromptProps> = ({
  className = "",
  onDismiss,
}) => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResendVerification = async () => {
    if (!user) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await sendEmailVerification(user);
      setMessage("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      setError("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setLoading(true);
    try {
      await refreshUser();
      if (user?.emailVerified) {
        setMessage("Email verified successfully!");
        setTimeout(() => {
          window.location.reload(); // Refresh the page to update the UI
        }, 1500);
      } else {
        setMessage(
          "Email not yet verified. Please check your inbox and click the verification link.",
        );
      }
    } catch (err) {
      setError("Failed to check verification status.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.emailVerified) {
    return null;
  }

  return (
    <div className={`verification-prompt ${className}`}>
      <div className="verification-content">
        <h3>Email Verification Required</h3>
        <p>
          Please verify your email address to access all features. Check your
          inbox for a verification link.
        </p>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <div className="verification-actions">
          <button
            onClick={handleResendVerification}
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>

          <button
            onClick={handleRefreshStatus}
            className="google-button"
            disabled={loading}
          >
            {loading ? "Checking..." : "I've Verified My Email"}
          </button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="toggle-button"
              style={{ marginTop: "1rem" }}
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPrompt;
