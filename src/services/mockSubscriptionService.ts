import { UserSubscription, UsageStats } from "../types/subscription";
import { SUBSCRIPTION_PLANS } from "./stripeService";

const MOCK_SUBSCRIPTION_KEY = "mock_subscription";
const MOCK_USAGE_KEY = "mock_usage";

export const mockSubscriptionService = {
  // Get mock subscription for a user
  getSubscription: (userId: string): UserSubscription | null => {
    try {
      const stored = localStorage.getItem(`${MOCK_SUBSCRIPTION_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // Set mock subscription
  setSubscription: (userId: string, planId: string): UserSubscription => {
    const subscription: UserSubscription = {
      id: `mock_sub_${Date.now()}`,
      userId,
      planId,
      stripeCustomerId: `mock_cus_${userId}`,
      stripeSubscriptionId: `mock_sub_${userId}`,
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStorage.setItem(
      `${MOCK_SUBSCRIPTION_KEY}_${userId}`,
      JSON.stringify(subscription),
    );
    return subscription;
  },

  // Get mock usage for current month
  getUsage: (userId: string): UsageStats => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    try {
      const stored = localStorage.getItem(
        `${MOCK_USAGE_KEY}_${userId}_${currentMonth}`,
      );
      return stored
        ? JSON.parse(stored)
        : {
            userId,
            month: currentMonth,
            generations: 0,
            lastUpdated: new Date(),
          };
    } catch {
      return {
        userId,
        month: currentMonth,
        generations: 0,
        lastUpdated: new Date(),
      };
    }
  },

  // Increment usage
  incrementUsage: (userId: string): UsageStats => {
    const currentUsage = mockSubscriptionService.getUsage(userId);
    const newUsage = {
      ...currentUsage,
      generations: currentUsage.generations + 1,
      lastUpdated: new Date(),
    };

    const currentMonth = new Date().toISOString().slice(0, 7);
    localStorage.setItem(
      `${MOCK_USAGE_KEY}_${userId}_${currentMonth}`,
      JSON.stringify(newUsage),
    );
    return newUsage;
  },

  // Simulate upgrade
  simulateUpgrade: (userId: string, planId: string): void => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) {
      throw new Error("Plan not found");
    }

    // Create mock subscription
    mockSubscriptionService.setSubscription(userId, planId);

    // Show success message
    alert(
      `🎉 Mock Upgrade Successful!\n\nYou've been upgraded to the ${plan.name} plan.\n\nFeatures unlocked:\n${plan.features
        .slice(0, 3)
        .map((f) => `• ${f}`)
        .join(
          "\n",
        )}\n\nThis is a mock upgrade for development. In production, this would process real payments via Stripe.`,
    );

    // Trigger a page reload to refresh the subscription context
    window.location.reload();
  },

  // Reset subscription to free
  resetToFree: (userId: string): void => {
    localStorage.removeItem(`${MOCK_SUBSCRIPTION_KEY}_${userId}`);

    // Reset usage but keep some for testing
    const currentMonth = new Date().toISOString().slice(0, 7);
    const testUsage = {
      userId,
      month: currentMonth,
      generations: 5, // Add some usage for testing limits
      lastUpdated: new Date(),
    };
    localStorage.setItem(
      `${MOCK_USAGE_KEY}_${userId}_${currentMonth}`,
      JSON.stringify(testUsage),
    );

    alert(
      "🔄 Reset to Free Plan\n\nSubscription reset to free tier with 5 generations used for testing.\n\nReload the page to see changes.",
    );
  },

  // Clear all mock data
  clearAllData: (userId: string): void => {
    Object.keys(localStorage).forEach((key) => {
      if (
        key.includes(userId) &&
        (key.includes(MOCK_SUBSCRIPTION_KEY) || key.includes(MOCK_USAGE_KEY))
      ) {
        localStorage.removeItem(key);
      }
    });
    alert(
      "🗑️ All mock subscription data cleared.\n\nReload the page to see changes.",
    );
  },
};
