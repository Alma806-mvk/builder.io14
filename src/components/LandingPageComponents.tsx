import React, { useState, useEffect } from "react";
import {
  SparklesIcon,
  TrendingUpIcon,
  PenToolIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  StarIcon,
  BrainIcon,
  LightBulbIcon,
  FilmIcon,
  HashtagIcon,
  ArrowUpRightIcon,
  UsersIcon,
  ShieldCheckIcon,
} from "./IconComponents";

interface HeroSectionProps {
  onSignInClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSignInClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating Elements */}
        <div className="absolute top-32 left-1/4 animate-float">
          <div className="w-3 h-3 bg-sky-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-48 right-1/3 animate-float-delayed">
          <div className="w-2 h-2 bg-indigo-400 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-32 left-1/2 animate-float-slow">
          <div className="w-4 h-4 bg-purple-400 rounded-full opacity-50"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          {/* Premium Trust Badge */}
          <div
            className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-sky-500/30 rounded-full text-sky-300 text-sm font-medium mb-8 shadow-lg backdrop-blur-sm transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <SparklesIcon className="h-5 w-5 mr-3 text-sky-400" />
            <span className="bg-gradient-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent font-semibold">
              Trusted by 50,000+ Content Creators Worldwide
            </span>
            <div className="ml-3 flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
              ))}
            </div>
          </div>

          {/* Premium Main Headline */}
          <h1
            className={`text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Create
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Viral Content
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              with AI
            </span>
          </h1>

          {/* Premium Subheadline */}
          <p
            className={`text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Transform your content strategy with the world's most advanced
            AI-powered
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent font-semibold">
              {" "}
              CreateGen Studio
            </span>
            . Generate engaging posts, analyze performance, and
            <span className="text-sky-400 font-semibold">
              {" "}
              save 20+ hours per week
            </span>
            .
          </p>

          {/* Premium Feature Cards */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 transition-all duration-1000 delay-600 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <PremiumFeatureCard
              icon={<BrainIcon className="h-8 w-8" />}
              title="AI Content Generation"
              description="Create unlimited posts, captions, and scripts for all major platforms with the support of AI"
              badge="500+ Templates"
              gradient="from-sky-400 to-indigo-600"
              delay={0}
            />
            <PremiumFeatureCard
              icon={<TrendingUpIcon className="h-8 w-8" />}
              title="Performance Analytics"
              description="Advanced insights and trend analysis to optimize your content strategy and maximize engagement"
              badge="Real-time Data"
              gradient="from-purple-400 to-indigo-600"
              delay={200}
            />
            <PremiumFeatureCard
              icon={<PenToolIcon className="h-8 w-8" />}
              title="Visual Design Studio"
              description="Professional-grade design tools and templates to create stunning visual content that converts"
              badge="Pro Tools"
              gradient="from-orange-400 to-pink-600"
              delay={400}
            />
          </div>

          {/* Premium Social Proof */}
          <PremiumSocialProof isVisible={isVisible} />

          {/* Premium CTA Section */}
          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-8 transition-all duration-1000 delay-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <button
              onClick={onSignInClick}
              className="group relative px-10 py-5 bg-gradient-to-r from-sky-600 to-purple-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <SparklesIcon className="h-6 w-6 animate-pulse" />
                Start Creating Free
                <ArrowUpRightIcon className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </button>
          </div>

          <div
            className={`space-y-3 transition-all duration-1000 delay-1200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-slate-400 font-medium">
              ✨ No credit card required • 🚀 Free 25 generations • 🔄 Upgrade
              anytime
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-sky-400" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-sky-400" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50 pointer-events-none"></div>
    </div>
  );
};

interface PremiumFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  gradient: string;
  delay: number;
}

const PremiumFeatureCard: React.FC<PremiumFeatureCardProps> = ({
  icon,
  title,
  description,
  badge,
  gradient,
  delay,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 transition-all duration-500 hover:scale-105 hover:border-slate-600/50 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Animated Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      ></div>

      {/* Floating Icon */}
      <div
        className={`relative w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${isHovered ? "scale-110 rotate-6" : ""}`}
      >
        <div className="text-white">{icon}</div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-200 group-hover:bg-clip-text transition-all duration-300">
          {title}
        </h3>
        <p className="text-slate-400 text-base mb-6 leading-relaxed group-hover:text-slate-300 transition-colors">
          {description}
        </p>

        {/* Premium Badge */}
        <div
          className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${gradient} bg-opacity-20 border border-current rounded-full text-sm font-semibold text-white`}
        >
          <div
            className={`w-2 h-2 bg-gradient-to-r ${gradient} rounded-full mr-3 animate-pulse`}
          ></div>
          <span className="text-white font-semibold">{badge}</span>
        </div>
      </div>

      {/* Hover Effect Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

interface PremiumSocialProofProps {
  isVisible: boolean;
}

const PremiumSocialProof: React.FC<PremiumSocialProofProps> = ({
  isVisible,
}) => {
  const stats = [
    {
      number: "50M+",
      label: "Content Generated",
      icon: <LightBulbIcon className="h-6 w-6" />,
    },
    {
      number: "100K+",
      label: "Happy Creators",
      icon: <UsersIcon className="h-6 w-6" />,
    },
    {
      number: "99.9%",
      label: "Uptime",
      icon: <ShieldCheckIcon className="h-6 w-6" />,
    },
    {
      number: "4.9★",
      label: "Average Rating",
      icon: <StarIcon className="h-6 w-6" />,
    },
  ];

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 transition-all duration-1000 delay-800 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group text-center p-6 rounded-2xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/30 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 hover:scale-105"
        >
          <div className="flex justify-center mb-3 text-sky-400 group-hover:text-sky-300 transition-colors">
            {stat.icon}
          </div>
          <div className="text-3xl md:text-4xl font-black text-white mb-2 bg-gradient-to-r from-white to-slate-200 bg-clip-text">
            {stat.number}
          </div>
          <div className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

interface TestimonialsProps {}

export const TestimonialsSection: React.FC<TestimonialsProps> = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "YouTube Creator",
      avatar: "👩‍💼",
      content:
        "This platform completely transformed my content strategy. I went from struggling with ideas to publishing viral content consistently. The AI understands my brand voice perfectly!",
      platform: "YouTube",
      metrics: "2.3M views",
      gradient: "from-red-500 to-pink-500",
    },
    {
      name: "Marcus Rodriguez",
      role: "Social Media Manager",
      avatar: "👨‍💻",
      content:
        "Managing 20+ client accounts used to be overwhelming. Now I create months of content in hours. The ROI for my agency has been incredible - 400% increase in productivity.",
      platform: "Instagram",
      metrics: "50K+ followers",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      name: "Emma Thompson",
      role: "Digital Marketer",
      avatar: "👩‍🚀",
      content:
        "The analytics insights helped me understand what content performs best. My engagement rate jumped from 2% to 8% in just 3 months. This tool pays for itself!",
      platform: "LinkedIn",
      metrics: "300% engagement",
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-24 relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-8">
            <UsersIcon className="h-5 w-5 mr-3" />
            Loved by creators worldwide
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Success Stories
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            See how content creators and marketers are achieving unprecedented
            results with our AI-powered platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 transition-all duration-500 hover:scale-105 hover:border-slate-600/50 overflow-hidden"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <div className="text-white font-bold text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-slate-400 font-medium">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 bg-gradient-to-r ${testimonial.gradient} bg-opacity-20 rounded-full`}
                >
                  <span
                    className={`text-xs font-semibold bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent`}
                  >
                    {testimonial.platform}
                  </span>
                </div>
              </div>

              {/* Content */}
              <blockquote className="relative z-10 text-slate-300 text-base leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </blockquote>

              {/* Metrics */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <div
                  className={`text-sm font-bold bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent`}
                >
                  {testimonial.metrics}
                </div>
              </div>

              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-6xl text-slate-700/20 font-serif">
                "
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface PricingPreviewProps {
  onSignInClick: () => void;
}

export const PricingPreview: React.FC<PricingPreviewProps> = ({
  onSignInClick,
}) => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals getting started",
      price: { monthly: 0, yearly: 0 },
      features: [
        "25 AI generations/month",
        "Basic templates library",
        "Community support",
        "Standard analytics",
      ],
      cta: "Get Started Free",
      popular: false,
      gradient: "from-slate-600 to-slate-700",
    },
    {
      name: "Creator",
      description: "Ideal for content creators and small teams",
      price: { monthly: 29, yearly: 290 },
      features: [
        "1,000 AI generations/month",
        "Advanced canvas tools",
        "Priority support",
        "Advanced analytics",
        "Brand voice training",
        "Content calendar",
      ],
      cta: "Start Creator Trial",
      popular: true,
      gradient: "from-sky-500 to-indigo-600",
    },
    {
      name: "Agency",
      description: "Built for agencies and large teams",
      price: { monthly: 99, yearly: 990 },
      features: [
        "Unlimited generations",
        "All premium features",
        "API access",
        "White-label options",
        "Dedicated success manager",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      popular: false,
      gradient: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-24 relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 border border-sky-500/30 rounded-full text-sky-300 text-sm font-medium mb-8">
            <SparklesIcon className="h-5 w-5 mr-3" />
            Simple, transparent pricing
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1 bg-slate-800/50 border border-slate-700 rounded-xl">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-gradient-to-r from-sky-500 to-purple-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
                billingPeriod === "yearly"
                  ? "bg-gradient-to-r from-sky-500 to-purple-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-2 py-1 bg-sky-500 text-white text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border p-8 transition-all duration-500 hover:scale-105 overflow-hidden ${
                plan.popular
                  ? "border-sky-500/50 ring-2 ring-sky-500/20"
                  : "border-slate-700/50 hover:border-slate-600/50"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6">
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-5xl font-black text-white">
                      $
                      {billingPeriod === "yearly"
                        ? Math.floor(plan.price.yearly / 12)
                        : plan.price.monthly}
                    </span>
                    <span className="text-slate-400 text-lg font-medium">
                      /{billingPeriod === "yearly" ? "mo" : "month"}
                    </span>
                    {billingPeriod === "yearly" && plan.price.yearly > 0 && (
                      <div className="text-sm text-sky-400 font-medium mt-1">
                        Billed yearly (${plan.price.yearly})
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={`${plan.id}-feature-${featureIndex}-${feature.slice(0, 10)}`}
                      className="flex items-center text-slate-300"
                    >
                      <CheckCircleIcon className="h-5 w-5 text-sky-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={onSignInClick}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-sky-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "border-2 border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800/50"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-16">
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-sky-400" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-sky-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span>99.9% uptime SLA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  HeroSection,
  TestimonialsSection,
  PricingPreview,
};
