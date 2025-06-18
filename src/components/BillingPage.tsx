import React, { useEffect, useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import {
  SUBSCRIPTION_PLANS,
  createCheckoutSession,
  redirectToCustomerPortal,
} from "../services/stripeService";
import {
  CreditCardIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  StarIcon,
  BoltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ClockIcon,
} from "./IconComponents";
import { auth } from "../config/firebase";
import LoadingSpinner from "./LoadingSpinner";

const BillingPage: React.FC = () => {
  const { billingInfo, loading, refreshBilling } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const user = auth.currentUser;

  useEffect(() => {
    // Check for success/cancel params from Stripe redirect
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const canceled = urlParams.get("canceled");

    if (success) {
      refreshBilling();
    }

    if (canceled) {
      console.log("Payment was canceled");
    }
  }, [refreshBilling]);

  const handleUpgrade = async (planId: string) => {
    if (!user) return;

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan || !plan.stripePriceId) return;

    setIsProcessing(true);
    setSelectedPlan(planId);
    try {
      await createCheckoutSession(plan.stripePriceId, user.uid);
    } catch (error) {
      console.error("Error upgrading:", error);
      alert("Error starting upgrade process. Please try again.");
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const handleManageBilling = async () => {
    if (!billingInfo?.subscription?.stripeCustomerId) return;

    setIsProcessing(true);
    try {
      await redirectToCustomerPortal(billingInfo.subscription.stripeCustomerId);
    } catch (error) {
      console.error("Error opening customer portal:", error);
      alert("Error opening billing management. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-slate-400 mt-4">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (!billingInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <XCircleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Error Loading Billing
          </h2>
          <p className="text-red-400">
            Unable to load billing information. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS.find(
    (p) => p.id === (billingInfo.subscription?.planId || "free"),
  )!;
  const usagePercentage =
    currentPlan.limits.generations === -1
      ? 0
      : (billingInfo.usage.generations / currentPlan.limits.generations) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Billing & Subscription
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Manage your subscription, track usage, and upgrade your plan to
              unlock more powerful AI features.
            </p>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Current Plan */}
            <div className="bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-sky-400">
                  Current Plan
                </h3>
                <StarIcon className="h-5 w-5 text-sky-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {currentPlan.name}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                ${currentPlan.price}/{currentPlan.interval}
              </p>
            </div>

            {/* Usage */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-green-400">
                  Generations Used
                </h3>
                <ChartBarIcon className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">
                {billingInfo.usage.generations}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                of{" "}
                {currentPlan.limits.generations === -1
                  ? "∞"
                  : currentPlan.limits.generations}{" "}
                this month
              </p>
            </div>

            {/* Status */}
            <div
              className={`bg-gradient-to-r ${
                billingInfo.status === "active"
                  ? "from-green-500/10 to-emerald-500/10 border-green-500/20"
                  : "from-red-500/10 to-pink-500/10 border-red-500/20"
              } border rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3
                  className={`text-sm font-medium ${
                    billingInfo.status === "active"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  Status
                </h3>
                {billingInfo.status === "active" ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-400" />
                )}
              </div>
              <p className="text-2xl font-bold text-white capitalize">
                {billingInfo.status}
              </p>
              <p className="text-sm text-slate-400 mt-1">Subscription status</p>
            </div>

            {/* Next Billing */}
            {billingInfo.subscription && (
              <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-purple-400">
                    Next Billing
                  </h3>
                  <CalendarDaysIcon className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-lg font-bold text-white">
                  {new Date(
                    billingInfo.subscription.currentPeriodEnd,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {billingInfo.daysLeft} days left
                </p>
              </div>
            )}
          </div>

          {/* Usage Details */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BoltIcon className="h-6 w-6 text-yellow-400 mr-3" />
                Usage Analytics
              </h2>
              <div className="text-sm text-slate-400">Resets monthly</div>
            </div>

            <div className="space-y-6">
              {/* AI Generations */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                    <span className="text-white font-medium">
                      AI Content Generations
                    </span>
                  </div>
                  <span className="text-slate-300 font-mono">
                    {billingInfo.usage.generations} /{" "}
                    {currentPlan.limits.generations === -1
                      ? "∞"
                      : currentPlan.limits.generations}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      usagePercentage > 90
                        ? "bg-gradient-to-r from-red-500 to-red-600"
                        : usagePercentage > 70
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500"
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
                {usagePercentage > 80 && currentPlan.id === "free" && (
                  <div className="mt-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center mr-3 mt-0.5">
                        <ClockIcon className="h-3 w-3 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-amber-400 font-medium mb-1">
                          Approaching Limit
                        </p>
                        <p className="text-amber-300 text-sm">
                          You're using {Math.round(usagePercentage)}% of your
                          monthly quota. Consider upgrading to continue creating
                          amazing content.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Choose Your Plan
              </h2>
              <p className="text-slate-400 text-lg mb-6">
                Unlock more powerful features and higher limits with our premium
                plans
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setBillingInterval("monthly")}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      billingInterval === "monthly"
                        ? "bg-slate-700 text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingInterval("yearly")}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 relative ${
                      billingInterval === "yearly"
                        ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Yearly
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {SUBSCRIPTION_PLANS.filter((plan) => {
                if (plan.id === "free") return true; // Always show free plan
                return billingInterval === "yearly"
                  ? plan.interval === "year"
                  : plan.interval === "month";
              }).map((plan) => {
                const isCurrentPlan = plan.id === currentPlan.id;
                const isSelected = selectedPlan === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={`relative border-2 rounded-2xl p-8 transition-all duration-300 ${
                      plan.popular
                        ? "border-sky-500 ring-4 ring-sky-500/20 shadow-2xl shadow-sky-500/25 scale-105"
                        : isCurrentPlan
                          ? "border-green-500 ring-2 ring-green-500/20"
                          : "border-slate-600 hover:border-slate-500"
                    } ${
                      isCurrentPlan
                        ? "bg-gradient-to-b from-green-500/5 to-emerald-500/5"
                        : "bg-gradient-to-b from-slate-800/50 to-slate-900/50"
                    } backdrop-blur-sm hover:shadow-xl`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                          ✨ Most Popular
                        </div>
                      </div>
                    )}

                    {isCurrentPlan && (
                      <div className="absolute -top-4 right-6">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                          ✓ Current
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="mb-4">
                        {plan.interval === "year" ? (
                          <div>
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <span className="text-3xl text-slate-400 line-through">
                                $
                                {plan.id === "pro_yearly"
                                  ? 288
                                  : plan.id === "business_yearly"
                                    ? 948
                                    : 3588}
                              </span>
                              <span className="text-5xl font-bold text-white">
                                ${plan.price}
                              </span>
                            </div>
                            <div className="text-slate-400 text-lg">
                              /year •
                              <span className="text-green-400 font-medium ml-1">
                                Save $
                                {plan.id === "pro_yearly"
                                  ? 58
                                  : plan.id === "business_yearly"
                                    ? 190
                                    : 718}
                              </span>
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              ${Math.round(plan.price / 12)} per month
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-5xl font-bold text-white">
                              ${plan.price}
                            </span>
                            {plan.price > 0 && (
                              <span className="text-slate-400 text-lg">
                                /{plan.interval}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-slate-400 text-lg leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3 mt-0.5">
                            <CheckCircleIcon className="h-4 w-4 text-green-400" />
                          </div>
                          <span className="text-slate-300 leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {isCurrentPlan ? (
                        <>
                          <div className="w-full py-4 px-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 rounded-xl font-bold text-center">
                            ✓ Your Current Plan
                          </div>
                          {billingInfo.subscription && (
                            <button
                              onClick={handleManageBilling}
                              disabled={isProcessing}
                              className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                              <CreditCardIcon className="h-5 w-5" />
                              <span>Manage Billing</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isProcessing || plan.id === "free"}
                          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                            plan.id === "free"
                              ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                              : plan.popular
                                ? "bg-gradient-to-r from-emerald-600 via-sky-600 to-purple-600 hover:from-emerald-500 hover:via-sky-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                                : "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white"
                          } ${isSelected ? "opacity-50" : ""}`}
                        >
                          {isSelected ? (
                            <div className="flex items-center justify-center space-x-2">
                              <LoadingSpinner />
                              <span>Processing...</span>
                            </div>
                          ) : plan.id === "free" ? (
                            "Contact Support to Downgrade"
                          ) : (
                            `Upgrade to ${plan.name}`
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-800/20 rounded-xl border border-slate-700/50">
                <ShieldCheckIcon className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">
                  Secure Payments
                </h4>
                <p className="text-slate-400 text-sm">
                  All payments processed securely through Stripe
                </p>
              </div>
              <div className="text-center p-6 bg-slate-800/20 rounded-xl border border-slate-700/50">
                <DocumentTextIcon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">
                  No Hidden Fees
                </h4>
                <p className="text-slate-400 text-sm">
                  What you see is what you pay. Cancel anytime.
                </p>
              </div>
              <div className="text-center p-6 bg-slate-800/20 rounded-xl border border-slate-700/50">
                <ClockIcon className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">
                  Instant Activation
                </h4>
                <p className="text-slate-400 text-sm">
                  Upgrades take effect immediately after payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
