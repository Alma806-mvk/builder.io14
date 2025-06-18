import React, { useState, useEffect } from "react";
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ChevronUpIcon,
  XCircleIcon,
} from "./IconComponents";

interface FloatingHelpProps {
  onHelpClick?: () => void;
}

export const FloatingHelp: React.FC<FloatingHelpProps> = ({ onHelpClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const helpItems = [
    { icon: "🚀", title: "Getting Started", description: "Learn the basics" },
    { icon: "💡", title: "Tips & Tricks", description: "Power user features" },
    { icon: "❓", title: "FAQ", description: "Common questions" },
    { icon: "💬", title: "Live Chat", description: "Talk to support" },
  ];

  return (
    <>
      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end gap-3">
          {/* Scroll to top */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="w-12 h-12 bg-slate-700 hover:bg-slate-600 text-white rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center"
              title="Scroll to top"
            >
              <ChevronUpIcon className="h-5 w-5" />
            </button>
          )}

          {/* Help Menu */}
          {isOpen && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-4 w-64 mb-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">Need Help?</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                {helpItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onHelpClick?.();
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <div className="text-white text-sm font-medium">
                          {item.title}
                        </div>
                        <div className="text-slate-400 text-xs">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Help Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500 hover:from-emerald-600 hover:via-sky-600 hover:to-purple-600 text-white rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center"
            title="Get Help"
          >
            {isOpen ? (
              <XCircleIcon className="h-6 w-6" />
            ) : (
              <QuestionMarkCircleIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-slate-800/90 backdrop-blur border border-slate-700 rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center gap-4">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-2">
                <div
                  className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all
                  ${
                    index < currentStep
                      ? "bg-green-500 text-white"
                      : index === currentStep
                        ? "bg-sky-500 text-white animate-pulse"
                        : "bg-slate-600 text-slate-400"
                  }
                `}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    index <= currentStep ? "text-white" : "text-slate-400"
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 transition-colors ${
                    index < currentStep ? "bg-green-500" : "bg-slate-600"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

interface NotificationToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  isVisible: boolean;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: "bg-green-500/10 border-green-500/20 text-green-400",
    error: "bg-red-500/10 border-red-500/20 text-red-400",
    info: "bg-sky-500/10 border-sky-500/20 text-sky-400",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  };

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right">
      <div
        className={`${typeStyles[type]} border backdrop-blur rounded-lg p-4 shadow-xl max-w-md`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icons[type]}</span>
          <div className="flex-1">
            <p className="font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <XCircleIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface FeatureSpotlightProps {
  title: string;
  description: string;
  targetElement?: string; // CSS selector
  isVisible: boolean;
  onClose: () => void;
  onNext?: () => void;
  step?: number;
  totalSteps?: number;
}

export const FeatureSpotlight: React.FC<FeatureSpotlightProps> = ({
  title,
  description,
  isVisible,
  onClose,
  onNext,
  step = 1,
  totalSteps = 1,
}) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Spotlight */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>

          <p className="text-slate-300 mb-6 leading-relaxed">{description}</p>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              {step} of {totalSteps}
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Skip
              </button>
              {onNext && (
                <button
                  onClick={onNext}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
                >
                  {step === totalSteps ? "Got it!" : "Next"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default {
  FloatingHelp,
  ProgressIndicator,
  NotificationToast,
  FeatureSpotlight,
};
