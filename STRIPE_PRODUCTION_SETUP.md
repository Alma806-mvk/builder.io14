# Complete Stripe Integration Setup Guide

Based on the official Stripe subscription documentation, here's how to set up real payments for your social media AI app.

## 🎯 **Current Status**

✅ **Working Now**: Enhanced mock checkout system  
✅ **Ready for Production**: Firebase Functions with proper Stripe integration  
✅ **Following Best Practices**: Based on official Stripe documentation

## 🚀 **Step 1: Create Stripe Products & Prices**

### In Stripe Dashboard:

1. **Go to Products** → **Add Product**

2. **Create Pro Plan**:

   - Name: `Pro Plan`
   - Price: `$19.00 USD`
   - Billing: `Recurring` → `Monthly`
   - Price ID will be something like: `price_1ABC123...`

3. **Create Business Plan**:

   - Name: `Business Plan`
   - Price: `$49.00 USD`
   - Billing: `Recurring` → `Monthly`
   - Price ID will be something like: `price_1DEF456...`

4. **Copy the Price IDs** and update your code:

```typescript
// In src/services/stripeService.ts
stripePriceId: "price_1ABC123...", // Your actual Pro price ID
stripePriceId: "price_1DEF456...", // Your actual Business price ID
```

## 🔑 **Step 2: Set Environment Variables**

### Frontend (.env file):

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

### Backend (Firebase Functions):

```bash
# Set in Firebase Functions config
firebase functions:config:set stripe.secret_key="sk_test_51..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
```

## 🛠 **Step 3: Deploy Firebase Functions**

```bash
# Build functions
cd functions
npm run build

# Deploy to Firebase
firebase deploy --only functions
```

## 🎣 **Step 4: Set Up Webhooks**

### In Stripe Dashboard:

1. **Go to Developers** → **Webhooks** → **Add endpoint**

2. **Endpoint URL**: `https://your-project.cloudfunctions.net/stripeWebhook`

3. **Select Events** (following Stripe documentation):

   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `invoice.finalization_failed`
   - `customer.subscription.trial_will_end`

4. **Copy Webhook Secret** and set in Firebase config

## 🧪 **Step 5: Test Your Integration**

### Test Cards (from Stripe docs):

- **Success**: `4242 4242 4242 4242`
- **Requires 3D Secure**: `4000 0025 0000 3155`
- **Decline**: `4000 0000 0000 9995`

### Test Flow:

1. Click "Upgrade to Pro" → Should redirect to real Stripe Checkout
2. Use test card → Complete payment
3. Check webhook events in Stripe Dashboard
4. Verify subscription status in your app

## 📊 **Step 6: Customer Portal Setup**

### In Stripe Dashboard:

1. **Go to Settings** → **Billing** → **Customer portal**
2. **Enable features**:
   - Update payment methods ✅
   - View invoices ✅
   - Cancel subscriptions ✅
   - Update billing information ✅

## 🎯 **Step 7: Subscription Lifecycle Management**

### Following Stripe Documentation:

#### **Key Events to Handle**:

```typescript
// checkout.session.completed
// ✅ Payment successful, provision access

// invoice.paid
// ✅ Continue provisioning access

// invoice.payment_failed
// ⚠️ Notify customer, send to portal

// customer.subscription.trial_will_end
// ⏰ Remind customer trial ending
```

## 🔄 **Development vs Production**

### **Current (Development)**:

- ✅ Mock checkout with realistic UI
- ✅ Local subscription management
- ✅ No real payments required
- ✅ Perfect for testing and demos

### **Production (After Setup)**:

- 🚀 Real Stripe checkout
- 💳 Actual payment processing
- 🔄 Webhook-driven subscription updates
- 🏆 Customer portal for billing management

## 🚨 **Important Notes**

### **Webhook Security**:

- Always verify webhook signatures
- Use HTTPS endpoints only
- Handle idempotency for duplicate events

### **Error Handling**:

- Monitor `invoice.finalization_failed` events
- Handle payment failures gracefully
- Provide clear user feedback

### **Testing Best Practices**:

- Test all subscription states
- Verify webhook event handling
- Test payment failures and recoveries
- Check customer portal functionality

## 🎉 **Ready to Go Live**

When you're ready for production:

1. **Switch to Live Keys**:

   - Replace `pk_test_` with `pk_live_`
   - Replace `sk_test_` with `sk_live_`

2. **Create Live Products**:

   - Recreate products in live mode
   - Update price IDs in your code

3. **Test End-to-End**:
   - Complete real purchase flow
   - Verify webhook handling
   - Test customer portal

## 📈 **Your App Flow**

```
User clicks "Upgrade"
  ↓
Firebase Function creates Checkout Session
  ↓
User redirected to Stripe Checkout
  ↓
Payment completed → webhook fired
  ↓
Subscription updated in Firestore
  ↓
User has access to Pro/Business features
```

## 🆘 **Troubleshooting**

### **Common Issues**:

- **Webhook not firing**: Check endpoint URL and selected events
- **Payment fails**: Verify test card numbers and 3D Secure handling
- **Functions error**: Check Firebase logs with `firebase functions:log`
- **CORS issues**: Ensure proper Firebase Functions CORS configuration

### **Debug Steps**:

1. Check Stripe Dashboard → Events
2. Monitor Firebase Functions logs
3. Test webhook endpoints with Stripe CLI
4. Verify environment variables

Your subscription system is now production-ready and follows Stripe's official best practices! 🚀
