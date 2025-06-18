import * as functions from "firebase-functions";
import Stripe from "stripe";
import * as admin from "firebase-admin";

// Initialize Stripe with your secret key from environment
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error("❌ STRIPE_SECRET_KEY environment variable is not set!");
  throw new Error("Stripe secret key is required");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-05-28.basil",
});

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Create checkout session - Following Stripe documentation exactly
export const createCheckoutSession = functions.https.onCall(
  async (data: any, context: any) => {
    try {
      const { priceId, userId, successUrl, cancelUrl } = data;

      if (!priceId || !userId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Missing required parameters",
        );
      }

      // Check if user has existing customer
      const userDoc = await db.collection("users").doc(userId).get();
      let customerId = userDoc.data()?.stripeCustomerId;

      // Create customer if doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          metadata: { firebaseUID: userId },
        });
        customerId = customer.id;

        // Save customer ID to user document
        await db
          .collection("users")
          .doc(userId)
          .set({ stripeCustomerId: customerId }, { merge: true });
      }

      // Create checkout session following Stripe documentation
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId, // Use existing price ID from Stripe Dashboard
            quantity: 1,
          },
        ],
        mode: "subscription", // For recurring payments
        success_url:
          successUrl ||
          `${context.rawRequest?.headers.origin || "http://localhost:5173"}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:
          cancelUrl ||
          `${context.rawRequest?.headers.origin || "http://localhost:5173"}/billing?canceled=true`,
        metadata: {
          userId,
          priceId, // Store for webhook processing
        },
        // Enable customer portal link on success page
        allow_promotion_codes: true,
        billing_address_collection: "auto",
      });

      return {
        sessionId: session.id,
        url: session.url, // Return both for flexibility
      };
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      throw new functions.https.HttpsError(
        "internal",
        `Failed to create checkout session: ${error.message}`,
      );
    }
  },
);

// Create customer portal session
export const createPortalSession = functions.https.onCall(
  async (data: any, context: any) => {
    try {
      const { customerId, returnUrl } = data;

      if (!customerId) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Missing customer ID",
        );
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url:
          returnUrl ||
          `${context.rawRequest?.headers.origin || "http://localhost:5173"}/billing`,
      });

      return { url: session.url };
    } catch (error: any) {
      console.error("Error creating portal session:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to create portal session",
      );
    }
  },
);

// Stripe webhook handler - Following Stripe documentation
export const stripeWebhook = functions.https.onRequest(
  async (req: any, res: any) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      res.status(400).send("Missing signature or webhook secret");
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      res.status(400).send("Webhook signature verification failed");
      return;
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          break;

        case "customer.subscription.created":
        case "customer.subscription.updated":
          await handleSubscriptionUpdate(
            event.data.object as Stripe.Subscription,
          );
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          break;

        case "invoice.paid":
          await handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;

        case "invoice.payment_failed":
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case "invoice.finalization_failed":
          await handleInvoiceFinalizationFailed(
            event.data.object as Stripe.Invoice,
          );
          break;

        case "customer.subscription.trial_will_end":
          await handleTrialWillEnd(event.data.object as Stripe.Subscription);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.status(200).send("Webhook handled successfully");
    } catch (error) {
      console.error("Error handling webhook:", error);
      res.status(500).send("Error handling webhook");
    }
  },
);

// Helper functions following Stripe documentation

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  console.log("Checkout session completed:", session.id);

  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("No userId in session metadata");
    return;
  }

  // Update user with customer ID if not already set
  if (session.customer) {
    await db.collection("users").doc(userId).set(
      {
        stripeCustomerId: session.customer,
      },
      { merge: true },
    );
  }

  // If this is a subscription, the subscription.created event will handle the rest
  console.log("✅ Checkout session processed successfully");
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);

  if (!customer || (customer as any).deleted) {
    console.error("Customer not found");
    return;
  }

  const firebaseUID = (customer as Stripe.Customer).metadata?.firebaseUID;
  if (!firebaseUID) {
    console.error("Firebase UID not found in customer metadata");
    return;
  }

  // Get price information to determine plan
  const priceId = subscription.items.data[0]?.price.id;
  let planId = "free";

  // Map Stripe price IDs to your plan IDs
  switch (priceId) {
    case "price_pro_monthly_19":
      planId = "pro";
      break;
    case "price_business_monthly_49":
      planId = "business";
      break;
    default:
      console.warn(`Unknown price ID: ${priceId}`);
  }

  const subscriptionData = {
    userId: firebaseUID,
    planId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodStart: new Date(
      (subscription as any).current_period_start * 1000,
    ),
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    updatedAt: new Date(),
  };

  // Check if subscription document exists
  const subscriptionRef = db.collection("subscriptions").doc(firebaseUID);
  const existingDoc = await subscriptionRef.get();

  if (existingDoc.exists) {
    await subscriptionRef.update(subscriptionData);
  } else {
    await subscriptionRef.set({
      ...subscriptionData,
      createdAt: new Date(),
    });
  }

  console.log(
    `✅ Subscription updated for user ${firebaseUID}: ${planId} (${subscription.status})`,
  );
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);

  if (!customer || (customer as any).deleted) return;

  const firebaseUID = (customer as Stripe.Customer).metadata?.firebaseUID;
  if (!firebaseUID) return;

  // Update subscription status to canceled and reset to free plan
  await db.collection("subscriptions").doc(firebaseUID).update({
    status: "canceled",
    planId: "free", // Reset to free plan
    updatedAt: new Date(),
  });

  console.log(`✅ Subscription canceled for user ${firebaseUID}`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log("✅ Invoice paid successfully:", invoice.id);

  // Continue to provision the subscription as payments continue to be made
  if ((invoice as any).subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      (invoice as any).subscription as string,
    );
    await handleSubscriptionUpdate(subscription);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("❌ Invoice payment failed:", invoice.id);

  // The payment failed or the customer does not have a valid payment method.
  // The subscription becomes past_due. Notify your customer and send them to the
  // customer portal to update their payment information.

  if (invoice.customer) {
    const customer = await stripe.customers.retrieve(
      invoice.customer as string,
    );
    const firebaseUID = (customer as Stripe.Customer).metadata?.firebaseUID;

    if (firebaseUID) {
      // Update subscription status
      await db.collection("subscriptions").doc(firebaseUID).update({
        status: "past_due",
        updatedAt: new Date(),
      });

      // TODO: Send email notification to user about payment failure
      console.log(`⚠️ Payment failed for user ${firebaseUID}`);
    }
  }
}

async function handleInvoiceFinalizationFailed(invoice: Stripe.Invoice) {
  console.error(
    "❌ Invoice finalization failed:",
    invoice.id,
    invoice.last_finalization_error,
  );

  // Handle invoice finalization failures
  // Check if it's due to missing customer location for tax calculation
  if (invoice.automatic_tax?.status === "requires_location_inputs") {
    console.error(
      "Invoice finalization failed: Missing customer location for tax calculation",
    );
    // TODO: Notify customer to update their location information
  }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  console.log("⏰ Trial will end soon for subscription:", subscription.id);

  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const firebaseUID = (customer as Stripe.Customer).metadata?.firebaseUID;

  if (firebaseUID) {
    // TODO: Send email notification about trial ending
    console.log(`⏰ Trial ending soon for user ${firebaseUID}`);
  }
}
