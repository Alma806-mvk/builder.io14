import React, { useState, useRef, useEffect } from "react";
import { GeneratorForm } from "./GeneratorForm";
import { GeneratorOutput } from "./GeneratorOutput";
import { GeneratorSidebar } from "./GeneratorSidebar";
import {
  Platform,
  ContentType,
  ABTestableContentType,
  SeoKeywordMode,
  Language,
  AspectRatioGuidance,
  ImagePromptStyle,
  ImagePromptMood,
  AiPersona,
  HistoryItem,
  GeneratedOutput,
  ContentBriefOutput,
  PollQuizOutput,
  ReadabilityOutput,
  PromptOptimizationSuggestion,
  ParsedChannelAnalysisSection,
  ContentStrategyPlanOutput,
  EngagementFeedbackOutput,
  TrendAnalysisOutput,
  RefinementType,
  ABTestVariation,
} from "../../types";
import {
  SparklesIcon,
  ListChecksIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  MenuIcon,
} from "./IconComponents";

interface GeneratorLayoutProps {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  userInput: string;
  setUserInput: (input: string) => void;
  targetAudience: string;
  setTargetAudience: (audience: string) => void;
  batchVariations: number;
  setBatchVariations: (count: number) => void;
  selectedAiPersonaId: string;
  setSelectedAiPersonaId: (id: string) => void;
  allPersonas: AiPersona[];
  seoKeywords: string;
  setSeoKeywords: (keywords: string) => void;
  seoMode: SeoKeywordMode;
  setSeoMode: (mode: SeoKeywordMode) => void;
  abTestType: ABTestableContentType;
  setAbTestType: (type: ABTestableContentType) => void;
  targetLanguage: Language;
  setTargetLanguage: (language: Language) => void;
  aspectRatioGuidance: AspectRatioGuidance;
  setAspectRatioGuidance: (guidance: AspectRatioGuidance) => void;
  selectedImageStyles: ImagePromptStyle[];
  toggleImageStyle: (style: ImagePromptStyle) => void;
  selectedImageMoods: ImagePromptMood[];
  toggleImageMood: (mood: ImagePromptMood) => void;
  negativeImagePrompt: string;
  setNegativeImagePrompt: (prompt: string) => void;
  includeCTAs: boolean;
  setIncludeCTAs: (include: boolean) => void;
  videoLength: string;
  setVideoLength: (length: string) => void;
  customVideoLength: string;
  setCustomVideoLength: (length: string) => void;
  generatedOutput:
    | GeneratedOutput
    | ContentBriefOutput
    | PollQuizOutput
    | ReadabilityOutput
    | PromptOptimizationSuggestion[]
    | ParsedChannelAnalysisSection[]
    | ContentStrategyPlanOutput
    | EngagementFeedbackOutput
    | TrendAnalysisOutput
    | null;
  displayedOutputItem: HistoryItem | null;
  isLoading: boolean;
  error: string | null;
  copied: boolean;
  abTestResults?: ABTestVariation[] | null;
  showRefineOptions: boolean;
  setShowRefineOptions: (show: boolean) => void;
  showTextActionOptions: boolean;
  setShowTextActionOptions: (show: boolean) => void;
  history: HistoryItem[];
  viewingHistoryItemId: string | null;
  apiKeyMissing: boolean;
  isRecording: boolean;
  currentPlaceholder: string;
  currentContentTypeDetails: any;
  isBatchSupported: boolean;
  isABTestSupported: boolean;
  isAiPersonaModalOpen: boolean;
  setIsAiPersonaModalOpen: (open: boolean) => void;
  onGenerate: () => void;
  onOptimizePrompt: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onShowPersonaModal: () => void;
  onShowTemplateModal: () => void;
  onCopyToClipboard: (text?: string) => void;
  onExportMarkdown: (output: any, userInput: string) => void;
  onRefine: (refinementType: RefinementType) => void;
  onTextAction: (actionType: ContentType) => void;
  onViewHistoryItem: (item: HistoryItem) => void;
  onToggleFavorite: (id: string) => void;
  onPinToCanvas: (item: HistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onUseHistoryItem: (item: HistoryItem) => void;
  onClearAppHistory: () => void;
  onUseAsCanvasBackground: () => void;
  onSendToCanvas: (content: string, title: string) => void;
  onAddToHistory: (
    itemOutput: any,
    originalContentType: ContentType,
    originalUserInput: string,
    actionParams?: any,
  ) => void;
  renderOutput: () => React.ReactNode;
}

export const GeneratorLayout: React.FC<GeneratorLayoutProps> = (props) => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0f172a",
        color: "#e2e8f0",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: "relative",
        maxWidth: "none",
      }}
    >
      {/* Main Content Area */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5rem 2rem",
            borderBottom: "1px solid #1e293b",
            backgroundColor: "rgba(15, 23, 42, 0.9)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                background:
                  "linear-gradient(135deg, #10b981, #0ea5e9, #a855f7)",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SparklesIcon
                style={{ width: "1.25rem", height: "1.25rem", color: "white" }}
              />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  margin: 0,
                  color: "#f8fafc",
                }}
              >
                Content Generator
              </h1>
              <p style={{ fontSize: "0.875rem", color: "#94a3b8", margin: 0 }}>
                Create engaging content with AI
              </p>
            </div>
          </div>

          {/* History Toggle Button */}
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              background: historyOpen ? "#3b82f6" : "#1e293b",
              border: `1px solid ${historyOpen ? "#3b82f6" : "#334155"}`,
              borderRadius: "0.5rem",
              color: historyOpen ? "white" : "#cbd5e1",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!historyOpen) {
                e.currentTarget.style.background = "#334155";
                e.currentTarget.style.borderColor = "#475569";
                e.currentTarget.style.color = "#f1f5f9";
              }
            }}
            onMouseLeave={(e) => {
              if (!historyOpen) {
                e.currentTarget.style.background = "#1e293b";
                e.currentTarget.style.borderColor = "#334155";
                e.currentTarget.style.color = "#cbd5e1";
              }
            }}
          >
            <ListChecksIcon style={{ width: "1rem", height: "1rem" }} />
            <span>History</span>
            {historyOpen ? (
              <ChevronRightIcon
                style={{ width: "0.875rem", height: "0.875rem" }}
              />
            ) : (
              <ChevronLeftIcon
                style={{ width: "0.875rem", height: "0.875rem" }}
              />
            )}
          </button>
        </div>

        {/* Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: sidebarMinimized ? "300px 1fr" : "1fr 1.5fr",
            gap: "2rem",
            padding: "2rem",
            flex: 1,
            alignItems: "stretch",
            overflow: "auto",
            minHeight: "calc(100vh - 120px)",
            width: "100vw",
            maxWidth: "none",
          }}
        >
          {/* Form Section */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: "1rem",
              padding: "1.5rem",
              border: "1px solid #334155",
              height: "fit-content",
            }}
          >
            <GeneratorForm
              platform={props.platform}
              setPlatform={props.setPlatform}
              contentType={props.contentType}
              setContentType={props.setContentType}
              userInput={props.userInput}
              setUserInput={props.setUserInput}
              targetAudience={props.targetAudience}
              setTargetAudience={props.setTargetAudience}
              batchVariations={props.batchVariations}
              setBatchVariations={props.setBatchVariations}
              selectedAiPersonaId={props.selectedAiPersonaId}
              setSelectedAiPersonaId={props.setSelectedAiPersonaId}
              allPersonas={props.allPersonas}
              seoKeywords={props.seoKeywords}
              setSeoKeywords={props.setSeoKeywords}
              seoMode={props.seoMode}
              setSeoMode={props.setSeoMode}
              abTestType={props.abTestType}
              setAbTestType={props.setAbTestType}
              targetLanguage={props.targetLanguage}
              setTargetLanguage={props.setTargetLanguage}
              aspectRatioGuidance={props.aspectRatioGuidance}
              setAspectRatioGuidance={props.setAspectRatioGuidance}
              selectedImageStyles={props.selectedImageStyles}
              toggleImageStyle={props.toggleImageStyle}
              selectedImageMoods={props.selectedImageMoods}
              toggleImageMood={props.toggleImageMood}
              negativeImagePrompt={props.negativeImagePrompt}
              setNegativeImagePrompt={props.setNegativeImagePrompt}
              includeCTAs={props.includeCTAs}
              setIncludeCTAs={props.setIncludeCTAs}
              videoLength={props.videoLength}
              setVideoLength={props.setVideoLength}
              customVideoLength={props.customVideoLength}
              setCustomVideoLength={props.setCustomVideoLength}
              isLoading={props.isLoading}
              apiKeyMissing={props.apiKeyMissing}
              isRecording={props.isRecording}
              onGenerate={props.onGenerate}
              onOptimizePrompt={props.onOptimizePrompt}
              onStartRecording={props.onStartRecording}
              onStopRecording={props.onStopRecording}
              onShowPersonaModal={props.onShowPersonaModal}
              onShowTemplateModal={props.onShowTemplateModal}
              currentPlaceholder={props.currentPlaceholder}
              currentContentTypeDetails={props.currentContentTypeDetails}
            />
          </div>

          {/* Output Section */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: "1rem",
              padding: "1.5rem",
              border: "1px solid #334155",
              height: "100%",
              minHeight: "600px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <GeneratorOutput
              output={props.generatedOutput}
              displayedOutputItem={props.displayedOutputItem}
              isLoading={props.isLoading}
              error={props.error}
              copied={props.copied}
              abTestResults={props.abTestResults}
              abTestType={props.abTestType}
              showRefineOptions={props.showRefineOptions}
              setShowRefineOptions={props.setShowRefineOptions}
              showTextActionOptions={props.showTextActionOptions}
              setShowTextActionOptions={props.setShowTextActionOptions}
              onCopyToClipboard={props.onCopyToClipboard}
              onExportMarkdown={props.onExportMarkdown}
              onRefine={props.onRefine}
              onTextAction={props.onTextAction}
              onSendToCanvas={props.onSendToCanvas}
              renderOutput={props.renderOutput}
            />
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "400px",
          height: "100vh",
          background: "#0f172a",
          borderLeft: "1px solid #1e293b",
          transform: `translateX(${historyOpen && !sidebarMinimized ? "0" : "100%"})`,
          transition: "transform 0.3s ease",
          zIndex: 50,
          overflow: "hidden",
        }}
      >
        <GeneratorSidebar
          history={props.history}
          viewingHistoryItemId={props.viewingHistoryItemId}
          onViewHistoryItem={props.onViewHistoryItem}
          onToggleFavorite={props.onToggleFavorite}
          onPinToCanvas={props.onPinToCanvas}
          onDeleteHistoryItem={props.onDeleteHistoryItem}
          onClearAppHistory={props.onClearAppHistory}
        />
      </div>

      {/* Overlay */}
      {historyOpen && !sidebarMinimized && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.3)",
            zIndex: 40,
          }}
          onClick={() => setHistoryOpen(false)}
        />
      )}
    </div>
  );
};
