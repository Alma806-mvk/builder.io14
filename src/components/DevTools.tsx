import React, { useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";
import { mockSubscriptionService } from "../services/mockSubscriptionService";
import { SUBSCRIPTION_PLANS } from "../services/stripeService";
import { auth } from "../config/firebase";
import { SlidersHorizontalIcon } from "./IconComponents";

const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { billingInfo, refreshBilling } = useSubscription();
  const user = auth.currentUser;

  if (!user || process.env.NODE_ENV === "production") {
    return null; // Hide in production
  }

  const handlePlanChange = (planId: string) => {
    if (planId === "free") {
      mockSubscriptionService.resetToFree(user.uid);
    } else {
      mockSubscriptionService.simulateUpgrade(user.uid, planId);
    }
  };

  const handleUsageChange = (amount: number) => {
    if (!billingInfo) return;

    const currentUsage = mockSubscriptionService.getUsage(user.uid);
    const newGenerations = Math.max(0, currentUsage.generations + amount);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const newUsage = {
      ...currentUsage,
      generations: newGenerations,
      lastUpdated: new Date(),
    };

    localStorage.setItem(
      `mock_usage_${user.uid}_${currentMonth}`,
      JSON.stringify(newUsage),
    );
    refreshBilling();
  };

  const currentPlan = billingInfo?.subscription?.planId || "free";

  return (
    <div className="fixed bottom-20 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-full shadow-lg transition-colors"
        title="Developer Tools"
      >
        <SlidersHorizontalIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute bottom-12 left-0 bg-slate-800 border border-purple-500 rounded-lg p-4 min-w-80 shadow-xl">
          <h3 className="text-purple-400 font-semibold mb-3 text-sm">
            🛠️ Dev Tools
          </h3>

          {/* Current Status */}
          <div className="mb-4 p-2 bg-slate-700/50 rounded text-xs">
            <div className="text-slate-300">
              <strong>Plan:</strong>{" "}
              {SUBSCRIPTION_PLANS.find((p) => p.id === currentPlan)?.name}
            </div>
            <div className="text-slate-300">
              <strong>Usage:</strong> {billingInfo?.usage.generations || 0}
            </div>
          </div>

          {/* Plan Switcher */}
          <div className="mb-3">
            <label className="block text-xs text-slate-400 mb-1">
              Switch Plan:
            </label>
            <select
              value={currentPlan}
              onChange={(e) => handlePlanChange(e.target.value)}
              className="w-full p-1 bg-slate-700 border border-slate-600 rounded text-xs text-white"
            >
              {SUBSCRIPTION_PLANS.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} {plan.price > 0 && `($${plan.price}/mo)`}
                </option>
              ))}
            </select>
          </div>

          {/* Usage Controls */}
          <div className="mb-3">
            <label className="block text-xs text-slate-400 mb-1">
              Adjust Usage:
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => handleUsageChange(-5)}
                className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded"
              >
                -5
              </button>
              <button
                onClick={() => handleUsageChange(-1)}
                className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded"
              >
                -1
              </button>
              <button
                onClick={() => handleUsageChange(1)}
                className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded"
              >
                +1
              </button>
              <button
                onClick={() => handleUsageChange(5)}
                className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded"
              >
                +5
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1">
            <button
              onClick={() => {
                handleUsageChange(10);
                alert("Set usage to near limit for testing paywall!");
              }}
              className="w-full px-2 py-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs rounded"
            >
              🚨 Trigger Paywall
            </button>
            <button
              onClick={() => {
                mockSubscriptionService.clearAllData(user.uid);
                window.location.reload();
              }}
              className="w-full px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded"
            >
              🗑️ Reset All Data
            </button>
          </div>

          <div className="text-xs text-slate-500 mt-2 text-center">
            Development Mode Only
          </div>
        </div>
      )}
    </div>
  );
};

export default DevTools;
