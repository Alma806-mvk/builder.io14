# 🚀 Firebase Functions Deployment Guide

## ✅ **Status: Functions Built Successfully**

Your Firebase Functions have been built without errors! Here's how to complete the deployment:

## 🔧 **Step 1: Set Environment Variables**

Run these commands in your terminal to set the Stripe configuration:

```bash
# Set your Stripe secret key (replace with your actual key)
firebase functions:config:set stripe.secret_key="sk_live_YOUR_ACTUAL_SECRET_KEY_HERE"

# Set webhook secret (you'll get this after setting up the webhook)
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SECRET_HERE"
```

## 🚀 **Step 2: Deploy Functions**

```bash
# Deploy the functions
firebase deploy --only functions
```

## 📋 **Step 3: Get Function URLs**

After deployment, you'll get URLs like:

```
✔ functions[us-central1-createCheckoutSession]:
  https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/createCheckoutSession

✔ functions[us-central1-createPortalSession]:
  https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/createPortalSession

✔ functions[us-central1-stripeWebhook]:
  https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/stripeWebhook
```

## 🔗 **Step 4: Configure Stripe Webhook**

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Use the webhook URL: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/stripeWebhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy the webhook signing secret
6. Run: `firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SECRET"`
7. Redeploy: `firebase deploy --only functions`

## 🧪 **Step 5: Test the Integration**

Once deployed, your app will automatically:

1. ✅ Stop using mock checkout
2. ✅ Redirect to real Stripe checkout
3. ✅ Process real payments
4. ✅ Handle subscription updates via webhooks

## 🔍 **Troubleshooting**

If you still get INTERNAL errors:

1. **Check function logs:**

   ```bash
   firebase functions:log
   ```

2. **Verify environment variables:**

   ```bash
   firebase functions:config:get
   ```

3. **Check function deployment status:**
   ```bash
   firebase functions:list
   ```

## ⚡ **Quick Fix for Current Error**

The INTERNAL error you're seeing is because:

1. ❌ Functions aren't deployed yet
2. ❌ Environment variables aren't set
3. ❌ Stripe secret key isn't configured

Once you complete the deployment steps above, the error will be resolved! 🎉

## 🎯 **What Happens After Deployment**

Your app will automatically switch from mock checkout to real Stripe checkout. Users will:

1. Click upgrade button
2. Get redirected to real Stripe checkout
3. Complete payment securely
4. Get redirected back to your app
5. Have their subscription automatically updated

The mock checkout is a fallback that only shows when Firebase Functions aren't deployed. 🚀
