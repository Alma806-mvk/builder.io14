import { Language, AspectRatioGuidance } from "./types";

// Platform-specific constants
export const PLATFORMS = {
  YouTube: {
    name: "YouTube",
    description: "Video content platform",
    contentTypes: [
      "Script",
      "Title/Headline",
      "Video Hook",
      "Thumbnail Concept",
    ],
  },
  TikTok: {
    name: "TikTok",
    description: "Short-form video platform",
    contentTypes: ["Script", "Title/Headline", "Video Hook"],
  },
  Instagram: {
    name: "Instagram",
    description: "Photo and video sharing platform",
    contentTypes: ["Script", "Title/Headline", "Image Prompt"],
  },
  Twitter: {
    name: "Twitter X",
    description: "Micro-blogging platform",
    contentTypes: ["Script", "Title/Headline"],
  },
  LinkedIn: {
    name: "LinkedIn",
    description: "Professional networking platform",
    contentTypes: ["Script", "Title/Headline"],
  },
  Facebook: {
    name: "Facebook",
    description: "Social networking platform",
    contentTypes: ["Script", "Title/Headline"],
  },
};

// Content type constants
export const CONTENT_TYPES = [
  {
    name: "Script",
    description: "Full content script",
    platforms: [
      "YouTube",
      "TikTok",
      "Instagram",
      "Twitter",
      "LinkedIn",
      "Facebook",
    ],
  },
  {
    name: "Idea",
    description: "Content idea generation",
    platforms: [
      "YouTube",
      "TikTok",
      "Instagram",
      "Twitter",
      "LinkedIn",
      "Facebook",
    ],
  },
  {
    name: "Title",
    description: "Engaging title or headline",
    platforms: [
      "YouTube",
      "TikTok",
      "Instagram",
      "Twitter",
      "LinkedIn",
      "Facebook",
    ],
  },
  {
    name: "ImagePrompt",
    description: "AI image generation prompt",
    platforms: ["Instagram"],
  },
  {
    name: "Image",
    description: "Generate AI image",
    platforms: ["Instagram"],
  },
  {
    name: "VideoHook",
    description: "Attention-grabbing video opening",
    platforms: ["YouTube", "TikTok"],
  },
  {
    name: "ThumbnailConcept",
    description: "YouTube thumbnail design concept",
    platforms: ["YouTube"],
  },
];

const contentTypes = Array.isArray(CONTENT_TYPES) ? CONTENT_TYPES : [];

// User-selectable content types
export const USER_SELECTABLE_CONTENT_TYPES = [
  "Script",
  "Idea",
  "Title/Headline",
  "ImagePrompt",
  "Image",
  "VideoHook",
  "ThumbnailConcept",
  "ContentBrief",
  "PollsQuizzes",
  "ContentGapFinder",
  "MicroScript",
  "VoiceToScript",
  "ChannelAnalysis",
  "ContentStrategyPlan",
  "ABTest",
  "Hashtags",
  "Snippets",
  "RefinedText",
  "RepurposedContent",
  "VisualStoryboard",
  "MultiPlatformSnippets",
  "ExplainOutput",
  "FollowUpIdeas",
  "SeoKeywords",
  "OptimizePrompt",
  "YouTubeDescription",
  "TranslateAdapt",
  "CheckReadability",
  "TrendAnalysis",
  "EngagementFeedback",
  "YoutubeChannelStats",
];

// AI Persona constants
export const AI_PERSONAS = {
  Default: {
    name: "Default AI",
    description: "Balanced and professional",
    systemInstruction:
      "You are a helpful AI assistant focused on creating engaging content.",
  },
  ProfessionalExpert: {
    name: "Professional Expert",
    description: "Formal and authoritative",
    systemInstruction:
      "You are a professional expert in content creation, providing detailed and authoritative advice.",
  },
  CasualFriend: {
    name: "Casual & Witty Friend",
    description: "Friendly and humorous",
    systemInstruction:
      "You are a casual and witty friend who helps create fun and engaging content.",
  },
  CreativeStoryteller: {
    name: "Creative Storyteller",
    description: "Imaginative and narrative-focused",
    systemInstruction:
      "You are a creative storyteller who helps craft compelling narratives and engaging content.",
  },
  DataDrivenAnalyst: {
    name: "Data-Driven Analyst",
    description: "Analytical and research-based",
    systemInstruction:
      "You are a data-driven analyst who helps create content based on research and analytics.",
  },
  SarcasticCommentator: {
    name: "Sarcastic Commentator",
    description: "Witty and satirical",
    systemInstruction:
      "You are a sarcastic commentator who helps create humorous and satirical content.",
  },
};

// Default AI personas
export const DEFAULT_AI_PERSONAS = Object.values(AI_PERSONAS);

// Image prompt styles
export const IMAGE_PROMPT_STYLES = [
  "Photorealistic",
  "Digital Art",
  "Watercolor",
  "Oil Painting",
  "Sketch",
  "3D Render",
  "Pixel Art",
  "Anime",
  "Comic Book",
  "Minimalist",
] as const;

// Image prompt moods
export const IMAGE_PROMPT_MOODS = [
  "Happy",
  "Serious",
  "Mysterious",
  "Energetic",
  "Calm",
  "Dramatic",
  "Playful",
  "Professional",
  "Whimsical",
  "Dark",
] as const;

// Default user input placeholders
export const DEFAULT_USER_INPUT_PLACEHOLDERS = {
  Script: "Enter your content topic or idea...",
  Idea: "Describe your content niche or theme...",
  Title: "Enter your content topic or main point...",
  ImagePrompt: "Describe the image you want to generate...",
  Image: "Describe the image you want to generate...",
  VideoHook: "Enter your video topic or main point...",
  ThumbnailConcept: "Enter your video topic or main point...",
  ContentBrief: "Describe your content project...",
  PollsQuizzes: "Enter your topic or theme...",
  ContentGapFinder: "Enter your niche or topic...",
  MicroScript: "Enter your video topic or main point...",
  VoiceToScript: "Enter your voice recording topic...",
  ChannelAnalysis: "Enter YouTube channel URL or name...",
  ContentStrategyPlan: "Describe your content goals and audience...",
  ABTest: "Enter your content to A/B test...",
  Hashtags: "Enter your content topic or theme...",
  Snippets: "Enter your content to extract snippets from...",
  RefinedText: "Enter your content to refine...",
  RepurposedContent: "Enter your content to repurpose...",
  VisualStoryboard: "Enter your content to storyboard...",
  MultiPlatformSnippets: "Enter your content to create snippets...",
  ExplainOutput: "Enter your content to explain...",
  FollowUpIdeas: "Enter your content to generate follow-up ideas...",
  SeoKeywords: "Enter your content topic or theme...",
  OptimizePrompt: "Enter your prompt to optimize...",
  YouTubeDescription: "Enter your video topic or main point...",
  TranslateAdapt: "Enter your content to translate or adapt...",
  CheckReadability: "Enter your content to check readability...",
  TrendAnalysis: "Enter your topic or niche...",
  EngagementFeedback: "Enter your content to get feedback...",
  YoutubeChannelStats: "Enter YouTube channel URL or name...",
};

// Supported content types for batch operations
export const BATCH_SUPPORTED_TYPES = [
  "Script",
  "Title/Headline",
  "VideoHook",
  "ThumbnailConcept",
  "Hashtags",
  "Snippets",
  "RefinedText",
  "RepurposedContent",
  "VisualStoryboard",
  "MultiPlatformSnippets",
  "FollowUpIdeas",
  "SeoKeywords",
];

// Supported content types for text actions
export const TEXT_ACTION_SUPPORTED_TYPES = [
  "Script",
  "Title/Headline",
  "VideoHook",
  "ContentBrief",
  "MicroScript",
  "VoiceToScript",
  "Hashtags",
  "Snippets",
  "RefinedText",
  "RepurposedContent",
  "VisualStoryboard",
  "MultiPlatformSnippets",
  "ExplainOutput",
  "FollowUpIdeas",
  "SeoKeywords",
  "OptimizePrompt",
  "YouTubeDescription",
  "TranslateAdapt",
  "CheckReadability",
];

// Supported content types for hashtag generation
export const HASHTAG_GENERATION_SUPPORTED_TYPES = [
  "Script",
  "Title/Headline",
  "VideoHook",
  "ContentBrief",
  "MicroScript",
  "VoiceToScript",
  "Hashtags",
  "Snippets",
  "RefinedText",
  "RepurposedContent",
  "VisualStoryboard",
  "MultiPlatformSnippets",
  "FollowUpIdeas",
  "SeoKeywords",
  "OptimizePrompt",
  "YouTubeDescription",
  "TranslateAdapt",
  "CheckReadability",
];

// Supported content types for snippet extraction
export const SNIPPET_EXTRACTION_SUPPORTED_TYPES = [
  "Script",
  "Title/Headline",
  "VideoHook",
  "ContentBrief",
  "MicroScript",
  "VoiceToScript",
  "Hashtags",
  "Snippets",
  "RefinedText",
  "RepurposedContent",
  "VisualStoryboard",
  "MultiPlatformSnippets",
  "FollowUpIdeas",
  "SeoKeywords",
  "OptimizePrompt",
  "YouTubeDescription",
  "TranslateAdapt",
  "CheckReadability",
];

// Supported content types for repurposing
export const REPURPOSING_SUPPORTED_TYPES = [
  "Script",
  "Title/Headline",
  "VideoHook",
  "ContentBrief",
  "MicroScript",
  "VoiceToScript",
  "Hashtags",
  "Snippets",
  "RefinedText",
  "RepurposedContent",
  "VisualStoryboard",
  "MultiPlatformSnippets",
  "FollowUpIdeas",
  "SeoKeywords",
  "OptimizePrompt",
  "YouTubeDescription",
  "TranslateAdapt",
  "CheckReadability",
];

// A/B testable content types map
export const AB_TESTABLE_CONTENT_TYPES_MAP = {
  "Title/Headline": {
    name: "Title/Headline",
    description: "Test different titles or headlines",
  },
  VideoHook: {
    name: "Engaging VideoHook",
    description: "Test different video hooks",
  },
  ThumbnailConcept: {
    name: "Thumbnail Concept",
    description: "Test different thumbnail concepts",
  },
};

// Supported content types for visual storyboard
export const VISUAL_STORYBOARD_SUPPORTED_TYPES = [
  "Script",
  "Title/Headline",
  "VideoHook",
  "ContentBrief",
  "MicroScript",
  "VoiceToScript",
  "Hashtags",
  "Snippets",
  "RefinedText",
  "RepurposedContent",
  "VisualStoryboard",
  "MultiPlatformSnippets",
  "FollowUpIdeas",
  "SeoKeywords",
  "OptimizePrompt",
  "YouTubeDescription",
  "TranslateAdapt",
  "CheckReadability",
];

// Supported content types for explain output
export const EXPLAIN_OUTPUT_SUPPORTED_TYPES = [
  "Script",
  "Title/Headline",
  "VideoHook",
  "ContentBrief",
  "MicroScript",
  "VoiceToScript",
  "Hashtags",
  "Snippets",
  "RefinedText",
  "RepurposedContent",
  "VisualStoryboard",
  "MultiPlatformSnippets",
  "FollowUpIdeas",
  "SeoKeywords",
  "OptimizePrompt",
  "YouTubeDescription",
  "TranslateAdapt",
  "CheckReadability",
];

// Supported content types for follow-up ideas
export const FOLLOW_UP_IDEAS_SUPPORTED_TYPES = [
  "Script",
  "Title/Headline",
  "VideoHook",
  "ContentBrief",
  "MicroScript",
  "VoiceToScript",
  "Hashtags",
  "Snippets",
  "RefinedText",
  "RepurposedContent",
  "VisualStoryboard",
  "MultiPlatformSnippets",
  "FollowUpIdeas",
  "SeoKeywords",
  "OptimizePrompt",
  "YouTubeDescription",
  "TranslateAdapt",
  "CheckReadability",
];

// Video editing extensions
export const VIDEO_EDITING_EXTENSIONS = [
  ".mp4",
  ".mov",
  ".avi",
  ".wmv",
  ".flv",
  ".mkv",
];

// Supported languages
export const SUPPORTED_LANGUAGES: { value: Language; label: string }[] = [
  { value: Language.English, label: "English" },
  { value: Language.Spanish, label: "Español (Spanish)" },
  { value: Language.French, label: "Français (French)" },
  { value: Language.German, label: "Deutsch (German)" },
  { value: Language.MandarinChinese, label: "中文 (Mandarin Chinese)" },
  { value: Language.Hindi, label: "हिन्दी (Hindi)" },
  { value: Language.Japanese, label: "日本語 (Japanese)" },
  { value: Language.Portuguese, label: "Português (Portuguese)" },
  { value: Language.Russian, label: "Русский (Russian)" },
  { value: Language.Arabic, label: "العربية (Arabic)" },
];

// Aspect ratio guidance options
export const ASPECT_RATIO_GUIDANCE_OPTIONS = Object.values(AspectRatioGuidance);

// Canvas shape variants
export const CANVAS_SHAPE_VARIANTS = [
  {
    value: "rectangle",
    label: "Rectangle",
    category: "Basic Shapes",
    icon: "⬜",
  },
  {
    value: "roundedRectangle",
    label: "Rounded Rectangle",
    category: "Basic Shapes",
    icon: "▢",
  },
  { value: "circle", label: "Circle", category: "Basic Shapes", icon: "⚪" },
  { value: "ellipse", label: "Ellipse", category: "Basic Shapes", icon: "⭕" },
  {
    value: "triangle",
    label: "Triangle",
    category: "Basic Shapes",
    icon: "🔺",
  },
  { value: "diamond", label: "Diamond", category: "Basic Shapes", icon: "🔷" },
  { value: "hexagon", label: "Hexagon", category: "Basic Shapes", icon: "⬢" },
  { value: "pentagon", label: "Pentagon", category: "Basic Shapes", icon: "⬟" },
  { value: "octagon", label: "Octagon", category: "Basic Shapes", icon: "⬢" },
  {
    value: "parallelogram",
    label: "Parallelogram",
    category: "Basic Shapes",
    icon: "▱",
  },
  {
    value: "trapezoid",
    label: "Trapezoid",
    category: "Basic Shapes",
    icon: "▿",
  },
  { value: "rightArrow", label: "Right Arrow", category: "Arrows", icon: "➡️" },
  { value: "leftArrow", label: "Left Arrow", category: "Arrows", icon: "⬅️" },
  { value: "upArrow", label: "Up Arrow", category: "Arrows", icon: "⬆️" },
  { value: "downArrow", label: "Down Arrow", category: "Arrows", icon: "⬇️" },
  {
    value: "doubleArrow",
    label: "Double Arrow",
    category: "Arrows",
    icon: "↔️",
  },
  { value: "star", label: "Star", category: "Symbols", icon: "⭐" },
  { value: "heart", label: "Heart", category: "Symbols", icon: "❤️" },
  { value: "cloud", label: "Cloud", category: "Symbols", icon: "☁️" },
  { value: "lightning", label: "Lightning", category: "Symbols", icon: "⚡" },
  { value: "shield", label: "Shield", category: "Symbols", icon: "🛡️" },
  { value: "gear", label: "Gear", category: "Symbols", icon: "⚙️" },
  { value: "plus", label: "Plus", category: "Symbols", icon: "➕" },
  { value: "cross", label: "Cross", category: "Symbols", icon: "❌" },
  {
    value: "speechBubble",
    label: "Speech Bubble",
    category: "Communication",
    icon: "💬",
  },
  { value: "bell", label: "Bell", category: "Icons", icon: "🔔" },
  { value: "location", label: "Location", category: "Icons", icon: "📍" },
  { value: "home", label: "Home", category: "Icons", icon: "🏠" },
  { value: "user", label: "User", category: "Icons", icon: "👤" },
  { value: "checkmark", label: "Checkmark", category: "Icons", icon: "✅" },
  { value: "x", label: "X Mark", category: "Icons", icon: "❌" },
  { value: "info", label: "Info", category: "Icons", icon: "ℹ️" },
  { value: "warning", label: "Warning", category: "Icons", icon: "⚠️" },
  { value: "folder", label: "Folder", category: "Files", icon: "📁" },
  { value: "file", label: "File", category: "Files", icon: "📄" },
  { value: "link", label: "Link", category: "Tech", icon: "🔗" },
  { value: "eye", label: "Eye", category: "Tech", icon: "👁️" },
  { value: "lock", label: "Lock", category: "Tech", icon: "🔒" },
  { value: "key", label: "Key", category: "Tech", icon: "🔑" },
  { value: "mail", label: "Mail", category: "Communication", icon: "📧" },
  { value: "phone", label: "Phone", category: "Communication", icon: "📞" },
  { value: "calendar", label: "Calendar", category: "Time", icon: "📅" },
  { value: "clock", label: "Clock", category: "Time", icon: "🕐" },
  { value: "search", label: "Search", category: "Tech", icon: "🔍" },
  { value: "settings", label: "Settings", category: "Tech", icon: "⚙️" },
  { value: "camera", label: "Camera", category: "Media", icon: "📸" },
  { value: "image", label: "Image", category: "Media", icon: "🖼️" },
  { value: "video", label: "Video", category: "Media", icon: "🎥" },
  { value: "music", label: "Music", category: "Media", icon: "🎵" },
  { value: "volume", label: "Volume", category: "Media", icon: "🔊" },
  { value: "wifi", label: "WiFi", category: "Tech", icon: "📶" },
  { value: "battery", label: "Battery", category: "Tech", icon: "🔋" },
  { value: "download", label: "Download", category: "Actions", icon: "⬇️" },
  { value: "upload", label: "Upload", category: "Actions", icon: "⬆️" },
  { value: "refresh", label: "Refresh", category: "Actions", icon: "🔄" },
  { value: "bookmark", label: "Bookmark", category: "Actions", icon: "🔖" },
  { value: "tag", label: "Tag", category: "Actions", icon: "🏷️" },
  { value: "paperclip", label: "Paperclip", category: "Actions", icon: "📎" },
] as const;

// Canvas font families
export const CANVAS_FONT_FAMILIES = [
  "Arial",
  "Verdana",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Impact",
] as const;

// Canvas preset colors
export const CANVAS_PRESET_COLORS = [
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#000000", // Black
  "#FFFFFF", // White
  "#808080", // Gray
  "#800000", // Maroon
  "#808000", // Olive
  "#008000", // Dark Green
  "#800080", // Purple
  "#008080", // Teal
  "#000080", // Navy
];

// Platform colors
export const PLATFORM_COLORS = {
  YouTube: "#FF0000",
  TikTok: "#000000",
  Instagram: "#E1306C",
  Twitter: "#1DA1F2",
  LinkedIn: "#0077B5",
  Facebook: "#1877F2",
};

// SEO keyword suggestion supported types
export const SEO_KEYWORD_SUGGESTION_SUPPORTED_TYPES =
  TEXT_ACTION_SUPPORTED_TYPES;

// Multi-platform repurposing supported types
export const MULTI_PLATFORM_REPURPOSING_SUPPORTED_TYPES =
  TEXT_ACTION_SUPPORTED_TYPES;

// YouTube description optimizer supported types
export const YOUTUBE_DESCRIPTION_OPTIMIZER_SUPPORTED_TYPES =
  TEXT_ACTION_SUPPORTED_TYPES;

// Translate adapt supported types
export const TRANSLATE_ADAPT_SUPPORTED_TYPES = TEXT_ACTION_SUPPORTED_TYPES;

// Readability check supported types
export const READABILITY_CHECK_SUPPORTED_TYPES = TEXT_ACTION_SUPPORTED_TYPES;

// Engagement feedback supported types
export const ENGAGEMENT_FEEDBACK_SUPPORTED_TYPES = TEXT_ACTION_SUPPORTED_TYPES;
