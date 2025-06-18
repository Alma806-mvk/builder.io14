#!/bin/bash

echo "🚀 Deploying Social Content AI Studio to Production"
echo "================================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase (if not already logged in)
echo "🔐 Checking Firebase authentication..."
firebase login --no-localhost

# Set up environment variables for Functions
echo "⚙️ Setting up environment variables..."
cd functions

# Set Stripe configuration
firebase functions:config:set \
  stripe.secret_key="YOUR_STRIPE_SECRET_KEY" \
  stripe.webhook_secret="YOUR_WEBHOOK_SECRET"

# Deploy Firestore rules
echo "🔥 Deploying Firestore rules..."
cd ..
firebase deploy --only firestore:rules

# Deploy Functions
echo "⚡ Deploying Firebase Functions..."
firebase deploy --only functions

# Deploy hosting (if needed)
echo "🌐 Deploying hosting..."
firebase deploy --only hosting

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Create products in Stripe Dashboard (see STRIPE_SETUP_GUIDE.md)"
echo "2. Update price IDs in src/services/stripeService.ts"
echo "3. Set up webhook endpoint in Stripe Dashboard"
echo "4. Test with card: 4242 4242 4242 4242"
echo ""
echo "🎯 Your Social Content AI Studio is ready for real payments!"
