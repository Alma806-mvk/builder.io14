import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { AuthService } from "../services/authService";
import { SUBSCRIPTION_PLANS } from "../services/stripeService";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  ChartBarIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from "./IconComponents";
import LoadingSpinner from "./LoadingSpinner";
import EmailVerificationPrompt from "./EmailVerificationPrompt";

interface AccountPageProps {
  onNavigateToBilling: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ onNavigateToBilling }) => {
  const { user, isEmailVerified, refreshUser } = useAuth();
  const { billingInfo, loading: subscriptionLoading } = useSubscription();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black flex items-center justify-center">
        <div className="text-white">Please sign in to view your account.</div>
      </div>
    );
  }

  const currentPlan =
    SUBSCRIPTION_PLANS.find(
      (p) => p.id === (billingInfo?.subscription?.planId || "free"),
    ) || SUBSCRIPTION_PLANS[0];

  const usagePercentage =
    currentPlan.limits.generations === -1
      ? 0
      : ((billingInfo?.usage?.generations || 0) /
          currentPlan.limits.generations) *
        100;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await AuthService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      setPasswordSuccess("Password updated successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error: any) {
      setPasswordError(AuthService.getErrorMessage(error));
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Canceled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Free
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Account Settings
            </h1>
            <p className="text-slate-400">
              Manage your profile, subscription, and security settings
            </p>
          </div>

          {/* Email Verification Banner */}
          {!isEmailVerified && (
            <div className="mb-6">
              <EmailVerificationPrompt />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <UserCircleIcon className="h-6 w-6 text-sky-400" />
                <h2 className="text-xl font-semibold text-white">
                  Profile Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Display Name
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={user.displayName || ""}
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Enter your display name"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="email"
                      value={user.email || ""}
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white opacity-60"
                      readOnly
                    />
                    {isEmailVerified ? (
                      <CheckCircleIcon
                        className="h-5 w-5 text-green-400"
                        title="Verified"
                      />
                    ) : (
                      <ExclamationTriangleIcon
                        className="h-5 w-5 text-yellow-400"
                        title="Not verified"
                      />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isEmailVerified ? "Email verified" : "Email not verified"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Account Created
                  </label>
                  <input
                    type="text"
                    value={formatDate(user.metadata?.creationTime)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white opacity-60"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Last Sign In
                  </label>
                  <input
                    type="text"
                    value={formatDate(user.metadata?.lastSignInTime)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white opacity-60"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <ShieldCheckIcon className="h-6 w-6 text-sky-400" />
                <h2 className="text-xl font-semibold text-white">Security</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Sign-in Method
                  </label>
                  <div className="flex items-center space-x-2">
                    {user.providerData.map((provider, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300"
                      >
                        {provider.providerId === "password" ? (
                          <>
                            <EnvelopeIcon className="w-3 h-3 mr-1" />
                            Email & Password
                          </>
                        ) : provider.providerId === "google.com" ? (
                          <>
                            <span className="mr-1">🔵</span>
                            Google
                          </>
                        ) : (
                          provider.providerId
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {user.providerData.some((p) => p.providerId === "password") && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-slate-400">
                        Password
                      </label>
                      <button
                        onClick={() =>
                          setIsChangingPassword(!isChangingPassword)
                        }
                        className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
                      >
                        {isChangingPassword ? "Cancel" : "Change Password"}
                      </button>
                    </div>

                    {isChangingPassword && (
                      <form
                        onSubmit={handlePasswordChange}
                        className="space-y-3"
                      >
                        <input
                          type="password"
                          placeholder="Current password"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="password"
                          placeholder="New password"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          required
                        />

                        {passwordError && (
                          <div className="text-red-400 text-sm">
                            {passwordError}
                          </div>
                        )}
                        {passwordSuccess && (
                          <div className="text-green-400 text-sm">
                            {passwordSuccess}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isUpdatingProfile}
                          className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                        >
                          {isUpdatingProfile
                            ? "Updating..."
                            : "Update Password"}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Subscription Overview */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <CreditCardIcon className="h-6 w-6 text-sky-400" />
                  <h2 className="text-xl font-semibold text-white">
                    Subscription
                  </h2>
                </div>
                <button
                  onClick={onNavigateToBilling}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Manage Billing
                </button>
              </div>

              {subscriptionLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Current Plan
                    </label>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold text-white">
                          {currentPlan.name}
                        </div>
                        <div className="text-sm text-slate-400">
                          {currentPlan.price > 0
                            ? `$${currentPlan.price}/${currentPlan.interval}`
                            : "Free"}
                        </div>
                      </div>
                      {getStatusBadge(billingInfo?.status || "free")}
                    </div>
                  </div>

                  {billingInfo?.subscription && (
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Next Billing Date
                      </label>
                      <div className="text-white">
                        {formatDate(billingInfo.subscription.currentPeriodEnd)}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Plan Features
                    </label>
                    <ul className="text-sm text-slate-300 space-y-1">
                      {currentPlan.features
                        .slice(0, 3)
                        .map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircleIcon className="h-4 w-4 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      {currentPlan.features.length > 3 && (
                        <li className="text-slate-400">
                          +{currentPlan.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Usage Statistics */}
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <ChartBarIcon className="h-6 w-6 text-sky-400" />
                <h2 className="text-xl font-semibold text-white">
                  Usage Statistics
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-400">
                      AI Generations This Month
                    </label>
                    <span className="text-sm text-white">
                      {billingInfo?.usage?.generations || 0} /{" "}
                      {currentPlan.limits.generations === -1
                        ? "∞"
                        : currentPlan.limits.generations}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        usagePercentage > 90
                          ? "bg-red-500"
                          : usagePercentage > 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                  {usagePercentage > 80 && currentPlan.id === "free" && (
                    <p className="text-yellow-400 text-xs mt-2">
                      ⚠️ Approaching monthly limit
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <div className="text-sm text-slate-400">Canvas Access</div>
                    <div className="text-white font-medium">
                      {currentPlan.limits.canvas ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Analytics</div>
                    <div className="text-white font-medium">
                      {currentPlan.limits.analytics ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">API Access</div>
                    <div className="text-white font-medium">
                      {currentPlan.limits.apiAccess ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">
                      Custom Personas
                    </div>
                    <div className="text-white font-medium">
                      {currentPlan.limits.customPersonas
                        ? "Enabled"
                        : "Disabled"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
