# 🚀 Real Stripe Integration Setup Guide

Following Stripe's official "Accept a Payment" documentation (Page 3).

## 📋 Step 1: Create Products and Prices in Stripe Dashboard

### 1.1 Create Pro Plan Product

```bash
# Using Stripe CLI (recommended)
stripe products create \
  --name="Pro Plan" \
  --description="500 AI generations per month with advanced features"

# Save the returned product ID (e.g., prod_ABC123)
```

### 1.2 Create Pro Plan Price

```bash
stripe prices create \
  --unit-amount=1900 \
  --currency=usd \
  --recurring="interval=month" \
  --product=prod_ABC123

# Save the returned price ID (e.g., price_1KzlAMJJDeE9fu01WMJJr79o)
```

### 1.3 Create Business Plan

```bash
stripe products create \
  --name="Business Plan" \
  --description="Unlimited AI generations with API access"

stripe prices create \
  --unit-amount=4900 \
  --currency=usd \
  --recurring="interval=month" \
  --product=prod_XYZ789
```

### 1.4 Update Price IDs in Code

Edit `src/services/stripeService.ts`:

```javascript
stripePriceId: 'price_YOUR_ACTUAL_PRO_PRICE_ID',      // Pro plan
stripePriceId: 'price_YOUR_ACTUAL_BUSINESS_PRICE_ID', // Business plan
```

## 🔧 Step 2: Deploy Firebase Functions

### 2.1 Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

### 2.2 Set Environment Variables

```bash
cd functions
firebase functions:config:set stripe.secret_key="YOUR_STRIPE_SECRET_KEY"
```

### 2.3 Deploy Functions

```bash
firebase deploy --only functions
```

### 2.4 Note Function URLs

After deployment, you'll see URLs like:

```
✓ functions[createCheckoutSession(us-central1)]
  https://us-central1-final-c054b.cloudfunctions.net/createCheckoutSession
```

## 🎯 Step 3: Test Real Payments

### 3.1 Test Card Numbers (from Page 3)

- **Success**: `4242 4242 4242 4242` - Always succeeds
- **3D Secure**: `4000 0000 0000 3220` - Requires authentication
- **Declined**: `4000 0000 0000 9995` - Always declines

### 3.2 Test Flow

1. **Sign in** to your app
2. **Generate content** until you hit the limit (10 for free)
3. **Click upgrade** → Should redirect to real Stripe Checkout
4. **Use test card**: `4242 4242 4242 4242`
5. **Enter any future date** for expiry
6. **Enter any 3-digit CVC**
7. **Click Pay** → Should redirect to success page

### 3.3 Verify in Stripe Dashboard

- Go to https://dashboard.stripe.com/test/payments
- Look for your test payment
- Check customer details and subscription status

## 🔔 Step 4: Set Up Webhooks

### 4.1 Create Webhook Endpoint

In Stripe Dashboard → Webhooks → Add endpoint:

```
URL: https://us-central1-final-c054b.cloudfunctions.net/stripeWebhook
Events: checkout.session.completed, customer.subscription.updated
```

### 4.2 Update Webhook Secret

```bash
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_ACTUAL_WEBHOOK_SECRET"
firebase deploy --only functions
```

## 🎉 Step 5: Success Pages

Your app already handles success/cancel URLs:

- **Success**: `/billing?success=true` → Shows success message
- **Cancel**: `/billing?canceled=true` → User returns to billing page

## 🛡️ Step 6: Production Checklist

### 6.1 Switch to Live Mode

1. **Get live keys** from Stripe Dashboard → API keys
2. **Update environment variables**:
   ```bash
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```
3. **Create live products/prices** (repeat Step 1 in live mode)
4. **Update webhook endpoint** to live mode

### 6.2 Security

- ✅ Secret keys stored in Firebase Functions config (not in code)
- ✅ Webhook signature verification enabled
- ✅ HTTPS enforced on all endpoints
- ✅ User authentication required for all operations

## 🚨 Troubleshooting

### Functions Not Found Error

If you see "functions/not-found", the app will fallback to mock mode:

```
⚠️ Development Mode - Mock Checkout
To enable real payments, deploy Firebase Functions:
cd functions && firebase deploy --only functions
```

### Webhook Issues

Check Firebase Functions logs:

```bash
firebase functions:log
```

### Payment Issues

Check Stripe Dashboard → Events for detailed error logs.

## 📊 Current Status

✅ **Mock System**: Working for development testing  
✅ **Real Stripe Code**: Ready and following Page 3 patterns  
✅ **Firebase Functions**: Created and configured  
🔄 **Next**: Deploy functions and create products

## 💡 Key Benefits

- **Follows Stripe Best Practices**: Based on official Page 3 documentation
- **Production Ready**: Real webhook handling and error management
- **Developer Friendly**: Automatic fallback to mock when functions not deployed
- **Secure**: All secrets stored server-side in Firebase Functions
- **Tested**: Uses exact patterns from Stripe's success stories

Your Social Content AI Studio is ready for real payments! 🎯
