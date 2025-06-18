import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthService } from "../services/authService";
import "./Auth.css";

interface AuthProps {
  className?: string;
  onAuthSuccess?: () => void;
}

type AuthMode = "signin" | "signup" | "forgot-password" | "verify-email";

const Auth: React.FC<AuthProps> = ({ className = "", onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await AuthService.sendVerificationEmail(userCredential.user);
        setMode("verify-email");
        setMessage(
          "Account created! Please check your email to verify your account before signing in.",
        );
      } else if (mode === "signin") {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        if (!userCredential.user.emailVerified) {
          setError(
            "Please verify your email before signing in. Check your inbox for a verification link.",
          );
          return;
        }
        onAuthSuccess?.();
      } else if (mode === "forgot-password") {
        await AuthService.sendPasswordReset(email);
        setMessage(
          "Password reset email sent! Check your inbox for instructions.",
        );
      }
    } catch (err: any) {
      setError(AuthService.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    clearMessages();

    try {
      await signInWithPopup(auth, provider);
      onAuthSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      setError("No user found. Please sign up again.");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      await AuthService.sendVerificationEmail(auth.currentUser);
      setMessage("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      setError(AuthService.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "signup":
        return "Sign Up";
      case "signin":
        return "Sign In";
      case "forgot-password":
        return "Reset Password";
      case "verify-email":
        return "Verify Email";
      default:
        return "Sign In";
    }
  };

  const getButtonText = () => {
    if (loading) return "Please wait...";
    switch (mode) {
      case "signup":
        return "Sign Up";
      case "signin":
        return "Sign In";
      case "forgot-password":
        return "Send Reset Email";
      case "verify-email":
        return "Resend Verification";
      default:
        return "Sign In";
    }
  };

  return (
    <div className={`auth-container ${className}`}>
      <h2>{getTitle()}</h2>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      {mode === "verify-email" ? (
        <div className="verification-content">
          <p>
            We've sent a verification email to <strong>{email}</strong>
          </p>
          <p>
            Please check your inbox and click the verification link to activate
            your account.
          </p>
          <button
            onClick={handleResendVerification}
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>
          <p>
            Already verified?{" "}
            <button className="toggle-button" onClick={() => setMode("signin")}>
              Sign In
            </button>
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {mode !== "forgot-password" && (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}

            <button type="submit" className="auth-button" disabled={loading}>
              {getButtonText()}
            </button>
          </form>

          {mode === "signin" && (
            <button
              onClick={handleGoogleSignIn}
              className="google-button"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Sign in with Google"}
            </button>
          )}

          <div className="auth-links">
            {mode === "signin" && (
              <>
                <p>
                  <button
                    className="toggle-button"
                    onClick={() => {
                      setMode("forgot-password");
                      clearMessages();
                    }}
                  >
                    Forgot your password?
                  </button>
                </p>
                <p>
                  Don't have an account?{" "}
                  <button
                    className="toggle-button"
                    onClick={() => {
                      setMode("signup");
                      clearMessages();
                    }}
                  >
                    Sign Up
                  </button>
                </p>
              </>
            )}

            {mode === "signup" && (
              <p>
                Already have an account?{" "}
                <button
                  className="toggle-button"
                  onClick={() => {
                    setMode("signin");
                    clearMessages();
                  }}
                >
                  Sign In
                </button>
              </p>
            )}

            {mode === "forgot-password" && (
              <p>
                Remember your password?{" "}
                <button
                  className="toggle-button"
                  onClick={() => {
                    setMode("signin");
                    clearMessages();
                  }}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Auth;
