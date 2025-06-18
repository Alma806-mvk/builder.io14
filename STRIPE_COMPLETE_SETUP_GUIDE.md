# 🎯 Complete Stripe Checkout Setup Guide

## 📋 Step-by-Step Setup

Since you already have the code structure in place, follow these steps to enable real Stripe checkout:

### 1. Get Your Stripe Keys

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/
2. **Get Publishable Key**:
   - Navigate to "Developers" → "API keys"
   - Copy the "Publishable key" (starts with `pk_test_`)
3. **Get Secret Key**:
   - Copy the "Secret key" (starts with `sk_test_`)

### 2. Update Your Environment Variables

Replace the placeholder values in `.env.local`:

```bash
# Replace these with your actual Stripe keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY
```

### 3. Create Products and Prices in Stripe Dashboard

1. **Go to**: Products → Create product

2. **Create Pro Plan**:

   - Name: "Pro Plan"
   - Price: $19/month
   - Copy the Price ID (starts with `price_`)

3. **Create Business Plan**:
   - Name: "Business Plan"
   - Price: $49/month
   - Copy the Price ID

### 4. Update Price IDs in Code

Update the `stripePriceId` values in `src/services/stripeService.ts`:

```typescript
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  // ... free plan stays the same
  {
    id: "pro",
    name: "Pro",
    // ... other fields
    stripePriceId: "price_YOUR_ACTUAL_PRO_PRICE_ID", // Replace this
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    // ... other fields
    stripePriceId: "price_YOUR_ACTUAL_BUSINESS_PRICE_ID", // Replace this
  },
];
```

### 5. Deploy Firebase Functions

Your functions are already coded! Deploy them:

```bash
# Navigate to functions directory
cd functions

# Install dependencies (if not done)
npm install

# Build and deploy
npm run build
firebase deploy --only functions
```

### 6. Set Environment Variables for Firebase Functions

```bash
# Set Stripe secret key for your functions
firebase functions:config:set stripe.secret_key="sk_test_YOUR_SECRET_KEY"

# Redeploy functions to pick up the config
firebase deploy --only functions
```

### 7. Set Up Webhooks (Important!)

1. **Go to**: Stripe Dashboard → Developers → Webhooks
2. **Add endpoint**: `https://your-project-id.cloudfunctions.net/stripeWebhook`
3. **Select events**:

   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

4. **Copy webhook secret** and add to your functions config:

```bash
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SECRET"
firebase deploy --only functions
```

### 8. Test the Integration

1. **Start your app**: The checkout should now use real Stripe
2. **Use test card**: `4242 4242 4242 4242` (Visa)
3. **Check Stripe Dashboard**: Verify payments appear

## 🔧 Quick Testing Checklist

- [ ] Stripe keys added to `.env.local`
- [ ] Price IDs updated in `stripeService.ts`
- [ ] Firebase Functions deployed
- [ ] Webhook endpoint configured
- [ ] Test payment works
- [ ] Subscription shows in Stripe Dashboard
- [ ] User gets upgraded in your app

## 🚨 Important Notes

1. **Use Test Mode**: Keep everything in test mode until ready for production
2. **Webhook Security**: The webhook secret is crucial for security
3. **Error Handling**: Your code already handles errors gracefully
4. **Customer Portal**: Already implemented for subscription management

## 🎉 What Happens After Setup

Once configured, your users will:

1. Click "Upgrade" on your billing page
2. Get redirected to real Stripe Checkout
3. Complete payment securely on Stripe
4. Get redirected back to your app
5. Automatically have their subscription updated via webhook

Your mock checkout will automatically be bypassed once Firebase Functions are properly deployed and configured!

## 🆘 Need Help?

If you encounter issues:

1. Check Firebase Functions logs: `firebase functions:log`
2. Check Stripe Dashboard for webhook delivery status
3. Verify environment variables are set correctly
4. Ensure all Firebase Functions are deployed successfully

The code architecture is already production-ready - you just need to connect the Stripe credentials! 🚀
