import React, { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "../services/stripeServiceV2";
import { SubscriptionPlan } from "../types/subscription";
import LoadingSpinner from "./LoadingSpinner";

// This follows Stripe's official React documentation exactly

interface StripeCheckoutProps {
  plan: SubscriptionPlan;
  onSuccess: () => void;
  onCancel: () => void;
}

// Checkout form component that uses Stripe Elements
const CheckoutForm: React.FC<{
  plan: SubscriptionPlan;
  onSuccess: () => void;
}> = ({ plan, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL where the customer will be redirected after the payment
        return_url: `${window.location.origin}/billing?success=true`,
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsLoading(false);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
        <p className="text-2xl font-bold text-sky-400">
          ${plan.price}
          <span className="text-sm text-slate-400">/{plan.interval}</span>
        </p>
        <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
      </div>

      {/* Payment Element - This is Stripe's pre-built component */}
      <div className="payment-element-container">
        <PaymentElement
          options={{
            layout: "tabs",
            // Customize appearance to match your theme
            appearance: {
              theme: "night",
              variables: {
                colorPrimary: "#0ea5e9", // sky-500
                colorBackground: "#334155", // slate-700
                colorText: "#f1f5f9", // slate-100
                colorDanger: "#ef4444", // red-500
                fontFamily: "Inter, system-ui, sans-serif",
                borderRadius: "8px",
              },
            },
          }}
        />
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-800/50 border border-red-600 text-red-200 p-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <LoadingSpinner className="w-4 h-4" />
            <span>Processing...</span>
          </div>
        ) : (
          `Subscribe to ${plan.name}`
        )}
      </button>
    </form>
  );
};

// Main checkout component with Elements provider
const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  plan,
  onSuccess,
  onCancel,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch client secret when component mounts
  React.useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        // This would call your Firebase Function
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price_id: plan.stripePriceId,
            // other necessary data
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const { client_secret } = await response.json();
        setClientSecret(client_secret);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [plan]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <span className="ml-2 text-slate-400">Setting up payment...</span>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="text-center p-8">
        <div className="text-red-400 mb-4">
          {error || "Failed to load payment form"}
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Elements provider with client secret
  const elementsOptions = {
    clientSecret,
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#0ea5e9",
        colorBackground: "#334155",
        colorText: "#f1f5f9",
        colorDanger: "#ef4444",
        fontFamily: "Inter, system-ui, sans-serif",
        borderRadius: "8px",
      },
    },
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Complete Payment</h2>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-300 transition-colors"
        >
          ✕
        </button>
      </div>

      <Elements stripe={stripePromise} options={elementsOptions}>
        <CheckoutForm plan={plan} onSuccess={onSuccess} />
      </Elements>
    </div>
  );
};

export default StripeCheckout;
