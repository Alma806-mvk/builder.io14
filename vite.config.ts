// vite.config.ts
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      // Keep your Gemini key definition
      "process.env.GEMINI_API_KEY": JSON.stringify(
        env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY,
      ),

      // Add Firebase config variables from your .env.local
      "process.env.FIREBASE_API_KEY": JSON.stringify(
        env.VITE_FIREBASE_API_KEY || env.FIREBASE_API_KEY,
      ),
      "process.env.FIREBASE_AUTH_DOMAIN": JSON.stringify(
        env.VITE_FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN,
      ),
      "process.env.FIREBASE_PROJECT_ID": JSON.stringify(
        env.VITE_FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID,
      ),
      "process.env.FIREBASE_STORAGE_BUCKET": JSON.stringify(
        env.VITE_FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET,
      ),
      "process.env.FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(
        env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
          env.FIREBASE_MESSAGING_SENDER_ID,
      ),
      "process.env.FIREBASE_APP_ID": JSON.stringify(
        env.VITE_FIREBASE_APP_ID || env.FIREBASE_APP_ID,
      ),
      "process.env.FIREBASE_MEASUREMENT_ID": JSON.stringify(
        env.VITE_FIREBASE_MEASUREMENT_ID || env.FIREBASE_MEASUREMENT_ID,
      ),

      // Add RECAPTCHA_SITE_KEY later when you set up App Check
      "process.env.RECAPTCHA_SITE_KEY": JSON.stringify(
        env.VITE_RECAPTCHA_SITE_KEY || env.RECAPTCHA_SITE_KEY,
      ),

      // Add Stripe configuration
      "process.env.STRIPE_PUBLISHABLE_KEY": JSON.stringify(
        env.STRIPE_PUBLISHABLE_KEY,
      ),
    },
    // Also expose as VITE_ prefixed variables for import.meta.env
    envPrefix: ["VITE_", "FIREBASE_", "GEMINI_", "STRIPE_", "RECAPTCHA_"],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
