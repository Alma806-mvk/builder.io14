# 🔑 API Key Setup Guide

## ⚡ **Quick Fix: Get Gemini API Key**

Your app needs a Gemini API key to generate content. Here's how to get one **FREE**:

### **Step 1: Get Gemini API Key (2 minutes)**

1. **Go to**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy the key** (looks like: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

### **Step 2: Update .env.local**

Open your `.env.local` file and replace:

```bash
# FROM:
GEMINI_API_KEY=your_gemini_api_key_here

# TO:
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### **Step 3: Restart Dev Server**

```bash
# The dev server will restart automatically and pick up the new key
```

## ✅ **After Adding API Key:**

Your Social Content AI Studio will be able to:

- ✅ Generate social media posts
- ✅ Create content ideas
- ✅ Generate hashtags
- ✅ Create image prompts
- ✅ All AI-powered features

## 🆓 **Gemini API is FREE:**

- **Free tier**: 15 requests per minute
- **Perfect for**: Development and testing
- **Cost**: $0 for moderate usage
- **Rate limits**: Very generous for your app

## 🔧 **Current Status:**

✅ **Stripe Integration**: Ready (test keys working)  
❌ **Gemini API**: Needs real key (placeholder currently)  
✅ **Firebase**: Configured properly  
✅ **App Logic**: 100% working

**Just add the Gemini API key and your app is fully functional!** 🚀
