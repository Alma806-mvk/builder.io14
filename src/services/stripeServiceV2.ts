import { loadStripe, Stripe } from "@stripe/stripe-js";
import { SubscriptionPlan, SUBSCRIPTION_PLANS } from "./stripeService";

// Load Stripe outside component render to avoid recreating on every render
// This follows Stripe's official recommendation
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_...",
);

export { stripePromise };

// Stripe Checkout approach (what I implemented - redirect method)
export const createCheckoutSession = async (
  priceId: string,
  userId: string,
  mode: "payment" | "subscription" = "subscription",
) => {
  try {
    // In production, this would call your Firebase Function
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_id: priceId,
        user_id: userId,
        mode,
        success_url: `${window.location.origin}/billing?success=true`,
        cancel_url: `${window.location.origin}/billing?canceled=true`,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const { checkout_session_id } = await response.json();

    const stripe = await stripePromise;
    if (!stripe) throw new Error("Stripe failed to load");

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkout_session_id,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
};

// Alternative: Embedded Checkout approach (following new React docs)
export const createEmbeddedCheckout = async (
  priceId: string,
  userId: string,
) => {
  try {
    // This would call your Firebase Function to create a checkout session
    // with mode: 'embedded'
    const response = await fetch("/api/create-embedded-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_id: priceId,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const { client_secret } = await response.json();
    return client_secret;
  } catch (error) {
    console.error("Error creating embedded checkout session:", error);
    throw error;
  }
};

// Customer Portal (this part I got right)
export const redirectToCustomerPortal = async (customerId: string) => {
  try {
    const response = await fetch("/api/create-portal-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: customerId,
        return_url: `${window.location.origin}/billing`,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw error;
  }
};

// Utility functions
export const getPlanByPriceId = (
  priceId: string,
): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find((plan) => plan.stripePriceId === priceId);
};

export const formatPrice = (
  amount: number,
  currency: string = "usd",
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
};
