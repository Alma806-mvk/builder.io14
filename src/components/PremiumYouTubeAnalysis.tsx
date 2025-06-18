import React, { useState, useEffect } from "react";
import {
  PlayIcon,
  ChartBarIcon,
  TrendingUpIcon,
  UsersIcon,
  EyeIcon,
  StarIcon,
  ClockIcon,
  TagIcon,
  SearchIcon,
  SparklesIcon,
  ArrowRightIcon,
  DocumentDuplicateIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FireIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { ParsedChannelAnalysisSection } from "../../types";

interface PremiumYouTubeAnalysisProps {
  channelAnalysisInput: string;
  setChannelAnalysisInput: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  parsedChannelAnalysis: ParsedChannelAnalysisSection[] | null;
  channelAnalysisError: string | null;
  channelAnalysisSummary: string | null;
  isSummarizingChannelAnalysis: boolean;
  onSummarize: () => void;
  onCopyToClipboard: (text: string) => void;
  copied: boolean;
}

interface AnalysisMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
  icon: React.ComponentType<any>;
  color: string;
}

interface AnalysisTab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  count?: number;
}

export const PremiumYouTubeAnalysis: React.FC<PremiumYouTubeAnalysisProps> = ({
  channelAnalysisInput,
  setChannelAnalysisInput,
  onAnalyze,
  isAnalyzing,
  parsedChannelAnalysis,
  channelAnalysisError,
  channelAnalysisSummary,
  isSummarizingChannelAnalysis,
  onSummarize,
  onCopyToClipboard,
  copied,
}) => {
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("overview");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set(),
  );
  const [filterCategory, setFilterCategory] = useState("all");

  // Mock metrics for premium feel
  const analysisMetrics: AnalysisMetric[] = [
    {
      label: "Total Views",
      value: "2.4M",
      trend: "up",
      icon: EyeIcon,
      color: "text-blue-400",
    },
    {
      label: "Avg. Engagement",
      value: "8.7%",
      trend: "up",
      icon: TrendingUpIcon,
      color: "text-green-400",
    },
    {
      label: "Content Score",
      value: "94/100",
      trend: "up",
      icon: StarIcon,
      color: "text-yellow-400",
    },
    {
      label: "Upload Frequency",
      value: "3.2/week",
      trend: "neutral",
      icon: ClockIcon,
      color: "text-purple-400",
    },
  ];

  const analysisTabs: AnalysisTab[] = [
    { id: "overview", label: "Overview", icon: ChartBarIcon },
    {
      id: "content",
      label: "Content Analysis",
      icon: PlayIcon,
      count: parsedChannelAnalysis?.length || 0,
    },
    { id: "opportunities", label: "Opportunities", icon: LightBulbIcon },
    { id: "competitive", label: "Competitive Intel", icon: TrendingUpIcon },
    { id: "performance", label: "Performance", icon: FireIcon },
  ];

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const getChannelNames = () => {
    return channelAnalysisInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  };

  const renderAnalysisHeader = () => (
    <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            YouTube Intelligence Suite
          </h1>
          <p className="text-slate-400 mt-2">
            Unlock competitive insights and growth opportunities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
            PREMIUM
          </span>
          <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full border border-green-500/30">
            LIVE DATA
          </span>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-sm text-slate-300">
          <SearchIcon className="h-4 w-4 text-blue-400" />
          <span>Analyze up to 5 channels simultaneously</span>
        </div>

        <div className="relative">
          <textarea
            value={channelAnalysisInput}
            onChange={(e) => setChannelAnalysisInput(e.target.value)}
            placeholder="Enter YouTube channel names or URLs (e.g., MrBeast, @markiplier, https://youtube.com/@pewdiepie)"
            rows={3}
            className="w-full p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-100 placeholder-slate-400 backdrop-blur-sm transition-all duration-200"
          />
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <span className="text-xs text-slate-500">
              {getChannelNames().length}/5 channels
            </span>
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing || !channelAnalysisInput.trim()}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>{isAnalyzing ? "Analyzing..." : "Analyze Channels"}</span>
            </button>
          </div>
        </div>

        {getChannelNames().length > 0 && (
          <div className="flex flex-wrap gap-2">
            {getChannelNames().map((channel, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-700/50 text-slate-300 text-sm rounded-full border border-slate-600/50 flex items-center space-x-1"
              >
                <PlayIcon className="h-3 w-3 text-red-400" />
                <span>{channel}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {analysisMetrics.map((metric, index) => (
        <div
          key={index}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <metric.icon className={`h-8 w-8 ${metric.color}`} />
            <div className="flex items-center space-x-1">
              {metric.trend === "up" && (
                <TrendingUpIcon className="h-4 w-4 text-green-400" />
              )}
              {metric.trend === "down" && (
                <TrendingUpIcon className="h-4 w-4 text-red-400 transform rotate-180" />
              )}
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {metric.value}
          </div>
          <div className="text-sm text-slate-400">{metric.label}</div>
        </div>
      ))}
    </div>
  );

  const renderAnalysisTabs = () => (
    <div className="flex space-x-1 mb-8 bg-slate-800/30 rounded-xl p-1">
      {analysisTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveAnalysisTab(tab.id)}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex-1 justify-center ${
            activeAnalysisTab === tab.id
              ? "bg-blue-600 text-white shadow-lg"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
          }`}
        >
          <tab.icon className="h-4 w-4" />
          <span className="text-sm">{tab.label}</span>
          {tab.count !== undefined && tab.count > 0 && (
            <span className="bg-blue-500/30 text-blue-300 text-xs px-2 py-0.5 rounded-full">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  const renderContentAnalysis = () => {
    if (!parsedChannelAnalysis || parsedChannelAnalysis.length === 0) {
      return (
        <div className="text-center py-12">
          <ChartBarIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            No Analysis Available
          </h3>
          <p className="text-slate-500">
            Run an analysis to see detailed insights
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Summary Section */}
        {channelAnalysisSummary && (
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-300 flex items-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                AI Summary
              </h3>
              <button
                onClick={() => onCopyToClipboard(channelAnalysisSummary)}
                className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-sm rounded-lg border border-blue-500/30 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {channelAnalysisSummary}
            </p>
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            Detailed Analysis
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={onSummarize}
              disabled={isSummarizingChannelAnalysis}
              className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 rounded-lg text-sm transition-colors"
            >
              {isSummarizingChannelAnalysis
                ? "Generating..."
                : "Generate Summary"}
            </button>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="content">Content Strategy</option>
              <option value="performance">Performance</option>
              <option value="audience">Audience</option>
            </select>
          </div>
        </div>

        {/* Analysis Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {parsedChannelAnalysis.map((section, index) => (
            <div
              key={index}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3"></div>
                    {section.title}
                  </h4>
                  <button
                    onClick={() => toggleSection(index)}
                    className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {expandedSections.has(index) ? (
                      <ChevronUpIcon className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {expandedSections.has(index)
                    ? section.content
                    : section.content.substring(0, 200) +
                      (section.content.length > 200 ? "..." : "")}
                </p>

                {section.ideas &&
                  section.ideas.length > 0 &&
                  expandedSections.has(index) && (
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-green-300 flex items-center">
                        <LightBulbIcon className="h-4 w-4 mr-2" />
                        Actionable Ideas ({section.ideas.length})
                      </h5>
                      <div className="space-y-2">
                        {section.ideas.map((idea, ideaIndex) => (
                          <div
                            key={ideaIndex}
                            className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
                          >
                            <CheckCircleIcon className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-300 flex-1">
                              {idea}
                            </span>
                            <button className="px-2 py-1 bg-green-600/20 hover:bg-green-600/40 text-green-300 text-xs rounded border border-green-500/30 transition-colors">
                              Use
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <TagIcon className="h-3 w-3" />
                    <span>Analysis • {section.content.length} chars</span>
                  </div>
                  <button
                    onClick={() => onCopyToClipboard(section.content)}
                    className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOpportunities = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <LightBulbIcon className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Growth Opportunities
        </h3>
        <p className="text-slate-400">
          AI-powered recommendations based on your analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Trending Topics",
            desc: "Capitalize on viral trends in your niche",
            impact: "High",
            color: "red",
          },
          {
            title: "Content Gaps",
            desc: "Topics your competitors aren't covering",
            impact: "Medium",
            color: "yellow",
          },
          {
            title: "Format Innovation",
            desc: "New video formats to try",
            impact: "High",
            color: "green",
          },
          {
            title: "Collaboration Potential",
            desc: "Channels for potential partnerships",
            impact: "Medium",
            color: "blue",
          },
          {
            title: "Audience Expansion",
            desc: "Untapped audience segments",
            impact: "High",
            color: "purple",
          },
          {
            title: "SEO Optimization",
            desc: "Keywords with high opportunity",
            impact: "Medium",
            color: "orange",
          },
        ].map((opportunity, index) => (
          <div
            key={index}
            className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">{opportunity.title}</h4>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  opportunity.impact === "High"
                    ? "bg-red-500/20 text-red-300"
                    : opportunity.impact === "Medium"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-green-500/20 text-green-300"
                }`}
              >
                {opportunity.impact}
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4">{opportunity.desc}</p>
            <button className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-sm rounded-lg border border-blue-500/30 transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (channelAnalysisError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderAnalysisHeader()}
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-300 mb-2">
            Analysis Error
          </h3>
          <p className="text-red-200">{channelAnalysisError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {renderAnalysisHeader()}

      {parsedChannelAnalysis && (
        <>
          {renderMetrics()}
          {renderAnalysisTabs()}

          <div className="min-h-[600px]">
            {activeAnalysisTab === "overview" && renderContentAnalysis()}
            {activeAnalysisTab === "content" && renderContentAnalysis()}
            {activeAnalysisTab === "opportunities" && renderOpportunities()}
            {activeAnalysisTab === "competitive" && (
              <div className="text-center py-12">
                <UsersIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  Competitive Intelligence
                </h3>
                <p className="text-slate-500">
                  Advanced competitive analysis coming soon
                </p>
              </div>
            )}
            {activeAnalysisTab === "performance" && (
              <div className="text-center py-12">
                <FireIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                  Performance Analytics
                </h3>
                <p className="text-slate-500">
                  Deep performance insights coming soon
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {isAnalyzing && (
        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="text-slate-300 font-medium">
              Analyzing channels...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumYouTubeAnalysis;
