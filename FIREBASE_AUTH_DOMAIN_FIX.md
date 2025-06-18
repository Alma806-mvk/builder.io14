# Firebase Authentication Domain Fix

## The "Unknown SID" Error

This error typically occurs when your local development domain is not authorized in the Firebase Console.

## Steps to Fix:

### 1. Go to Firebase Console

- Visit: https://console.firebase.google.com/
- Select your project: `final-c054b`

### 2. Navigate to Authentication Settings

- Click on "Authentication" in the left sidebar
- Click on the "Settings" tab
- Look for "Authorized domains"

### 3. Add Localhost Domains

Add these domains to your authorized domains list:

```
localhost
127.0.0.1
```

### 4. For Development (if needed)

You may also need to add:

```
localhost:5173
127.0.0.1:5173
```

### 5. Save Changes

- Click "Save" or "Add domain" for each entry
- Wait a few minutes for changes to propagate

## Alternative Solution

If the above doesn't work, you may need to:

1. **Check Google OAuth Configuration**:

   - Go to Google Cloud Console
   - Navigate to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 client ID
   - Add `http://localhost:5173` to authorized origins

2. **Verify Firebase Project Settings**:
   - Ensure the Firebase project ID matches: `final-c054b`
   - Verify the API key is correct
   - Check that authentication providers are enabled

## Quick Test

After making these changes, try:

1. Refresh your app at http://localhost:5173
2. Try signing in with Google
3. Check browser console for any remaining errors
