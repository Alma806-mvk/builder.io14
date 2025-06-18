import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import {
  CheckCircleIcon,
  UserCircleIcon,
  ChartBarIcon,
  StarIcon,
  SparklesIcon,
} from "./IconComponents";
import "./Auth.css";

interface OnboardingSurveyProps {
  onComplete: () => void;
}

const OnboardingSurvey: React.FC<OnboardingSurveyProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyData, setSurveyData] = useState({
    howHeardAboutUs: "",
    howHeardOther: "",
    profession: "",
    company: "",
    companySize: "",
    primaryUseCase: "",
    experienceLevel: "",
    goals: [] as string[],
  });

  const howHeardOptions = [
    { value: "google", label: "Google Search" },
    { value: "social_media", label: "Social Media (Twitter, LinkedIn, etc.)" },
    { value: "friend_colleague", label: "Friend or Colleague" },
    { value: "blog_article", label: "Blog or Article" },
    { value: "youtube", label: "YouTube" },
    { value: "podcast", label: "Podcast" },
    { value: "conference", label: "Conference or Event" },
    { value: "advertising", label: "Online Advertising" },
    { value: "other", label: "Other" },
  ];

  const professionOptions = [
    "Content Creator",
    "Social Media Manager",
    "Marketing Manager",
    "Digital Marketer",
    "Entrepreneur",
    "Small Business Owner",
    "Freelancer",
    "Agency Owner",
    "Student",
    "Other",
  ];

  const companySizeOptions = [
    "Just me",
    "2-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-1000 employees",
    "1000+ employees",
  ];

  const useCaseOptions = [
    "Social media content creation",
    "Blog post writing",
    "Marketing copy",
    "Email campaigns",
    "Video scripts",
    "Ad copy",
    "Content planning",
    "Other",
  ];

  const experienceLevelOptions = [
    "Complete beginner",
    "Some experience",
    "Intermediate",
    "Advanced",
    "Expert",
  ];

  const goalOptions = [
    "Save time on content creation",
    "Improve content quality",
    "Increase engagement",
    "Grow my audience",
    "Generate more leads",
    "Better content planning",
    "Learn AI tools",
    "Scale content production",
  ];

  const handleInputChange = (field: string, value: string) => {
    setSurveyData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goal: string) => {
    setSurveyData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Save survey data to user profile
      await setDoc(
        doc(db, "users", user.uid),
        {
          onboardingSurvey: {
            ...surveyData,
            completedAt: new Date(),
          },
          onboardingCompleted: true,
        },
        { merge: true },
      );

      onComplete();
    } catch (error) {
      console.error("Error saving survey data:", error);
      // Continue anyway - don't block user
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 =
    surveyData.howHeardAboutUs &&
    (surveyData.howHeardAboutUs !== "other" || surveyData.howHeardOther);

  const canProceedStep2 =
    surveyData.profession &&
    surveyData.companySize &&
    surveyData.primaryUseCase;

  const canSubmit = surveyData.experienceLevel && surveyData.goals.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-black flex items-center justify-center p-4">
      <div className="auth-container max-w-2xl w-full">
        {/* Enhanced Header with Welcome Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-sm font-medium mb-4">
            <SparklesIcon className="h-4 w-4 mr-2" />
            Welcome to Social Content AI Studio
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Let's get you started! 🚀
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Just a few quick questions to personalize your experience and help
            us serve you better.
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-white">
                Step {currentStep} of 3
              </span>
              <span className="text-xs text-slate-400">
                ({Math.round((currentStep / 3) * 100)}% Complete)
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Takes less than 2 minutes ⏱️
            </div>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-3 shadow-inner">
            <div
              className="h-3 bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: How did you hear about us */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500/10 border border-sky-500/20 rounded-full mb-4">
                <UserCircleIcon className="h-8 w-8 text-sky-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                How did you discover us? 🔍
              </h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Understanding your journey helps us improve and reach more
                awesome people like you!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-5">
                  Please select the option that best describes how you found
                  Social Content AI Studio: *
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {howHeardOptions.map((option, index) => (
                    <label
                      key={option.value}
                      className={`
                        group flex items-center space-x-4 p-4
                        bg-slate-800/50 hover:bg-slate-700/50
                        border border-slate-600/50 hover:border-sky-500/50
                        rounded-xl cursor-pointer transition-all duration-200
                        ${
                          surveyData.howHeardAboutUs === option.value
                            ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10"
                            : ""
                        }
                        animate-slide-up
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <input
                        type="radio"
                        name="howHeardAboutUs"
                        value={option.value}
                        checked={surveyData.howHeardAboutUs === option.value}
                        onChange={(e) =>
                          handleInputChange("howHeardAboutUs", e.target.value)
                        }
                        className="w-4 h-4 text-sky-500 focus:ring-sky-500 focus:ring-2 focus:ring-offset-0 border-slate-400"
                      />
                      <span
                        className={`
                        text-slate-300 font-medium transition-colors
                        ${
                          surveyData.howHeardAboutUs === option.value
                            ? "text-white"
                            : "group-hover:text-white"
                        }
                      `}
                      >
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {surveyData.howHeardAboutUs === "other" && (
                <div className="animate-fade-in mt-6">
                  <label className="block text-sm font-medium text-white mb-3">
                    Please tell us more: ✍️
                  </label>
                  <input
                    type="text"
                    value={surveyData.howHeardOther}
                    onChange={(e) =>
                      handleInputChange("howHeardOther", e.target.value)
                    }
                    placeholder="e.g., Recommended by a friend, saw it on Reddit, etc..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end mt-10">
              <button
                onClick={handleNext}
                disabled={!canProceedStep1}
                className={`
                  px-8 py-3 font-medium rounded-xl transition-all duration-200
                  ${
                    canProceedStep1
                      ? "bg-gradient-to-r from-emerald-600 via-sky-600 to-purple-600 hover:from-emerald-500 hover:via-sky-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "bg-slate-600 cursor-not-allowed text-slate-400"
                  }
                `}
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Work & Company Info */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500/10 border border-sky-500/20 rounded-full mb-4">
                <ChartBarIcon className="h-8 w-8 text-sky-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Tell us about your work 💼
              </h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Help us tailor content suggestions and features specifically for
                your role and industry.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  What's your profession? *
                </label>
                <select
                  value={surveyData.profession}
                  onChange={(e) =>
                    handleInputChange("profession", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Select your profession</option>
                  {professionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Company/Organization (optional)
                </label>
                <input
                  type="text"
                  value={surveyData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Enter your company name"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Company size *
                </label>
                <select
                  value={surveyData.companySize}
                  onChange={(e) =>
                    handleInputChange("companySize", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Select company size</option>
                  {companySizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Primary use case *
                </label>
                <select
                  value={surveyData.primaryUseCase}
                  onChange={(e) =>
                    handleInputChange("primaryUseCase", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">
                    What will you primarily use this for?
                  </option>
                  {useCaseOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceedStep2}
                className="px-6 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Goals & Experience */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500/10 border border-sky-500/20 rounded-full mb-4">
                <StarIcon className="h-8 w-8 text-sky-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Almost done! 🎯
              </h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Final step! Tell us about your goals so we can help you achieve
                them faster.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Experience with AI content tools *
                </label>
                <select
                  value={surveyData.experienceLevel}
                  onChange={(e) =>
                    handleInputChange("experienceLevel", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Select your experience level</option>
                  {experienceLevelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  What are your main goals? (Select all that apply) *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {goalOptions.map((goal) => (
                    <label
                      key={goal}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={surveyData.goals.includes(goal)}
                        onChange={() => handleGoalToggle(goal)}
                        className="text-sky-500 focus:ring-sky-500"
                      />
                      <span className="text-slate-300 text-sm">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="px-6 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Complete Setup</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Skip Option */}
        <div className="text-center mt-8 pt-6 border-t border-slate-700/50">
          <button
            onClick={onComplete}
            className="text-slate-400 hover:text-slate-300 text-sm transition-colors hover:underline"
          >
            Skip this setup (you can always do this later in settings)
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSurvey;
