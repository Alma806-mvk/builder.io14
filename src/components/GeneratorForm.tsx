import React, { useState } from "react";
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
} from "../../types";
import {
  PLATFORMS,
  USER_SELECTABLE_CONTENT_TYPES,
  AB_TESTABLE_CONTENT_TYPES_MAP,
  SUPPORTED_LANGUAGES,
  ASPECT_RATIO_GUIDANCE_OPTIONS,
  IMAGE_PROMPT_STYLES,
  IMAGE_PROMPT_MOODS,
  BATCH_SUPPORTED_TYPES,
  TRANSLATE_ADAPT_SUPPORTED_TYPES,
  VIDEO_LENGTH_OPTIONS,
} from "../../constants";
import {
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MicrophoneIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  SaveIcon,
} from "./IconComponents";

interface GeneratorFormProps {
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
  isLoading: boolean;
  apiKeyMissing: boolean;
  isRecording: boolean;
  onGenerate: () => void;
  onOptimizePrompt: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onShowPersonaModal: () => void;
  onShowTemplateModal: () => void;
  currentPlaceholder: string;
  currentContentTypeDetails: any;
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "0.5rem",
  color: "#e2e8f0",
  fontSize: "0.875rem",
  fontFamily: "inherit",
};

const buttonStyle = {
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.75rem 1rem",
  fontSize: "0.875rem",
  cursor: "pointer",
  fontFamily: "inherit",
};

export const GeneratorForm: React.FC<GeneratorFormProps> = (props) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isBatchSupported = BATCH_SUPPORTED_TYPES.includes(props.contentType);
  const isImageContent =
    props.contentType === ContentType.Image ||
    props.contentType === ContentType.ImagePrompt;
  const isVoiceContent = props.contentType === ContentType.VoiceToScript;
  const isABTestContent = props.contentType === ContentType.ABTest;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Configuration */}
      <div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "#f1f5f9",
            margin: "0 0 1rem 0",
            paddingBottom: "0.5rem",
            borderBottom: "1px solid #334155",
          }}
        >
          Configuration
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#cbd5e1",
                marginBottom: "0.5rem",
              }}
            >
              Platform
            </label>
            <select
              value={props.platform}
              onChange={(e) => props.setPlatform(e.target.value as Platform)}
              style={inputStyle}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#cbd5e1",
                marginBottom: "0.5rem",
              }}
            >
              Content Type
            </label>
            <select
              value={props.contentType}
              onChange={(e) =>
                props.setContentType(e.target.value as ContentType)
              }
              style={inputStyle}
            >
              {USER_SELECTABLE_CONTENT_TYPES.filter(
                (ct) => ct.value !== ContentType.ChannelAnalysis,
              ).map((ct) => (
                <option key={ct.value} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </select>
            {props.currentContentTypeDetails?.description && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  marginTop: "0.25rem",
                }}
              >
                {props.currentContentTypeDetails.description}
              </p>
            )}
          </div>
        </div>

        {/* Video Length Selection - Only show for Script content type */}
        {props.contentType === ContentType.Script && (
          <div style={{ marginTop: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#cbd5e1",
                marginBottom: "0.5rem",
              }}
            >
              Desired Video Length
            </label>
            <select
              value={props.videoLength}
              onChange={(e) => props.setVideoLength(e.target.value)}
              style={inputStyle}
            >
              {VIDEO_LENGTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Custom length input when "custom" is selected */}
            {props.videoLength === "custom" && (
              <input
                type="text"
                placeholder="e.g., 2.5 minutes, 45 seconds, 8 minutes"
                value={props.customVideoLength}
                onChange={(e) => props.setCustomVideoLength(e.target.value)}
                style={{
                  ...inputStyle,
                  marginTop: "0.5rem",
                }}
              />
            )}

            <p
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                marginTop: "0.25rem",
              }}
            >
              The AI will generate a script that matches approximately this
              duration
            </p>
          </div>
        )}
      </div>

      {/* Content Input */}
      <div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "#f1f5f9",
            margin: "0 0 1rem 0",
            paddingBottom: "0.5rem",
            borderBottom: "1px solid #334155",
          }}
        >
          Content Input
        </h3>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#cbd5e1",
              marginBottom: "0.5rem",
            }}
          >
            {isABTestContent
              ? `Topic for A/B Testing ${AB_TESTABLE_CONTENT_TYPES_MAP.find((ab) => ab.value === props.abTestType)?.label || props.abTestType}`
              : isImageContent
                ? "Image Description"
                : isVoiceContent
                  ? "Voice Input / Transcript"
                  : "Topic / Keywords / Details"}
          </label>

          <div style={{ position: "relative" }}>
            <textarea
              value={props.userInput}
              onChange={(e) => props.setUserInput(e.target.value)}
              placeholder={props.currentPlaceholder}
              rows={4}
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical",
                paddingRight: "80px",
              }}
            />
            <button
              onClick={props.onOptimizePrompt}
              style={{
                position: "absolute",
                bottom: "0.5rem",
                right: "0.5rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                padding: "0.5rem 0.75rem",
                fontSize: "0.75rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <ChatBubbleLeftRightIcon
                style={{ width: "0.875rem", height: "0.875rem" }}
              />
              Optimize
            </button>
          </div>

          {/* Voice Recording */}
          {isVoiceContent && (
            <button
              onClick={
                props.isRecording
                  ? props.onStopRecording
                  : props.onStartRecording
              }
              disabled={props.apiKeyMissing}
              style={{
                ...buttonStyle,
                background: props.isRecording ? "#dc2626" : "#059669",
                width: "100%",
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <MicrophoneIcon style={{ width: "1rem", height: "1rem" }} />
              {props.isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          )}

          {/* A/B Test Type */}
          {isABTestContent && (
            <div style={{ marginTop: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#cbd5e1",
                  marginBottom: "0.5rem",
                }}
              >
                A/B Test Type
              </label>
              <select
                value={props.abTestType}
                onChange={(e) =>
                  props.setAbTestType(e.target.value as ABTestableContentType)
                }
                style={inputStyle}
              >
                <option key="ab-empty" value="">
                  Select type...
                </option>
                {AB_TESTABLE_CONTENT_TYPES_MAP.map((ab) => (
                  <option key={ab.value} value={ab.value}>
                    {ab.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Options */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            background: "transparent",
            color: "#94a3b8",
            border: "1px solid #334155",
            borderRadius: "0.5rem",
            padding: "0.75rem 1rem",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontFamily: "inherit",
          }}
        >
          <span>Advanced Options</span>
          {showAdvanced ? (
            <ChevronUpIcon style={{ width: "1rem", height: "1rem" }} />
          ) : (
            <ChevronDownIcon style={{ width: "1rem", height: "1rem" }} />
          )}
        </button>

        {showAdvanced && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              border: "1px solid #334155",
              borderRadius: "0.5rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              {/* AI Persona */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem",
                  }}
                >
                  AI Persona
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <select
                    value={props.selectedAiPersonaId}
                    onChange={(e) =>
                      props.setSelectedAiPersonaId(e.target.value)
                    }
                    style={{ ...inputStyle, flex: 1 }}
                  >
                    {props.allPersonas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.isCustom ? "(Custom)" : ""}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={props.onShowPersonaModal}
                    style={{
                      ...buttonStyle,
                      background: "#475569",
                      padding: "0.75rem",
                    }}
                  >
                    <UserCircleIcon style={{ width: "1rem", height: "1rem" }} />
                  </button>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem",
                  }}
                >
                  Target Audience
                </label>
                <input
                  type="text"
                  value={props.targetAudience}
                  onChange={(e) => props.setTargetAudience(e.target.value)}
                  placeholder="e.g., Gen Z gamers, busy professionals"
                  style={inputStyle}
                />
              </div>

              {/* Number of Variations */}
              {isBatchSupported && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Number of Variations
                  </label>
                  <select
                    value={props.batchVariations}
                    onChange={(e) =>
                      props.setBatchVariations(parseInt(e.target.value))
                    }
                    style={inputStyle}
                  >
                    <option key="var-1" value={1}>
                      1 variation
                    </option>
                    <option key="var-2" value={2}>
                      2 variations
                    </option>
                    <option key="var-3" value={3}>
                      3 variations
                    </option>
                    <option key="var-5" value={5}>
                      5 variations
                    </option>
                  </select>
                </div>
              )}

              {/* Target Language */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem",
                  }}
                >
                  Target Language
                </label>
                <select
                  value={props.targetLanguage}
                  onChange={(e) =>
                    props.setTargetLanguage(e.target.value as Language)
                  }
                  style={inputStyle}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEO Options */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem",
                  }}
                >
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={props.seoKeywords}
                  onChange={(e) => props.setSeoKeywords(e.target.value)}
                  placeholder="e.g., social media marketing, content strategy"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem",
                  }}
                >
                  SEO Mode
                </label>
                <select
                  value={props.seoMode}
                  onChange={(e) =>
                    props.setSeoMode(e.target.value as SeoKeywordMode)
                  }
                  style={inputStyle}
                >
                  <option key="seo-natural" value="natural">
                    Natural
                  </option>
                  <option key="seo-moderate" value="moderate">
                    Moderate
                  </option>
                  <option key="seo-aggressive" value="aggressive">
                    Aggressive
                  </option>
                </select>
              </div>
            </div>

            {/* Image-specific options */}
            {isImageContent && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Aspect Ratio
                  </label>
                  <select
                    value={props.aspectRatioGuidance}
                    onChange={(e) =>
                      props.setAspectRatioGuidance(
                        e.target.value as AspectRatioGuidance,
                      )
                    }
                    style={inputStyle}
                  >
                    {ASPECT_RATIO_GUIDANCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Image Styles
                  </label>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {IMAGE_PROMPT_STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => props.toggleImageStyle(style)}
                        style={{
                          padding: "0.5rem 0.75rem",
                          background: props.selectedImageStyles.includes(style)
                            ? "#3b82f6"
                            : "#1e293b",
                          color: props.selectedImageStyles.includes(style)
                            ? "white"
                            : "#cbd5e1",
                          border: `1px solid ${props.selectedImageStyles.includes(style) ? "#3b82f6" : "#334155"}`,
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontFamily: "inherit",
                        }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Image Moods
                  </label>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {IMAGE_PROMPT_MOODS.map((mood) => (
                      <button
                        key={mood}
                        onClick={() => props.toggleImageMood(mood)}
                        style={{
                          padding: "0.5rem 0.75rem",
                          background: props.selectedImageMoods.includes(mood)
                            ? "#3b82f6"
                            : "#1e293b",
                          color: props.selectedImageMoods.includes(mood)
                            ? "white"
                            : "#cbd5e1",
                          border: `1px solid ${props.selectedImageMoods.includes(mood) ? "#3b82f6" : "#334155"}`,
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontFamily: "inherit",
                        }}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#cbd5e1",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Negative Prompt (What to avoid)
                  </label>
                  <input
                    type="text"
                    value={props.negativeImagePrompt}
                    onChange={(e) =>
                      props.setNegativeImagePrompt(e.target.value)
                    }
                    placeholder="e.g., blurry, low quality, text"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* Other content options */}
            <div style={{ marginTop: "1rem" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={props.includeCTAs}
                  onChange={(e) => props.setIncludeCTAs(e.target.checked)}
                  style={{ marginRight: "0.5rem" }}
                />
                <span style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>
                  Include Call-to-Actions (CTAs)
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button
          onClick={props.onShowTemplateModal}
          style={{
            ...buttonStyle,
            background: "#374151",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <SaveIcon style={{ width: "1rem", height: "1rem" }} />
          Templates
        </button>

        <button
          onClick={props.onGenerate}
          disabled={
            props.isLoading ||
            props.apiKeyMissing ||
            (!props.userInput.trim() &&
              ![
                ContentType.ImagePrompt,
                ContentType.TrendAnalysis,
                ContentType.ContentGapFinder,
                ContentType.VoiceToScript,
              ].includes(props.contentType))
          }
          style={{
            ...buttonStyle,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontWeight: "600",
            opacity: props.isLoading || props.apiKeyMissing ? 0.5 : 1,
            cursor:
              props.isLoading || props.apiKeyMissing
                ? "not-allowed"
                : "pointer",
          }}
        >
          <SparklesIcon style={{ width: "1.125rem", height: "1.125rem" }} />
          {props.isLoading
            ? "Generating..."
            : props.contentType === ContentType.ABTest && props.abTestType
              ? `Generate A/B Test`
              : "Generate Content"}
        </button>
      </div>
    </div>
  );
};
