import React from "react";
import { useSubscription } from "../context/SubscriptionContext";
import {
  SUBSCRIPTION_PLANS,
  createCheckoutSession,
} from "../services/stripeService";
import { SparklesIcon, StarIcon, CheckCircleIcon } from "./IconComponents";
import { auth } from "../config/firebase";

interface PaywallProps {
  feature?: string;
  className?: string;
}

const Paywall: React.FC<PaywallProps> = ({ feature, className = "" }) => {
  const { billingInfo } = useSubscription();
  const user = auth.currentUser;

  const handleUpgrade = async (planId: string) => {
    if (!user) return;

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan || !plan.stripePriceId) return;

    try {
      await createCheckoutSession(plan.stripePriceId, user.uid);
    } catch (error) {
      console.error("Error upgrading:", error);
      alert("Error starting upgrade process. Please try again.");
    }
  };

  const getUpgradeMessage = () => {
    if (feature === "generations") {
      return {
        title: "Generation Limit Reached",
        description:
          "You've used all your AI generations for this month. Upgrade to continue creating amazing content!",
        icon: <SparklesIcon className="h-8 w-8 text-yellow-400" />,
      };
    }

    if (feature === "canvas") {
      return {
        title: "Visual Canvas - Pro Feature",
        description:
          "Create stunning visual content with our advanced canvas tools. Available with Pro and Business plans.",
        icon: <StarIcon className="h-8 w-8 text-purple-400" />,
      };
    }

    return {
      title: "Premium Feature",
      description:
        "This feature is available with our paid plans. Upgrade to unlock powerful AI tools!",
      icon: <SparklesIcon className="h-8 w-8 text-sky-400" />,
    };
  };

  const { title, description, icon } = getUpgradeMessage();

  return (
    <div
      className={`bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 text-center ${className}`}
    >
      <div className="flex justify-center mb-4">{icon}</div>

      <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">{description}</p>

      {billingInfo && (
        <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-300">
            Current Plan:{" "}
            <span className="font-semibold text-white">
              {
                SUBSCRIPTION_PLANS.find(
                  (p) => p.id === (billingInfo.subscription?.planId || "free"),
                )?.name
              }
            </span>
          </p>
          {feature === "generations" && (
            <p className="text-sm text-slate-400 mt-1">
              Used: {billingInfo.usage.generations} /{" "}
              {SUBSCRIPTION_PLANS.find(
                (p) => p.id === (billingInfo.subscription?.planId || "free"),
              )?.limits.generations || 0}{" "}
              generations this month
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {SUBSCRIPTION_PLANS.filter((plan) => plan.id !== "free").map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-slate-700/30 border rounded-lg p-6 text-left ${
              plan.popular
                ? "border-sky-500 ring-2 ring-sky-500/20"
                : "border-slate-600"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-sky-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">
                  ${plan.price}
                </span>
                <span className="text-slate-400 text-sm">/{plan.interval}</span>
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

            <ul className="space-y-2 mb-6">
              {plan.features.slice(0, 4).map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-slate-300"
                >
                  <CheckCircleIcon className="h-4 w-4 text-green-400 mr-2 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.id)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                plan.popular
                  ? "bg-sky-600 hover:bg-sky-500 text-white"
                  : "bg-slate-600 hover:bg-slate-500 text-white"
              }`}
            >
              Upgrade to {plan.name}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-6">
        Cancel anytime. 30-day money-back guarantee.
      </p>
    </div>
  );
};

export default Paywall;
