import {
  User,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../config/firebase";

export interface AuthError {
  code: string;
  message: string;
}

export class AuthService {
  /**
   * Send email verification to the current user
   */
  static async sendVerificationEmail(user?: User): Promise<void> {
    const currentUser = user || auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently signed in");
    }

    await sendEmailVerification(currentUser);
  }

  /**
   * Send password reset email
   */
  static async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  /**
   * Refresh the current user's data (including email verification status)
   */
  static async refreshUser(): Promise<User | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }

    await reload(currentUser);
    return currentUser;
  }

  /**
   * Check if the current user's email is verified
   */
  static isEmailVerified(): boolean {
    return auth.currentUser?.emailVerified ?? false;
  }

  /**
   * Get user-friendly error message
   */
  static getErrorMessage(error: AuthError): string {
    switch (error.code) {
      case "auth/user-not-found":
        return "No account found with this email address.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password should be at least 6 characters long.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/operation-not-allowed":
        return "This sign-in method is not enabled.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      default:
        return error.message || "An unexpected error occurred.";
    }
  }

  /**
   * Change user password (requires recent authentication)
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No authenticated user found");
    }

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
  }

  /**
   * Check if user needs email verification
   */
  static needsEmailVerification(): boolean {
    const user = auth.currentUser;
    return (
      user !== null &&
      !user.emailVerified &&
      user.providerData.some((provider) => provider.providerId === "password")
    );
  }
}
