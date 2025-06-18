# Firebase Setup Instructions

## 🔥 Deploy Firestore Rules

To fix the permission errors, you need to deploy the updated Firestore security rules:

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize your project (if not already done)

```bash
firebase init
# Select: Firestore, Functions
# Choose your existing project: final-c054b
```

### 4. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 5. Deploy Firebase Functions (for Stripe)

```bash
firebase deploy --only functions
```

## 📋 What the Rules Allow

The updated `firestore.rules` allow authenticated users to:

- ✅ Read/write their own subscription data (`/subscriptions/{userId}`)
- ✅ Read/write their own usage data (`/usage/{userId_YYYY-MM}`)
- ✅ Read/write their own user profile (`/users/{userId}`)
- ❌ Access other users' data (denied)

## 🔧 Environment Variables

Make sure these are set in your `.env.local`:

```bash
# Firebase (already configured)
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=final-c054b

# Stripe (add these)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Functions environment (deploy separately)
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
```

## 🚀 Development Mode (Mock System)

**The app now works out-of-the-box with a mock subscription system!**

### Features Available in Development:

1. ✅ **Mock Payment Flow**: Test subscription upgrades without real payments
2. ✅ **Local Storage**: Subscription data stored in browser for testing
3. ✅ **Usage Tracking**: Generate content and hit usage limits
4. ✅ **Billing Management**: Mock customer portal with reset options

### How to Test:

1. **Sign up/Sign in** → Gets free plan (10 generations/month)
2. **Generate content** → Watch usage counter increase
3. **Hit limit** → See paywall with upgrade options
4. **Click upgrade** → Mock Stripe checkout (click OK to simulate payment)
5. **Access billing** → User menu → "Billing & Usage" for management

### Mock Controls:

- **Upgrade**: Choose any plan, gets simulated instantly
- **Billing Portal**: Reset to free, clear data, or cancel
- **Usage**: Automatically tracked in localStorage
- **Limits**: Enforced just like production

## 🔥 Production Deployment

After deploying rules, the app should:

1. ✅ Load without Firestore permission errors
2. ✅ Show default free plan for new users
3. ✅ Track usage in Firestore when accessible
4. ✅ Sync data when permissions are working

## 🛠️ Troubleshooting

If you still see permission errors:

1. **Check Firebase Console**: Go to Firestore → Rules and verify the rules are deployed
2. **Check Authentication**: Make sure the user is properly signed in
3. **Check Project ID**: Verify `firebase.ts` has the correct project ID
4. **Clear Cache**: Clear browser cache and restart the app

The app now gracefully handles missing Firestore data and provides default values for new users! 🎉
