import React, { useState } from "react";
import {
  GeneratedOutput,
  ContentBriefOutput,
  PollQuizOutput,
  ReadabilityOutput,
  PromptOptimizationSuggestion,
  ParsedChannelAnalysisSection,
  ContentStrategyPlanOutput,
  EngagementFeedbackOutput,
  TrendAnalysisOutput,
  HistoryItem,
  ContentType,
  RefinementType,
  ABTestVariation,
} from "../../types";
import {
  ClipboardIcon,
  DownloadIcon,
  WandIcon,
  SparklesIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  CanvasIcon,
} from "./IconComponents";
import GeneratingContent from "./GeneratingContent";

interface GeneratorOutputProps {
  output:
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
  abTestType?: string;
  showRefineOptions: boolean;
  setShowRefineOptions: (show: boolean) => void;
  showTextActionOptions: boolean;
  setShowTextActionOptions: (show: boolean) => void;
  onCopyToClipboard: (text?: string) => void;
  onExportMarkdown: (output: any, userInput: string) => void;
  onRefine: (refinementType: RefinementType) => void;
  onTextAction: (actionType: ContentType) => void;
  onSendToCanvas?: (content: string, title: string) => void;
  renderOutput: () => React.ReactNode;
}

export const GeneratorOutput: React.FC<GeneratorOutputProps> = ({
  output,
  displayedOutputItem,
  isLoading,
  error,
  copied,
  abTestResults,
  abTestType,
  showRefineOptions,
  setShowRefineOptions,
  showTextActionOptions,
  setShowTextActionOptions,
  onCopyToClipboard,
  onExportMarkdown,
  onRefine,
  onTextAction,
  onSendToCanvas,
  renderOutput,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showSendToCanvas, setShowSendToCanvas] = useState(false);

  const getSendToCanvasOptions = () => {
    if (!displayedOutputItem?.output) return null;

    const output = displayedOutputItem.output;
    const options: { label: string; content: string; title: string }[] = [];

    // Handle different output types
    if (
      typeof output === "object" &&
      "content" in output &&
      typeof output.content === "string"
    ) {
      // Text content (Script, etc.)
      const fullContent = output.content;

      // Option 1: Full content
      options.push({
        label: "📄 Full Content",
        content: fullContent,
        title: `${displayedOutputItem.contentType} - Full`,
      });

      // Option 2: First paragraph/section
      const firstSection =
        fullContent.split("\n\n")[0] || fullContent.substring(0, 200);
      if (firstSection !== fullContent) {
        options.push({
          label: "🔸 First Section",
          content: firstSection,
          title: `${displayedOutputItem.contentType} - First Section`,
        });
      }

      // For scripts specifically, try to extract different parts
      if (displayedOutputItem.contentType === ContentType.Script) {
        // Try to extract hook
        const hookMatch = fullContent.match(
          /(?:HOOK|Hook|hook)[:\s]*([^]*?)(?:MAIN|Main|main|CONTENT|Content|content|\n\n)/i,
        );
        if (hookMatch) {
          options.push({
            label: "🎣 Hook Only",
            content: hookMatch[1].trim(),
            title: "Script - Hook",
          });
        }

        // Try to extract main content
        const mainMatch = fullContent.match(
          /(?:MAIN|Main|main|CONTENT|Content|content)[:\s]*([^]*?)(?:CTA|Call|call|CALL)/i,
        );
        if (mainMatch) {
          options.push({
            label: "📖 Main Content Only",
            content: mainMatch[1].trim(),
            title: "Script - Main Content",
          });
        }

        // Try to extract CTA
        const ctaMatch = fullContent.match(
          /(?:CTA|Call|call|CALL)[:\s]*([^]*?)$/i,
        );
        if (ctaMatch) {
          options.push({
            label: "📢 CTA Only",
            content: ctaMatch[1].trim(),
            title: "Script - CTA",
          });
        }
      }

      // Option: Custom length snippets
      if (fullContent.length > 100) {
        options.push({
          label: "✂️ First 100 Characters",
          content: fullContent.substring(0, 100) + "...",
          title: `${displayedOutputItem.contentType} - Snippet`,
        });
      }
    }
    // Handle other output types (ContentBrief, etc.)
    else if (typeof output === "object") {
      // For structured content, convert to readable format
      options.push({
        label: "📋 Full Structured Content",
        content: JSON.stringify(output, null, 2),
        title: `${displayedOutputItem.contentType} - Full`,
      });

      // For ContentBrief specifically
      if ("titleSuggestions" in output && output.titleSuggestions) {
        options.push({
          label: "📌 Title Suggestions Only",
          content: output.titleSuggestions.join("\n"),
          title: "Content Brief - Titles",
        });
      }
      if ("keyAngles" in output && output.keyAngles) {
        options.push({
          label: "🎯 Key Angles Only",
          content: output.keyAngles.join("\n"),
          title: "Content Brief - Key Angles",
        });
      }
    }

    return (
      <div style={{ display: "grid", gap: "0.25rem" }}>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              if (onSendToCanvas) {
                onSendToCanvas(option.content, option.title);
                setShowSendToCanvas(false);
              }
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem 0.75rem",
              background: "transparent",
              color: "#cbd5e1",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "0.75rem",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#334155";
              e.currentTarget.style.color = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#cbd5e1";
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        height: "100%",
        minHeight: "500px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid #334155",
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "#f1f5f9",
            margin: 0,
          }}
        >
          Generated Content
        </h3>

        {isLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              padding: "0.375rem 0.75rem",
              borderRadius: "1rem",
              background: "#1e40af",
              color: "#bfdbfe",
            }}
          >
            <div
              style={{
                width: "0.5rem",
                height: "0.5rem",
                background: "currentColor",
                borderRadius: "50%",
                animation: "pulse 1.5s infinite",
              }}
            />
            <span>Generating...</span>
          </div>
        )}

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              padding: "0.375rem 0.75rem",
              borderRadius: "1rem",
              background: "#dc2626",
              color: "#fecaca",
            }}
          >
            <XCircleIcon style={{ width: "0.875rem", height: "0.875rem" }} />
            <span>Error</span>
          </div>
        )}

        {output && !isLoading && !error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: "500",
              padding: "0.375rem 0.75rem",
              borderRadius: "1rem",
              background: "#059669",
              color: "#a7f3d0",
            }}
          >
            <CheckCircleIcon
              style={{ width: "0.875rem", height: "0.875rem" }}
            />
            <span>Ready</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "300px",
        }}
      >
        {isLoading && (
          <div
            style={{
              flex: 1,
              padding: "1rem",
              background: "#0f172a",
              borderRadius: "0.5rem",
              border: "1px solid #334155",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "300px",
              gap: "20px",
            }}
          >
            {/* Contained loading spinner */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              style={{
                animation: "spin 1s linear infinite",
              }}
            >
              <circle
                cx="16"
                cy="16"
                r="12"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="64 11"
                transform="rotate(-90 16 16)"
              />
            </svg>

            {/* Loading text */}
            <p
              style={{
                margin: 0,
                color: "#94a3b8",
                fontSize: "14px",
                fontWeight: "400",
                textAlign: "center",
              }}
            >
              AI is generating your content...
            </p>

            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )}

        {error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: "0.75rem",
              textAlign: "center",
              color: "#f87171",
            }}
          >
            <XCircleIcon
              style={{ width: "3rem", height: "3rem", color: "#dc2626" }}
            />
            <h4 style={{ margin: 0, fontSize: "1.125rem", fontWeight: "600" }}>
              Generation Error
            </h4>
            <p style={{ margin: 0, color: "#94a3b8", maxWidth: "24rem" }}>
              {error}
            </p>
          </div>
        )}

        {!isLoading && !error && output && (
          <div
            style={{
              flex: 1,
              padding: "1rem",
              background: "#0f172a",
              borderRadius: "0.5rem",
              border: "1px solid #334155",
              color: "#e2e8f0",
              fontFamily:
                "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              fontSize: "0.875rem",
              lineHeight: 1.5,
              overflowY: "auto",
              width: "100%",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {renderOutput()}
          </div>
        )}

        {!isLoading && !error && !output && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              gap: "0.75rem",
              textAlign: "center",
              color: "#64748b",
              width: "100%",
              minHeight: "400px",
            }}
          >
            <SparklesIcon
              style={{ width: "3rem", height: "3rem", color: "#475569" }}
            />
            <h4
              style={{
                margin: 0,
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#94a3b8",
              }}
            >
              Ready to Generate
            </h4>
            <p style={{ margin: 0, width: "100%" }}>
              Fill out the form and click "Generate Content" to get started.
            </p>
          </div>
        )}

        {/* A/B Test Results */}
        {!isLoading && abTestResults && (
          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #334155",
            }}
          >
            <h4
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#f1f5f9",
              }}
            >
              A/B Test Variations
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              {abTestResults.map((result, index) => (
                <div
                  key={`ab-test-${index}-${result.rationale.slice(0, 20)}`}
                  style={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#3b82f6",
                      }}
                    >
                      Variation {index + 1}
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    {result.variation.type === "text" && (
                      <p
                        style={{
                          margin: 0,
                          color: "#e2e8f0",
                          fontSize: "0.875rem",
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {(result.variation as any).content}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      paddingTop: "0.75rem",
                      borderTop: "1px solid #334155",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        color: "#94a3b8",
                        fontStyle: "italic",
                      }}
                    >
                      <strong>Why:</strong> {result.rationale}
                    </p>
                    <button
                      onClick={() =>
                        onCopyToClipboard(
                          result.variation.type === "text"
                            ? (result.variation as any).content
                            : JSON.stringify(result.variation, null, 2),
                        )
                      }
                      style={{
                        background: "#374151",
                        color: "#d1d5db",
                        border: "none",
                        borderRadius: "0.375rem",
                        padding: "0.5rem 0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        alignSelf: "flex-start",
                      }}
                    >
                      <ClipboardIcon
                        style={{ width: "0.875rem", height: "0.875rem" }}
                      />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      {displayedOutputItem && !isLoading && !error && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "1rem",
            borderTop: "1px solid #334155",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => onCopyToClipboard()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                fontSize: "0.75rem",
                fontWeight: "500",
                cursor: "pointer",
                border: "none",
                background: "#3b82f6",
                color: "white",
              }}
            >
              <ClipboardIcon
                style={{ width: "0.875rem", height: "0.875rem" }}
              />
              {copied ? "Copied!" : "Copy"}
            </button>

            {displayedOutputItem.output && (
              <button
                onClick={() =>
                  onExportMarkdown(
                    displayedOutputItem.output!,
                    displayedOutputItem.userInput,
                  )
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  border: "none",
                  background: "#374151",
                  color: "#d1d5db",
                }}
              >
                <DownloadIcon
                  style={{ width: "0.875rem", height: "0.875rem" }}
                />
                Export
              </button>
            )}

            {onSendToCanvas && (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowSendToCanvas(!showSendToCanvas)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    border: "none",
                    background: "#059669",
                    color: "white",
                  }}
                >
                  <CanvasIcon
                    style={{ width: "0.875rem", height: "0.875rem" }}
                  />
                  Send to Canvas
                  <ChevronDownIcon
                    style={{
                      width: "0.75rem",
                      height: "0.75rem",
                      transform: showSendToCanvas
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>

                {showSendToCanvas && (
                  <>
                    <div
                      style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 5,
                      }}
                      onClick={() => setShowSendToCanvas(false)}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        left: 0,
                        marginBottom: "0.5rem",
                        background: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "0.5rem",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                        zIndex: 10,
                        minWidth: "240px",
                        maxHeight: "300px",
                        overflowY: "auto",
                      }}
                    >
                      <div style={{ padding: "0.75rem" }}>
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: "0.5rem",
                          }}
                        >
                          🎨 Send to Canvas
                        </span>
                        {getSendToCanvasOptions()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowActions(!showActions)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                fontSize: "0.75rem",
                fontWeight: "500",
                cursor: "pointer",
                background: "transparent",
                color: "#94a3b8",
                border: "1px solid #334155",
              }}
            >
              <WandIcon style={{ width: "0.875rem", height: "0.875rem" }} />
              Actions
              <ChevronDownIcon
                style={{
                  width: "0.75rem",
                  height: "0.75rem",
                  transform: showActions ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              />
            </button>

            {showActions && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  right: 0,
                  marginBottom: "0.5rem",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "0.5rem",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                  zIndex: 10,
                  minWidth: "280px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {/* Refine Section */}
                <div
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #334155",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    ✨ Refine Content
                  </span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "0.25rem",
                    }}
                  >
                    {[
                      RefinementType.Shorter,
                      RefinementType.Longer,
                      RefinementType.MoreEngaging,
                      RefinementType.AddEmojis,
                      RefinementType.MoreFormal,
                      RefinementType.MoreCasual,
                    ].map((rt) => (
                      <button
                        key={rt}
                        onClick={() => {
                          onRefine(rt);
                          setShowActions(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          background: "transparent",
                          color: "#cbd5e1",
                          border: "none",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#334155";
                          e.currentTarget.style.color = "#f1f5f9";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#cbd5e1";
                        }}
                      >
                        {rt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transform Section */}
                <div
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #334155",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    🔄 Transform
                  </span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "0.25rem",
                    }}
                  >
                    {[
                      {
                        type: ContentType.Hashtags,
                        label: "Generate Hashtags",
                      },
                      {
                        type: ContentType.RepurposedContent,
                        label: "Repurpose for Other Platforms",
                      },
                      {
                        type: ContentType.MultiPlatformSnippets,
                        label: "Multi-Platform Snippets",
                      },
                      {
                        type: ContentType.TranslateAdapt,
                        label: "Translate & Adapt",
                      },
                      { type: ContentType.Snippets, label: "Create Snippets" },
                    ].map((item) => (
                      <button
                        key={item.type}
                        onClick={() => {
                          onTextAction(item.type);
                          setShowActions(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          background: "transparent",
                          color: "#cbd5e1",
                          border: "none",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#334155";
                          e.currentTarget.style.color = "#f1f5f9";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#cbd5e1";
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Analyze Section */}
                <div
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #334155",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    📊 Analyze
                  </span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "0.25rem",
                    }}
                  >
                    {[
                      {
                        type: ContentType.CheckReadability,
                        label: "Check Readability",
                      },
                      {
                        type: ContentType.EngagementFeedback,
                        label: "AI Engagement Feedback",
                      },
                      { type: ContentType.SeoKeywords, label: "SEO Keywords" },
                      {
                        type: ContentType.ExplainOutput,
                        label: "Explain This Content",
                      },
                      {
                        type: ContentType.YouTubeDescription,
                        label: "YouTube Description",
                      },
                    ].map((item) => (
                      <button
                        key={item.type}
                        onClick={() => {
                          onTextAction(item.type);
                          setShowActions(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          background: "transparent",
                          color: "#cbd5e1",
                          border: "none",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#334155";
                          e.currentTarget.style.color = "#f1f5f9";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#cbd5e1";
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate More Section */}
                <div style={{ padding: "0.75rem" }}>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    💡 Generate More
                  </span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "0.25rem",
                    }}
                  >
                    {[
                      {
                        type: ContentType.FollowUpIdeas,
                        label: "Follow-Up Ideas",
                      },
                      {
                        type: ContentType.VisualStoryboard,
                        label: "Visual Storyboard",
                      },
                      {
                        type: ContentType.OptimizePrompt,
                        label: "Optimize Prompt",
                      },
                    ].map((item) => (
                      <button
                        key={item.type}
                        onClick={() => {
                          onTextAction(item.type);
                          setShowActions(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          background: "transparent",
                          color: "#cbd5e1",
                          border: "none",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#334155";
                          e.currentTarget.style.color = "#f1f5f9";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#cbd5e1";
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
