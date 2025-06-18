import React, { useState, useEffect } from "react";
import { auth } from "./config/firebase";
import { signOut } from "firebase/auth";
import { App as MainApp } from "../App";
import Auth from "./components/Auth";
import {
  UserCircleIcon,
  ChevronDownIcon,
  CreditCardIcon,
  LaptopIcon,
  SparklesIcon,
  ColumnsIcon,
  SearchCircleIcon,
  PlayCircleIcon,
  PhotoIcon,
  CompassIcon,
  CalendarDaysIcon,
  TrendingUpIcon,
  ListChecksIcon,
  GlobeAltIcon,
} from "./components/IconComponents";
import LoadingSpinner from "./components/LoadingSpinner";
import {
  SubscriptionProvider,
  useSubscription,
} from "./context/SubscriptionContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import BillingPage from "./components/BillingPage";
import AccountPage from "./components/AccountPage";
import OnboardingSurvey from "./components/OnboardingSurvey";

import {
  HeroSection,
  TestimonialsSection,
  PricingPreview,
} from "./components/LandingPageComponents";

import "./components/Auth.css";

// Global error handler for Builder.io environment
if (
  typeof window !== "undefined" &&
  window.location.hostname.includes("builder.codes")
) {
  // Suppress fetch errors that are expected in Builder.io environment
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const message = args[0]?.toString() || "";
    if (
      message.includes("Failed to fetch") ||
      message.includes("NetworkError") ||
      message.includes("CORS")
    ) {
      // Convert to warning for expected network errors
      console.warn(
        "🟡 Expected network restriction in Builder.io environment:",
        ...args,
      );
      return;
    }
    originalConsoleError(...args);
  };

  // Handle unhandled promise rejections from Firebase
  window.addEventListener("unhandledrejection", (event) => {
    const error = event.reason;
    if (
      error?.message?.includes("Failed to fetch") ||
      error?.message?.includes("NetworkError")
    ) {
      console.warn(
        "🟡 Handled Firebase network error in Builder.io environment:",
        error.message,
      );
      event.preventDefault(); // Prevent the error from being logged as unhandled
    }
  });
}

function AppContent() {
  const { user, loading, needsOnboarding, completeOnboarding } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState<"app" | "billing" | "account">(
    "app",
  );
  const [forceLoaded, setForceLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { billingInfo } = useSubscription();

  // Scroll detection for header change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tab menu configuration for scrolled header
  const mainTabs = [
    {
      id: "generator",
      label: "Generator",
      icon: <SparklesIcon className="h-4 w-4" />,
    },
    {
      id: "canvas",
      label: "Canvas",
      icon: <ColumnsIcon className="h-4 w-4" />,
    },
    {
      id: "channelAnalysis",
      label: "YT Analysis",
      icon: <SearchCircleIcon className="h-4 w-4" />,
    },
    {
      id: "youtubeStats",
      label: "YT Stats",
      icon: <PlayCircleIcon className="h-4 w-4" />,
    },
    {
      id: "thumbnailMaker",
      label: "Thumbnails",
      icon: <PhotoIcon className="h-4 w-4" />,
    },
    {
      id: "strategy",
      label: "Strategy",
      icon: <CompassIcon className="h-4 w-4" />,
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: <CalendarDaysIcon className="h-4 w-4" />,
    },
    {
      id: "trends",
      label: "Trends",
      icon: <TrendingUpIcon className="h-4 w-4" />,
    },
    {
      id: "history",
      label: "History",
      icon: <ListChecksIcon className="h-4 w-4" />,
    },
    {
      id: "search",
      label: "Web Search",
      icon: <GlobeAltIcon className="h-4 w-4" />,
    },
  ];

  // Fallback: Force loading to complete after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log(
        "AppContent: Force loading timeout - bypassing loading state",
      );
      setForceLoaded(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSignInClick = () => {
    setShowAuth(true);
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  if (loading && !forceLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-slate-400 mt-4">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (user && needsOnboarding) {
    return <OnboardingSurvey onComplete={completeOnboarding} />;
  }

  if (!user && !showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black">
        {/* Header with Sign In button */}
        <header className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fd24fc98344b34135a3d7a6c5ab404264%2F974186563556499e8c2efb8ec9044c37?format=webp&width=800"
                  alt="CreateGen Studio Logo"
                  className="w-8 h-8 rounded-lg flex-shrink-0"
                />
                <div className="text-lg font-medium tracking-tight text-white">
                  <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                    CreateGen
                  </span>
                  <span className="text-slate-300 ml-1">Studio</span>
                </div>
              </div>

              <button
                onClick={handleSignInClick}
                className="px-4 py-2 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <UserCircleIcon className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </header>

        {/* Enhanced Landing Page */}
        <HeroSection onSignInClick={handleSignInClick} />
        <TestimonialsSection />
        <PricingPreview onSignInClick={handleSignInClick} />
      </div>
    );
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="relative">
            <button
              onClick={handleCloseAuth}
              className="absolute -top-4 -right-4 z-10 w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>
            <Auth onAuthSuccess={handleCloseAuth} />
          </div>
        </div>
      </div>
    );
  }

  // Main authenticated app
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black relative">
      {/* User menu button - positioned in bottom left */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-slate-700/80 via-slate-600/80 to-slate-700/80 hover:from-slate-600 hover:via-slate-500 hover:to-slate-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-600/50 hover:border-slate-500/70 backdrop-blur-sm"
        >
          <div className="relative h-6 w-6 text-slate-300">👤</div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-white">
              {user.displayName || user.email?.split("@")[0] || "User"}
            </span>
            <span className="text-xs text-slate-400">
              {billingInfo?.isSubscribed ? "Pro" : "Free"}
            </span>
          </div>
        </button>
      </div>

      {/* User menu overlay - simple approach */}
      {showUserMenu && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 99999 }}
          onMouseDown={(e) => {
            // Only close if clicking the overlay, not the menu
            if (e.target === e.currentTarget) {
              setShowUserMenu(false);
            }
          }}
        >
          {/* User menu */}
          <div
            className="absolute bottom-20 left-4 w-56 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl"
            style={{ pointerEvents: "auto" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <UserCircleIcon className="h-10 w-10 text-slate-300" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full ring-2 ring-slate-800 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${billingInfo?.isSubscribed ? "bg-gradient-to-r from-sky-500/20 to-purple-500/20 text-sky-400 border border-sky-400/30" : "bg-slate-700/50 text-slate-400 border border-slate-600/50"}`}
                    >
                      {billingInfo?.isSubscribed
                        ? "Pro Account"
                        : "Free Account"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2" style={{ pointerEvents: "auto" }}>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Account clicked!");
                  setCurrentPage("account");
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg flex items-center space-x-3 cursor-pointer border-none bg-transparent"
                style={{ pointerEvents: "auto" }}
              >
                <UserCircleIcon className="h-4 w-4" />
                <span>Account Settings</span>
              </button>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Billing clicked!");
                  setCurrentPage("billing");
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg flex items-center space-x-3 cursor-pointer border-none bg-transparent"
                style={{ pointerEvents: "auto" }}
              >
                <CreditCardIcon className="h-4 w-4" />
                <span>Billing & Usage</span>
              </button>
              <div className="border-t border-slate-700/50 my-2"></div>
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Sign out clicked!");
                  handleSignOut();
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm text-slate-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg flex items-center space-x-3 cursor-pointer border-none bg-transparent"
                style={{ pointerEvents: "auto" }}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main app content */}
      {currentPage === "billing" ? (
        <div>
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => setCurrentPage("app")}
              className="text-sky-400 hover:text-sky-300 transition-colors flex items-center space-x-2 mb-4"
            >
              <span>←</span>
              <span>Back to App</span>
            </button>
          </div>
          <BillingPage />
        </div>
      ) : currentPage === "account" ? (
        <div>
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => setCurrentPage("app")}
              className="text-sky-400 hover:text-sky-300 transition-colors flex items-center space-x-2 mb-4"
            >
              <span>←</span>
              <span>Back to App</span>
            </button>
          </div>
          <AccountPage onNavigateToBilling={() => setCurrentPage("billing")} />
        </div>
      ) : (
        <MainApp />
      )}

      {/* Developer Tools - Only visible in development */}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppContent />
      </SubscriptionProvider>
    </AuthProvider>
  );
}
