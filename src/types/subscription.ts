export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  limits: {
    generations: number; // per month
    canvas: boolean;
    analytics: boolean;
    customPersonas: boolean;
    batchGeneration: boolean;
    apiAccess: boolean;
  };
  stripePriceId: string;
  popular?: boolean;
}

export interface UserSubscription {
  id?: string;
  userId: string;
  planId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: "active" | "canceled" | "past_due" | "unpaid" | "trialing";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageStats {
  userId: string;
  month: string; // YYYY-MM format
  generations: number;
  lastUpdated: Date;
}

export interface PaywallConfig {
  enabled: boolean;
  message: string;
  allowedFeatures: string[];
}

export type SubscriptionStatus = "free" | "active" | "expired" | "canceled";

export interface BillingInfo {
  subscription?: UserSubscription;
  usage: UsageStats;
  status: SubscriptionStatus;
  daysLeft?: number;
}
