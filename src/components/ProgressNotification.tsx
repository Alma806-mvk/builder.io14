import React, { useState, useEffect } from "react";
import { ClockIcon, CheckCircleIcon, SparklesIcon } from "./IconComponents";

export interface ProgressStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
  timestamp?: Date;
}

interface ProgressNotificationProps {
  isVisible: boolean;
  steps: ProgressStep[];
  onClose?: () => void;
  currentStep?: string;
  allowContinueWork?: boolean;
}

const GENERATION_STEPS: ProgressStep[] = [
  {
    id: "analyzing",
    title: "Analyzing Input",
    description: "Understanding your content requirements...",
    completed: false,
    active: false,
  },
  {
    id: "structuring",
    title: "Building Structure",
    description: "Creating the content framework...",
    completed: false,
    active: false,
  },
  {
    id: "generating",
    title: "Generating Content",
    description: "Crafting your content with AI...",
    completed: false,
    active: false,
  },
  {
    id: "refining",
    title: "Refining Output",
    description: "Polishing and optimizing the result...",
    completed: false,
    active: false,
  },
  {
    id: "finalizing",
    title: "Finalizing",
    description: "Preparing your content for delivery...",
    completed: false,
    active: false,
  },
];

export const ProgressNotification: React.FC<ProgressNotificationProps> = ({
  isVisible,
  steps = GENERATION_STEPS,
  onClose,
  currentStep,
  allowContinueWork = true,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const completedCount = steps.filter((step) => step.completed).length;
  const progressPercentage = (completedCount / steps.length) * 100;
  const currentActiveStep = steps.find((step) => step.active);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed ${minimized ? "bottom-4 right-4" : "bottom-4 right-4"} z-50 transition-all duration-300`}
    >
      {minimized ? (
        // Minimized view
        <div
          onClick={() => setMinimized(false)}
          className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-xl p-4 shadow-2xl cursor-pointer hover:bg-slate-700/95 transition-colors max-w-xs"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentActiveStep?.title || "Generating..."}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Expanded view
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-xl shadow-2xl max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-sky-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Generating Content
                </h3>
                <p className="text-sm text-slate-400">
                  {completedCount} of {steps.length} steps completed •{" "}
                  {formatTime(elapsedTime)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMinimized(true)}
                className="p-1 hover:bg-slate-700 rounded-md transition-colors"
                title="Minimize"
              >
                <span className="text-slate-400 hover:text-white">−</span>
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-slate-700 rounded-md transition-colors"
                  title="Cancel"
                >
                  <span className="text-slate-400 hover:text-white">×</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex-1 bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-sm text-slate-300 font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            {currentActiveStep && (
              <p className="text-sm text-sky-400 font-medium">
                {currentActiveStep.description}
              </p>
            )}
          </div>

          {/* Steps List */}
          <div className="p-4 space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {step.completed ? (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-3 h-3 text-white" />
                    </div>
                  ) : step.active ? (
                    <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-slate-400">
                        {index + 1}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      step.completed
                        ? "text-green-400"
                        : step.active
                          ? "text-sky-400"
                          : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {step.description}
                  </p>
                  {step.timestamp && (
                    <div className="flex items-center space-x-1 mt-1">
                      <ClockIcon className="w-3 h-3 text-slate-500" />
                      <span className="text-xs text-slate-500">
                        {step.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Message */}
          {allowContinueWork && (
            <div className="px-4 py-3 border-t border-slate-700 bg-slate-700/30">
              <p className="text-xs text-slate-400 text-center">
                💡 You can continue working on other tasks while this generates
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressNotification;

// Hook for managing generation progress
export const useGenerationProgress = () => {
  const [steps, setSteps] = useState<ProgressStep[]>(
    GENERATION_STEPS.map((step) => ({ ...step })),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);

  const startGeneration = () => {
    setIsGenerating(true);
    setSteps(
      GENERATION_STEPS.map((step) => ({
        ...step,
        completed: false,
        active: false,
        timestamp: undefined,
      })),
    );

    // Start with first step
    setTimeout(() => {
      updateStep("analyzing", { active: true });
    }, 100);
  };

  const updateStep = (stepId: string, updates: Partial<ProgressStep>) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
              ...step,
              ...updates,
              timestamp: updates.completed ? new Date() : step.timestamp,
            }
          : step,
      ),
    );

    if (updates.active) {
      setCurrentStepId(stepId);
    }
  };

  const completeStep = (stepId: string) => {
    updateStep(stepId, { completed: true, active: false });

    // Move to next step
    const currentIndex = GENERATION_STEPS.findIndex((s) => s.id === stepId);
    const nextStep = GENERATION_STEPS[currentIndex + 1];

    if (nextStep) {
      setTimeout(() => {
        updateStep(nextStep.id, { active: true });
      }, 300);
    } else {
      // All steps completed
      setTimeout(() => {
        setIsGenerating(false);
        setCurrentStepId(null);
      }, 1000);
    }
  };

  const finishGeneration = () => {
    setIsGenerating(false);
    setCurrentStepId(null);
    setSteps((prev) =>
      prev.map((step) => ({
        ...step,
        completed: true,
        active: false,
      })),
    );
  };

  return {
    steps,
    isGenerating,
    currentStepId,
    startGeneration,
    updateStep,
    completeStep,
    finishGeneration,
  };
};
