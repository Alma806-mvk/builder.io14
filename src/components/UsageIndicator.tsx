import React from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { getCurrentPlan } from "../services/stripeService";

const UsageIndicator: React.FC = () => {
  const { billingInfo, canGenerate } = useSubscription();

  if (!billingInfo) return null;

  const currentPlan = getCurrentPlan(billingInfo.subscription?.planId);
  const isUnlimited = currentPlan.limits.generations === -1;
  const usagePercentage = isUnlimited
    ? 0
    : (billingInfo.usage.generations / currentPlan.limits.generations) * 100;

  const getStatusColor = () => {
    if (isUnlimited) return "text-green-400";
    if (usagePercentage >= 100) return "text-red-400";
    if (usagePercentage >= 80) return "text-yellow-400";
    return "text-green-400";
  };

  const getBarColor = () => {
    if (isUnlimited) return "bg-green-500";
    if (usagePercentage >= 100) return "bg-red-500";
    if (usagePercentage >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-300">
          Monthly Usage ({currentPlan.name} Plan)
        </span>
        <span className={`text-sm font-semibold ${getStatusColor()}`}>
          {isUnlimited
            ? `${billingInfo.usage.generations} / ∞`
            : `${billingInfo.usage.generations} / ${currentPlan.limits.generations}`}
        </span>
      </div>

      {!isUnlimited && (
        <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all ${getBarColor()}`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
      )}

      {!canGenerate() && (
        <div className="text-xs text-red-400 mt-2">
          ⚠️ Monthly limit reached. Upgrade to continue generating content.
        </div>
      )}

      {canGenerate() && usagePercentage >= 80 && !isUnlimited && (
        <div className="text-xs text-yellow-400 mt-2">
          ⚠️ Approaching monthly limit. Consider upgrading your plan.
        </div>
      )}
    </div>
  );
};

export default UsageIndicator;
