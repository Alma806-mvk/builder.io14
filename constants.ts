import {
  Platform,
  ContentType,
  IMAGE_PROMPT_STYLES,
  IMAGE_PROMPT_MOODS,
  ABTestableContentType,
  SeoKeywordMode,
  AiPersonaDefinition,
  DefaultAiPersonaEnum,
  Language,
  AspectRatioGuidance,
  ShapeVariant,
  FontFamily,
} from "./types";

export const PLATFORMS: Platform[] = [
  Platform.YouTube,
  Platform.TikTok,
  Platform.Instagram,
  Platform.Twitter,
  Platform.LinkedIn,
  Platform.Facebook,
];

export const CONTENT_TYPES: {
  value: ContentType;
  label: string;
  isUserSelectable: boolean;
  description?: string;
}[] = [
  {
    value: ContentType.Idea,
    label: "Content Idea",
    isUserSelectable: true,
    description: "Brainstorm unique and engaging content ideas.",
  },
  {
    value: ContentType.Script,
    label: "Script",
    isUserSelectable: true,
    description: "Generate a compelling video script.",
  },
  {
    value: ContentType.Title,
    label: "Title/Headline",
    isUserSelectable: true,
    description: "Craft catchy and effective titles.",
  },
  {
    value: ContentType.ImagePrompt,
    label: "Image Prompt (for AI)",
    isUserSelectable: true,
    description: "Create detailed text prompts for AI image generators.",
  },
  {
    value: ContentType.Image,
    label: "Generate Image",
    isUserSelectable: true,
    description: "Directly generate an image from a text prompt.",
  },
  {
    value: ContentType.VideoHook,
    label: "Engaging Video Hook",
    isUserSelectable: true,
    description: "Create attention-grabbing video intros (first 3-10 seconds).",
  },
  {
    value: ContentType.ThumbnailConcept,
    label: "Thumbnail Concept",
    isUserSelectable: true,
    description: "Get ideas for thumbnail visuals and text overlays.",
  },
  // { value: ContentType.TrendingTopics, label: 'Trending Topics (via Search)', isUserSelectable: true, description: "Discover trending topics using Google Search grounding." }, // Replaced
  {
    value: ContentType.TrendAnalysis,
    label: "Trend Analysis (via Search)",
    isUserSelectable: false,
    description:
      "Analyze trends, news, and questions for a niche using Google Search.",
  },
  {
    value: ContentType.ContentBrief,
    label: "Content Brief",
    isUserSelectable: true,
    description:
      "Generate a structured brief for content planning (angles, messages, CTAs).",
  },
  {
    value: ContentType.PollsQuizzes,
    label: "Polls & Quizzes",
    isUserSelectable: true,
    description: "Create engaging poll questions or short quiz ideas.",
  },
  {
    value: ContentType.ContentGapFinder,
    label: "Content Gap Finder (via Search)",
    isUserSelectable: true,
    description:
      "Identify underserved topics in your niche using Google Search.",
  },
  {
    value: ContentType.MicroScript,
    label: "Micro-Video Script",
    isUserSelectable: true,
    description:
      "Generate short, structured scripts (Hook, Points, CTA) for TikTok, Reels, etc.",
  },
  {
    value: ContentType.VoiceToScript,
    label: "Voice-to-Script (AI Enhanced)",
    isUserSelectable: true,
    description: "Transcribe your voice and AI-enhance it into a script.",
  },
  {
    value: ContentType.ChannelAnalysis,
    label: "YouTube Channel Analysis",
    isUserSelectable: true,
    description:
      "Analyze YouTube channels and find content gaps related to them (uses Search).",
  },
  {
    value: ContentType.ABTest,
    label: "A/B Test Variations",
    isUserSelectable: true,
    description:
      "Generate multiple variations of content for testing (e.g. Titles, Hooks, Thumbnails).",
  },
  {
    value: ContentType.ContentStrategyPlan,
    label: "Content Strategy Plan",
    isUserSelectable: false,
    description:
      "Develop a strategic content plan with pillars, themes, and a schedule.",
  },
  {
    value: ContentType.YoutubeChannelStats,
    label: "YouTube Channel Stats",
    isUserSelectable: false,
    description:
      "Get key statistics for a YouTube channel (videos, subs, views, join date, location).",
  },

  {
    value: ContentType.EngagementFeedback,
    label: "AI Engagement Feedback (Experimental)",
    isUserSelectable: false,
    description:
      "Get AI-driven qualitative feedback on content's engagement potential.",
  }, // Not user selectable, an action
  { value: ContentType.Hashtags, label: "Hashtags", isUserSelectable: false },
  { value: ContentType.Snippets, label: "Snippets", isUserSelectable: false },
  {
    value: ContentType.RefinedText,
    label: "Refined Text",
    isUserSelectable: false,
  },
  {
    value: ContentType.RepurposedContent,
    label: "Repurposed Content",
    isUserSelectable: false,
  },
  {
    value: ContentType.VisualStoryboard,
    label: "Visual Storyboard",
    isUserSelectable: false,
  },
  {
    value: ContentType.MultiPlatformSnippets,
    label: "Multi-Platform Snippets",
    isUserSelectable: false,
  },
  {
    value: ContentType.ExplainOutput,
    label: "Explain Output",
    isUserSelectable: false,
  },
  {
    value: ContentType.FollowUpIdeas,
    label: "Follow-Up Ideas",
    isUserSelectable: false,
  },
  {
    value: ContentType.SeoKeywords,
    label: "SEO Keywords",
    isUserSelectable: false,
  },
  {
    value: ContentType.OptimizePrompt,
    label: "Optimize Prompt",
    isUserSelectable: false,
  },
  {
    value: ContentType.YouTubeDescription,
    label: "YouTube Description",
    isUserSelectable: false,
  },
  {
    value: ContentType.TranslateAdapt,
    label: "Translate & Adapt",
    isUserSelectable: false,
  },
  {
    value: ContentType.CheckReadability,
    label: "Check Readability",
    isUserSelectable: false,
  },
  {
    value: ContentType.TrendingTopics,
    label: "Old Trending Topics",
    isUserSelectable: false,
  }, // Keep for type safety if old history items exist
];

export const USER_SELECTABLE_CONTENT_TYPES = CONTENT_TYPES.filter(
  (ct) => ct.isUserSelectable,
);

export const AB_TESTABLE_CONTENT_TYPES_MAP: {
  value: ABTestableContentType;
  label: string;
}[] = [
  { value: ABTestableContentType.Title, label: "Titles/Headlines" },
  { value: ABTestableContentType.VideoHook, label: "Video Hooks" },
  {
    value: ABTestableContentType.ThumbnailConcept,
    label: "Thumbnail Concepts",
  },
];

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";
export const GEMINI_IMAGE_MODEL = "imagen-3.0-generate-002";

export const DEFAULT_USER_INPUT_PLACEHOLDERS: Record<ContentType, string> = {
  [ContentType.Idea]:
    "Enter a topic or keywords for content ideas (e.g., 'healthy breakfast recipes', 'travel vlogging tips')...",
  [ContentType.Script]:
    "Enter a topic or specific requirements for a script (e.g., '5-minute unboxing video for a new gadget')...",
  [ContentType.Title]:
    "Enter a topic or keywords for titles/headlines (e.g., 'my trip to Bali', 'easy Python tutorial')...",
  [ContentType.ImagePrompt]:
    "Describe the core concept for an image prompt (e.g., 'a futuristic cityscape at dawn'). Use style/mood selectors below for more detail. Add negative prompts if needed.",
  [ContentType.Image]:
    "Enter a detailed prompt for image generation (e.g., 'a majestic lion wearing a crown, photorealistic style'). Add negative prompts if needed.",
  [ContentType.VideoHook]:
    "Enter the main topic or theme of your video to generate captivating hooks (e.g., 'surprising travel hacks')...",
  [ContentType.ThumbnailConcept]:
    "Describe your video's content to get thumbnail ideas (e.g., 'my epic drone flight over mountains')...",
  [ContentType.TrendAnalysis]:
    "Enter a niche, industry, or general theme to analyze current trends (e.g., 'AI in healthcare', 'sustainable living trends')...",
  [ContentType.ABTest]:
    "Enter the topic for A/B testing. You'll select the specific type (e.g., Title, Hook) below.",
  [ContentType.ContentBrief]:
    "Enter main topic for a content brief (e.g., 'launching a podcast', 'beginner's guide to crypto')...",
  [ContentType.PollsQuizzes]:
    "Enter topic for polls or quiz questions (e.g., 'favorite travel destinations', 'movie trivia')...",
  [ContentType.ContentGapFinder]:
    "Enter your niche or primary content themes (e.g., 'home gardening for beginners', 'digital marketing trends')...",
  [ContentType.MicroScript]:
    "Enter topic for a short micro-video script (e.g., 'one quick cooking tip', 'a surprising fact')...",
  [ContentType.VoiceToScript]:
    "Click 'Start Recording' below, or paste transcribed text here for AI enhancement...",
  [ContentType.ChannelAnalysis]:
    "Enter YouTube channel names or URLs (comma-separated) to analyze for content gaps...",
  [ContentType.ContentStrategyPlan]:
    "Define your primary niche, main goals (e.g., audience growth, engagement), and target platforms for a strategic content plan...",
  [ContentType.YoutubeChannelStats]:
    "Enter a YouTube channel name or URL to get its statistics (e.g., 'LinusTechTips', '@MrBeast')...",

  // Non-user-selectable placeholders (can be empty or specific if an action implies a default input)
  [ContentType.EngagementFeedback]: "",
  [ContentType.Hashtags]: "",
  [ContentType.Snippets]: "",
  [ContentType.RefinedText]: "",
  [ContentType.RepurposedContent]: "",
  [ContentType.VisualStoryboard]: "",
  [ContentType.MultiPlatformSnippets]: "",
  [ContentType.ExplainOutput]: "",
  [ContentType.FollowUpIdeas]: "",
  [ContentType.SeoKeywords]: "",
  [ContentType.OptimizePrompt]: "",
  [ContentType.YouTubeDescription]: "",
  [ContentType.TranslateAdapt]: "",
  [ContentType.CheckReadability]: "",
  [ContentType.TrendingTopics]: "", // Old, ensure it exists
};

export const BATCH_SUPPORTED_TYPES: ContentType[] = [
  ContentType.Idea,
  ContentType.Title,
  ContentType.ImagePrompt,
  ContentType.VideoHook,
  ContentType.PollsQuizzes,
];

export const TEXT_ACTION_SUPPORTED_TYPES: ContentType[] = [
  ContentType.Script,
  ContentType.Idea,
  ContentType.Title,
  ContentType.ImagePrompt,
  ContentType.VideoHook,
  ContentType.ThumbnailConcept,
  ContentType.TrendAnalysis,
  ContentType.ContentBrief,
  ContentType.PollsQuizzes,
  ContentType.ContentGapFinder,
  ContentType.MicroScript,
  ContentType.VoiceToScript,
  ContentType.ChannelAnalysis,
  ContentType.ContentStrategyPlan,
  ContentType.EngagementFeedback,
  ContentType.RefinedText,
  ContentType.RepurposedContent,
  ContentType.Hashtags,
  ContentType.Snippets,
  ContentType.ExplainOutput,
  ContentType.FollowUpIdeas,
  ContentType.SeoKeywords,
  ContentType.VisualStoryboard,
  ContentType.MultiPlatformSnippets,
  ContentType.YouTubeDescription,
  ContentType.TranslateAdapt,
  ContentType.CheckReadability,
];

export const HASHTAG_GENERATION_SUPPORTED_TYPES: ContentType[] = [
  ContentType.Script,
  ContentType.Idea,
  ContentType.Title,
  ContentType.ThumbnailConcept,
  ContentType.MicroScript,
  ContentType.ContentBrief,
  ContentType.VoiceToScript,
  ContentType.ChannelAnalysis,
  ContentType.ContentStrategyPlan,
  ContentType.TrendAnalysis,
];
export const SNIPPET_EXTRACTION_SUPPORTED_TYPES: ContentType[] = [
  ContentType.Script,
  ContentType.Idea,
  ContentType.ContentBrief,
  ContentType.MicroScript,
  ContentType.VoiceToScript,
  ContentType.ChannelAnalysis,
  ContentType.ContentStrategyPlan,
  ContentType.TrendAnalysis,
];
export const REPURPOSING_SUPPORTED_TYPES: ContentType[] = [
  ContentType.Script,
  ContentType.Idea,
  ContentType.Title,
  ContentType.ContentBrief,
  ContentType.MicroScript,
  ContentType.VoiceToScript,
  ContentType.ChannelAnalysis,
  ContentType.ContentStrategyPlan,
  ContentType.TrendAnalysis,
];
export const ENGAGEMENT_FEEDBACK_SUPPORTED_TYPES: ContentType[] = [
  ContentType.Title,
  ContentType.VideoHook,
  ContentType.MicroScript,
  ContentType.Script,
  ContentType.Snippets,
  ContentType.RefinedText,
  ContentType.YouTubeDescription,
];

export const VISUAL_STORYBOARD_SUPPORTED_TYPES: ContentType[] = [
  ContentType.Script,
  ContentType.MicroScript,
  ContentType.VoiceToScript,
];
export const EXPLAIN_OUTPUT_SUPPORTED_TYPES: ContentType[] =
  TEXT_ACTION_SUPPORTED_TYPES;
export const FOLLOW_UP_IDEAS_SUPPORTED_TYPES: ContentType[] = [
  ContentType.Idea,
  ContentType.Script,
  ContentType.Title,
  ContentType.ContentBrief,
  ContentType.MicroScript,
  ContentType.VoiceToScript,
  ContentType.ChannelAnalysis,
  ContentType.ContentStrategyPlan,
  ContentType.TrendAnalysis,
];
export const SEO_KEYWORD_SUGGESTION_SUPPORTED_TYPES: ContentType[] = [
  ContentType.Idea,
  ContentType.Script,
  ContentType.Title,
  ContentType.ContentBrief,
  ContentType.MicroScript,
  ContentType.VoiceToScript,
  ContentType.ChannelAnalysis,
  ContentType.ContentStrategyPlan,
  ContentType.TrendAnalysis,
];
export const MULTI_PLATFORM_REPURPOSING_SUPPORTED_TYPES: ContentType[] = [
  ContentType.Script,
  ContentType.Idea,
  ContentType.Title,
  ContentType.ContentBrief,
  ContentType.VoiceToScript,
  ContentType.ChannelAnalysis,
  ContentType.ContentStrategyPlan,
  ContentType.TrendAnalysis,
];
export const YOUTUBE_DESCRIPTION_OPTIMIZER_SUPPORTED_TYPES: ContentType[] = [
  ContentType.Script,
  ContentType.Title,
  ContentType.VideoHook,
  ContentType.VoiceToScript,
  ContentType.ChannelAnalysis,
];
export const TRANSLATE_ADAPT_SUPPORTED_TYPES: ContentType[] =
  TEXT_ACTION_SUPPORTED_TYPES;
export const READABILITY_CHECK_SUPPORTED_TYPES: ContentType[] =
  TEXT_ACTION_SUPPORTED_TYPES;

export const VIDEO_EDITING_EXTENSIONS: {
  label: string;
  value: string;
  software?: string;
  category?: string;
}[] = [
  { label: "Any File Type", value: "", category: "General" },

  // Video Editing Projects
  {
    label: "Premiere Pro Project (.prproj)",
    value: ".prproj",
    software: "Premiere Pro",
    category: "Video Projects",
  },
  {
    label: "Premiere Pro Preset (.prfpset)",
    value: ".prfpset",
    software: "Premiere Pro",
    category: "Video Projects",
  },
  {
    label: "After Effects Project (.aep)",
    value: ".aep",
    software: "After Effects",
    category: "Video Projects",
  },
  {
    label: "After Effects Preset (.ffx)",
    value: ".ffx",
    software: "After Effects",
    category: "Video Projects",
  },
  {
    label: "After Effects Template (.aet)",
    value: ".aet",
    software: "After Effects",
    category: "Video Projects",
  },
  {
    label: "Motion Graphics Template (.mogrt)",
    value: ".mogrt",
    software: "Premiere/AE",
    category: "Video Projects",
  },
  {
    label: "DaVinci Resolve Project (.drp)",
    value: ".drp",
    software: "DaVinci Resolve",
    category: "Video Projects",
  },
  {
    label: "Final Cut Pro Project (.fcpproject)",
    value: ".fcpproject",
    software: "Final Cut Pro",
    category: "Video Projects",
  },
  {
    label: "Final Cut Pro Library (.fcpbundle)",
    value: ".fcpbundle",
    software: "Final Cut Pro",
    category: "Video Projects",
  },
  {
    label: "Final Cut Pro Event (.fce)",
    value: ".fce",
    software: "Final Cut Pro",
    category: "Video Projects",
  },
  {
    label: "Avid Media Composer (.avp)",
    value: ".avp",
    software: "Avid Media Composer",
    category: "Video Projects",
  },
  {
    label: "Sony Vegas Project (.veg)",
    value: ".veg",
    software: "Sony Vegas",
    category: "Video Projects",
  },
  {
    label: "HitFilm Project (.hfp)",
    value: ".hfp",
    software: "HitFilm",
    category: "Video Projects",
  },
  {
    label: "Lightworks Project (.lwks)",
    value: ".lwks",
    software: "Lightworks",
    category: "Video Projects",
  },

  // Color Grading & LUTs
  {
    label: "LUT Cube (.cube)",
    value: ".cube",
    software: "Various NLEs",
    category: "Color Grading",
  },
  {
    label: "LUT Look (.look)",
    value: ".look",
    software: "Various NLEs",
    category: "Color Grading",
  },
  {
    label: "LUT 3DL (.3dl)",
    value: ".3dl",
    software: "Various NLEs",
    category: "Color Grading",
  },
  {
    label: "LUT CSP (.csp)",
    value: ".csp",
    software: "Various NLEs",
    category: "Color Grading",
  },
  {
    label: "LUT ICC (.icc)",
    value: ".icc",
    software: "Various NLEs",
    category: "Color Grading",
  },
  {
    label: "DaVinci Resolve LUT (.dctl)",
    value: ".dctl",
    software: "DaVinci Resolve",
    category: "Color Grading",
  },
  {
    label: "Color Preset (.preset)",
    value: ".preset",
    software: "Various",
    category: "Color Grading",
  },

  // Video Assets
  {
    label: "Video File (.mp4)",
    value: ".mp4",
    software: "Video Asset",
    category: "Video Assets",
  },
  {
    label: "Video File (.mov)",
    value: ".mov",
    software: "Video Asset",
    category: "Video Assets",
  },
  {
    label: "Video File (.avi)",
    value: ".avi",
    software: "Video Asset",
    category: "Video Assets",
  },
  {
    label: "Video File (.mkv)",
    value: ".mkv",
    software: "Video Asset",
    category: "Video Assets",
  },
  {
    label: "Video File (.wmv)",
    value: ".wmv",
    software: "Video Asset",
    category: "Video Assets",
  },
  {
    label: "Video File (.webm)",
    value: ".webm",
    software: "Video Asset",
    category: "Video Assets",
  },
  {
    label: "Video File (.flv)",
    value: ".flv",
    software: "Video Asset",
    category: "Video Assets",
  },
  {
    label: "ProRes (.prores)",
    value: ".prores",
    software: "Video Asset",
    category: "Video Assets",
  },
  {
    label: "DNxHD (.dnxhd)",
    value: ".dnxhd",
    software: "Video Asset",
    category: "Video Assets",
  },

  // Audio Assets
  {
    label: "Audio File (.wav)",
    value: ".wav",
    software: "Audio Asset",
    category: "Audio Assets",
  },
  {
    label: "Audio File (.mp3)",
    value: ".mp3",
    software: "Audio Asset",
    category: "Audio Assets",
  },
  {
    label: "Audio File (.aac)",
    value: ".aac",
    software: "Audio Asset",
    category: "Audio Assets",
  },
  {
    label: "Audio File (.flac)",
    value: ".flac",
    software: "Audio Asset",
    category: "Audio Assets",
  },
  {
    label: "Audio File (.aiff)",
    value: ".aiff",
    software: "Audio Asset",
    category: "Audio Assets",
  },
  {
    label: "Audio File (.ogg)",
    value: ".ogg",
    software: "Audio Asset",
    category: "Audio Assets",
  },
  {
    label: "Stem Track (.stem)",
    value: ".stem",
    software: "Music Production",
    category: "Audio Assets",
  },

  // Audio Project Files
  {
    label: "Logic Pro Project (.logicx)",
    value: ".logicx",
    software: "Logic Pro",
    category: "Audio Projects",
  },
  {
    label: "Pro Tools Session (.ptx)",
    value: ".ptx",
    software: "Pro Tools",
    category: "Audio Projects",
  },
  {
    label: "Ableton Live Set (.als)",
    value: ".als",
    software: "Ableton Live",
    category: "Audio Projects",
  },
  {
    label: "FL Studio Project (.flp)",
    value: ".flp",
    software: "FL Studio",
    category: "Audio Projects",
  },
  {
    label: "Cubase Project (.cpr)",
    value: ".cpr",
    software: "Cubase",
    category: "Audio Projects",
  },
  {
    label: "Reaper Project (.rpp)",
    value: ".rpp",
    software: "Reaper",
    category: "Audio Projects",
  },
  {
    label: "Studio One Song (.song)",
    value: ".song",
    software: "Studio One",
    category: "Audio Projects",
  },

  // Graphics & Design
  {
    label: "Photoshop File (.psd)",
    value: ".psd",
    software: "Photoshop",
    category: "Graphics",
  },
  {
    label: "Illustrator File (.ai)",
    value: ".ai",
    software: "Illustrator",
    category: "Graphics",
  },
  {
    label: "InDesign File (.indd)",
    value: ".indd",
    software: "InDesign",
    category: "Graphics",
  },
  {
    label: "Sketch File (.sketch)",
    value: ".sketch",
    software: "Sketch",
    category: "Graphics",
  },
  {
    label: "Figma File (.fig)",
    value: ".fig",
    software: "Figma",
    category: "Graphics",
  },
  {
    label: "XD File (.xd)",
    value: ".xd",
    software: "Adobe XD",
    category: "Graphics",
  },
  {
    label: "GIMP File (.xcf)",
    value: ".xcf",
    software: "GIMP",
    category: "Graphics",
  },
  {
    label: "Affinity Designer (.afdesign)",
    value: ".afdesign",
    software: "Affinity Designer",
    category: "Graphics",
  },
  {
    label: "Affinity Photo (.afphoto)",
    value: ".afphoto",
    software: "Affinity Photo",
    category: "Graphics",
  },
  {
    label: "Canva Design (.canva)",
    value: ".canva",
    software: "Canva",
    category: "Graphics",
  },

  // Image Assets
  {
    label: "PNG Image (.png)",
    value: ".png",
    software: "Image Asset",
    category: "Image Assets",
  },
  {
    label: "JPEG Image (.jpg)",
    value: ".jpg",
    software: "Image Asset",
    category: "Image Assets",
  },
  {
    label: "TIFF Image (.tiff)",
    value: ".tiff",
    software: "Image Asset",
    category: "Image Assets",
  },
  {
    label: "RAW Image (.raw)",
    value: ".raw",
    software: "Image Asset",
    category: "Image Assets",
  },
  {
    label: "SVG Vector (.svg)",
    value: ".svg",
    software: "Vector Asset",
    category: "Image Assets",
  },
  {
    label: "EPS Vector (.eps)",
    value: ".eps",
    software: "Vector Asset",
    category: "Image Assets",
  },
  {
    label: "WebP Image (.webp)",
    value: ".webp",
    software: "Image Asset",
    category: "Image Assets",
  },
  {
    label: "HEIC Image (.heic)",
    value: ".heic",
    software: "Image Asset",
    category: "Image Assets",
  },
  {
    label: "BMP Image (.bmp)",
    value: ".bmp",
    software: "Image Asset",
    category: "Image Assets",
  },
  {
    label: "OpenEXR (.exr)",
    value: ".exr",
    software: "VFX Asset",
    category: "Image Assets",
  },

  // 3D & Motion Graphics
  {
    label: "Cinema 4D Project (.c4d)",
    value: ".c4d",
    software: "Cinema 4D",
    category: "3D Assets",
  },
  {
    label: "Blender Project (.blend)",
    value: ".blend",
    software: "Blender",
    category: "3D Assets",
  },
  {
    label: "Maya Scene (.ma)",
    value: ".ma",
    software: "Maya",
    category: "3D Assets",
  },
  {
    label: "Maya Binary (.mb)",
    value: ".mb",
    software: "Maya",
    category: "3D Assets",
  },
  {
    label: "3ds Max Scene (.max)",
    value: ".max",
    software: "3ds Max",
    category: "3D Assets",
  },
  {
    label: "FBX Model (.fbx)",
    value: ".fbx",
    software: "3D Model",
    category: "3D Assets",
  },
  {
    label: "OBJ Model (.obj)",
    value: ".obj",
    software: "3D Model",
    category: "3D Assets",
  },
  {
    label: "Collada (.dae)",
    value: ".dae",
    software: "3D Model",
    category: "3D Assets",
  },
  {
    label: "glTF Model (.gltf)",
    value: ".gltf",
    software: "3D Model",
    category: "3D Assets",
  },
  {
    label: "STL Model (.stl)",
    value: ".stl",
    software: "3D Model",
    category: "3D Assets",
  },
  {
    label: "Element 3D (.e3d)",
    value: ".e3d",
    software: "Element 3D",
    category: "3D Assets",
  },

  // Fonts & Typography
  {
    label: "OpenType Font (.otf)",
    value: ".otf",
    software: "Font Asset",
    category: "Fonts",
  },
  {
    label: "TrueType Font (.ttf)",
    value: ".ttf",
    software: "Font Asset",
    category: "Fonts",
  },
  {
    label: "Web Font (.woff)",
    value: ".woff",
    software: "Font Asset",
    category: "Fonts",
  },
  {
    label: "Web Font 2 (.woff2)",
    value: ".woff2",
    software: "Font Asset",
    category: "Fonts",
  },
  {
    label: "PostScript Font (.pfb)",
    value: ".pfb",
    software: "Font Asset",
    category: "Fonts",
  },
  {
    label: "Font Collection (.ttc)",
    value: ".ttc",
    software: "Font Asset",
    category: "Fonts",
  },

  // Plugins & Extensions
  {
    label: "After Effects Plugin (.aex)",
    value: ".aex",
    software: "After Effects",
    category: "Plugins",
  },
  {
    label: "Premiere Pro Plugin (.prm)",
    value: ".prm",
    software: "Premiere Pro",
    category: "Plugins",
  },
  {
    label: "VST Plugin (.vst)",
    value: ".vst",
    software: "Audio Plugin",
    category: "Plugins",
  },
  {
    label: "VST3 Plugin (.vst3)",
    value: ".vst3",
    software: "Audio Plugin",
    category: "Plugins",
  },
  {
    label: "AU Plugin (.component)",
    value: ".component",
    software: "Audio Unit",
    category: "Plugins",
  },
  {
    label: "RTAS Plugin (.rtas)",
    value: ".rtas",
    software: "Pro Tools",
    category: "Plugins",
  },
  {
    label: "AAX Plugin (.aax)",
    value: ".aax",
    software: "Pro Tools",
    category: "Plugins",
  },
  {
    label: "OFX Plugin (.ofx)",
    value: ".ofx",
    software: "Visual Effects",
    category: "Plugins",
  },

  // Presets & Templates
  {
    label: "Lightroom Preset (.lrtemplate)",
    value: ".lrtemplate",
    software: "Lightroom",
    category: "Presets",
  },
  {
    label: "Lightroom XMP (.xmp)",
    value: ".xmp",
    software: "Lightroom",
    category: "Presets",
  },
  {
    label: "Capture One Style (.costyle)",
    value: ".costyle",
    software: "Capture One",
    category: "Presets",
  },
  {
    label: "Photoshop Action (.atn)",
    value: ".atn",
    software: "Photoshop",
    category: "Presets",
  },
  {
    label: "Photoshop Brush (.abr)",
    value: ".abr",
    software: "Photoshop",
    category: "Presets",
  },
  {
    label: "Photoshop Style (.asl)",
    value: ".asl",
    software: "Photoshop",
    category: "Presets",
  },
  {
    label: "Photoshop Pattern (.pat)",
    value: ".pat",
    software: "Photoshop",
    category: "Presets",
  },
  {
    label: "InDesign Template (.indt)",
    value: ".indt",
    software: "InDesign",
    category: "Presets",
  },

  // Exchange Formats
  {
    label: "Final Cut XML (.fcpxml)",
    value: ".fcpxml",
    software: "Final Cut Pro",
    category: "Exchange",
  },
  {
    label: "AAF (.aaf)",
    value: ".aaf",
    software: "Avid Exchange",
    category: "Exchange",
  },
  {
    label: "OMF (.omf)",
    value: ".omf",
    software: "Audio Exchange",
    category: "Exchange",
  },
  {
    label: "XML (.xml)",
    value: ".xml",
    software: "Generic Exchange",
    category: "Exchange",
  },
  {
    label: "EDL (.edl)",
    value: ".edl",
    software: "Edit Decision List",
    category: "Exchange",
  },
  {
    label: "CMX EDL (.cmx)",
    value: ".cmx",
    software: "CMX Format",
    category: "Exchange",
  },
  {
    label: "ALE (.ale)",
    value: ".ale",
    software: "Avid Log Exchange",
    category: "Exchange",
  },

  // VFX & Compositing
  {
    label: "Nuke Script (.nk)",
    value: ".nk",
    software: "Nuke",
    category: "VFX",
  },
  {
    label: "Fusion Composition (.comp)",
    value: ".comp",
    software: "Fusion",
    category: "VFX",
  },
  {
    label: "Houdini Scene (.hip)",
    value: ".hip",
    software: "Houdini",
    category: "VFX",
  },
  {
    label: "Alembic Cache (.abc)",
    value: ".abc",
    software: "VFX Cache",
    category: "VFX",
  },
  {
    label: "USD File (.usd)",
    value: ".usd",
    software: "Universal Scene",
    category: "VFX",
  },

  // Animation
  {
    label: "Toon Boom Harmony (.xstage)",
    value: ".xstage",
    software: "Toon Boom",
    category: "Animation",
  },
  {
    label: "TVPaint Project (.tvpp)",
    value: ".tvpp",
    software: "TVPaint",
    category: "Animation",
  },
  {
    label: "OpenToonz Scene (.tnz)",
    value: ".tnz",
    software: "OpenToonz",
    category: "Animation",
  },
  {
    label: "Spine Project (.spine)",
    value: ".spine",
    software: "Spine",
    category: "Animation",
  },
  {
    label: "DragonBones Project (.dbproj)",
    value: ".dbproj",
    software: "DragonBones",
    category: "Animation",
  },

  // Game Development
  {
    label: "Unity Package (.unitypackage)",
    value: ".unitypackage",
    software: "Unity",
    category: "Game Dev",
  },
  {
    label: "Unity Scene (.unity)",
    value: ".unity",
    software: "Unity",
    category: "Game Dev",
  },
  {
    label: "Unreal Asset (.uasset)",
    value: ".uasset",
    software: "Unreal Engine",
    category: "Game Dev",
  },
  {
    label: "Unreal Map (.umap)",
    value: ".umap",
    software: "Unreal Engine",
    category: "Game Dev",
  },
  {
    label: "Godot Scene (.tscn)",
    value: ".tscn",
    software: "Godot",
    category: "Game Dev",
  },
  {
    label: "Godot Package (.pck)",
    value: ".pck",
    software: "Godot",
    category: "Game Dev",
  },

  // Documents & Scripts
  {
    label: "PDF Document (.pdf)",
    value: ".pdf",
    software: "Document",
    category: "Documents",
  },
  {
    label: "Word Document (.docx)",
    value: ".docx",
    software: "Microsoft Word",
    category: "Documents",
  },
  {
    label: "PowerPoint (.pptx)",
    value: ".pptx",
    software: "PowerPoint",
    category: "Documents",
  },
  {
    label: "Excel Spreadsheet (.xlsx)",
    value: ".xlsx",
    software: "Excel",
    category: "Documents",
  },
  {
    label: "Text File (.txt)",
    value: ".txt",
    software: "Text Editor",
    category: "Documents",
  },
  {
    label: "Rich Text (.rtf)",
    value: ".rtf",
    software: "Rich Text",
    category: "Documents",
  },
  {
    label: "Markdown (.md)",
    value: ".md",
    software: "Markdown",
    category: "Documents",
  },
  {
    label: "Script File (.jsx)",
    value: ".jsx",
    software: "ExtendScript",
    category: "Documents",
  },
  {
    label: "JavaScript (.js)",
    value: ".js",
    software: "JavaScript",
    category: "Documents",
  },
  {
    label: "JSON Data (.json)",
    value: ".json",
    software: "Data Format",
    category: "Documents",
  },
  {
    label: "CSV Data (.csv)",
    value: ".csv",
    software: "Data Format",
    category: "Documents",
  },

  // Archives & Packages
  {
    label: "ZIP Archive (.zip)",
    value: ".zip",
    software: "Archive",
    category: "Archives",
  },
  {
    label: "RAR Archive (.rar)",
    value: ".rar",
    software: "Archive",
    category: "Archives",
  },
  {
    label: "7-Zip Archive (.7z)",
    value: ".7z",
    software: "Archive",
    category: "Archives",
  },
  {
    label: "TAR Archive (.tar)",
    value: ".tar",
    software: "Archive",
    category: "Archives",
  },
  {
    label: "DMG Disk Image (.dmg)",
    value: ".dmg",
    software: "Mac Package",
    category: "Archives",
  },
  {
    label: "ISO Disk Image (.iso)",
    value: ".iso",
    software: "Disk Image",
    category: "Archives",
  },

  // Other Professional Formats
  {
    label: "Other/Custom Extension",
    value: "OTHER_EXTENSION",
    software: "Various",
    category: "Other",
  },
];

export const DEFAULT_AI_PERSONAS: AiPersonaDefinition[] = [
  {
    id: DefaultAiPersonaEnum.Default,
    name: "Default AI",
    systemInstruction: "You are a helpful and versatile AI assistant.",
    isCustom: false,
    description: "Standard, balanced AI persona.",
  },
  {
    id: DefaultAiPersonaEnum.ProfessionalExpert,
    name: "Professional Expert",
    systemInstruction:
      "You are a highly professional expert in your field. Your tone is formal, knowledgeable, and authoritative.",
    isCustom: false,
    description: "Formal, knowledgeable, and authoritative tone.",
  },
  {
    id: DefaultAiPersonaEnum.CasualFriend,
    name: "Casual & Witty Friend",
    systemInstruction:
      "You are a casual, witty, and friendly assistant. Your tone is informal, engaging, and often humorous.",
    isCustom: false,
    description: "Informal, friendly, humorous, and engaging.",
  },
  {
    id: DefaultAiPersonaEnum.CreativeStoryteller,
    name: "Creative Storyteller",
    systemInstruction:
      "You are an imaginative and creative storyteller. Your language is expressive and narrative-driven.",
    isCustom: false,
    description: "Imaginative, narrative-driven, and expressive.",
  },
  {
    id: DefaultAiPersonaEnum.DataDrivenAnalyst,
    name: "Data-Driven Analyst",
    systemInstruction:
      "You are a data-driven analyst. Your responses are factual, precise, and evidence-based.",
    isCustom: false,
    description: "Factual, precise, and evidence-based.",
  },
  {
    id: DefaultAiPersonaEnum.SarcasticCommentator,
    name: "Sarcastic Commentator",
    systemInstruction:
      "You are a sarcastic commentator with a dry wit. Your tone is ironic and slightly edgy.",
    isCustom: false,
    description: "Dry wit, ironic, and slightly edgy (use with caution!).",
  },
];

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

export const ASPECT_RATIO_GUIDANCE_OPTIONS: {
  value: AspectRatioGuidance;
  label: string;
}[] = [
  { value: AspectRatioGuidance.None, label: "None / Default" },
  { value: AspectRatioGuidance.SixteenNine, label: "16:9 (Wide Landscape)" },
  { value: AspectRatioGuidance.NineSixteen, label: "9:16 (Tall Portrait)" },
  { value: AspectRatioGuidance.OneOne, label: "1:1 (Square)" },
  { value: AspectRatioGuidance.FourFive, label: "4:5 (Portrait)" },
  { value: AspectRatioGuidance.ThreeTwo, label: "3:2 (Landscape Photo)" },
  { value: AspectRatioGuidance.TwoThree, label: "2:3 (Portrait Photo)" },
];

export const CANVAS_SHAPE_VARIANTS: {
  value: ShapeVariant;
  label: string;
  category: string;
  icon?: string;
}[] = [
  // Basic Shapes
  { value: "rectangle", label: "Rectangle", category: "Basic" },
  { value: "roundedRectangle", label: "Rounded Rectangle", category: "Basic" },
  { value: "circle", label: "Circle", category: "Basic" },
  { value: "ellipse", label: "Ellipse", category: "Basic" },
  { value: "triangle", label: "Triangle", category: "Basic" },
  { value: "diamond", label: "Diamond", category: "Basic" },
  { value: "hexagon", label: "Hexagon", category: "Basic" },
  { value: "pentagon", label: "Pentagon", category: "Basic" },
  { value: "octagon", label: "Octagon", category: "Basic" },
  { value: "parallelogram", label: "Parallelogram", category: "Basic" },
  { value: "trapezoid", label: "Trapezoid", category: "Basic" },

  // Arrows & Directional
  { value: "rightArrow", label: "Arrow Right", category: "Arrows" },
  { value: "leftArrow", label: "Arrow Left", category: "Arrows" },
  { value: "upArrow", label: "Arrow Up", category: "Arrows" },
  { value: "downArrow", label: "Arrow Down", category: "Arrows" },
  { value: "doubleArrow", label: "Double Arrow", category: "Arrows" },

  // Symbols & Icons
  { value: "star", label: "Star", category: "Symbols" },
  { value: "heart", label: "Heart", category: "Symbols" },
  { value: "cloud", label: "Cloud", category: "Symbols" },
  { value: "lightning", label: "Lightning", category: "Symbols" },
  { value: "shield", label: "Shield", category: "Symbols" },
  { value: "gear", label: "Gear", category: "Symbols" },
  { value: "plus", label: "Plus", category: "Symbols" },
  { value: "cross", label: "Cross", category: "Symbols" },
  { value: "checkmark", label: "Checkmark", category: "Symbols" },
  { value: "x", label: "X Mark", category: "Symbols" },

  // Communication
  { value: "speechBubble", label: "Speech Bubble", category: "Communication" },
  { value: "bell", label: "Notification", category: "Communication" },
  { value: "mail", label: "Email", category: "Communication" },
  { value: "phone", label: "Phone", category: "Communication" },

  // Interface Elements
  { value: "location", label: "Location Pin", category: "Interface" },
  { value: "home", label: "Home", category: "Interface" },
  { value: "user", label: "User", category: "Interface" },
  { value: "info", label: "Info", category: "Interface" },
  { value: "warning", label: "Warning", category: "Interface" },
  { value: "folder", label: "Folder", category: "Interface" },
  { value: "file", label: "File", category: "Interface" },
  { value: "link", label: "Link", category: "Interface" },
  { value: "eye", label: "Eye", category: "Interface" },
  { value: "lock", label: "Lock", category: "Interface" },
  { value: "key", label: "Key", category: "Interface" },
  { value: "search", label: "Search", category: "Interface" },
  { value: "settings", label: "Settings", category: "Interface" },

  // Media & Tech
  { value: "camera", label: "Camera", category: "Media" },
  { value: "image", label: "Image", category: "Media" },
  { value: "video", label: "Video", category: "Media" },
  { value: "music", label: "Music", category: "Media" },
  { value: "volume", label: "Volume", category: "Media" },
  { value: "wifi", label: "WiFi", category: "Tech" },
  { value: "battery", label: "Battery", category: "Tech" },
  { value: "download", label: "Download", category: "Tech" },
  { value: "upload", label: "Upload", category: "Tech" },
  { value: "refresh", label: "Refresh", category: "Tech" },

  // Organization
  { value: "calendar", label: "Calendar", category: "Organization" },
  { value: "clock", label: "Clock", category: "Organization" },
  { value: "bookmark", label: "Bookmark", category: "Organization" },
  { value: "tag", label: "Tag", category: "Organization" },
  { value: "paperclip", label: "Paperclip", category: "Organization" },
];

export const CANVAS_FONT_FAMILIES: FontFamily[] = [
  "Arial",
  "Verdana",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Impact",
];

export const CANVAS_PRESET_COLORS: string[] = [
  "#FFFFFF",
  "#000000",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",
  "#A855F7",
  "#EC4899",
  "#F472B6",
  "#6B7280",
  "#9CA3AF",
  "#CBD5E1",
];

export const PLATFORM_COLORS: Record<Platform, string> = {
  [Platform.YouTube]: "#FF0000",
  [Platform.TikTok]: "#000000",
  [Platform.Instagram]: "#E1306C",
  [Platform.Twitter]: "#1DA1F2",
  [Platform.LinkedIn]: "#0A66C2",
  [Platform.Facebook]: "#1877F2",
};

export const TREND_ANALYSIS_SUPPORTED_TYPES = [ContentType.TrendAnalysis];

export const YOUTUBE_STATS_SUPPORTED_TYPES = [ContentType.YoutubeStats];

export const GENERIC_PLATFORM_CONTENT_TYPES = [
  ContentType.Idea,
  ContentType.Translation,
  ContentType.ReadabilityCheck,
  ContentType.ContentBrief,
  ContentType.PollQuiz,
  ContentType.EngagementFeedback,
  ContentType.TrendAnalysis,
  ContentType.YoutubeStats,
];

export const IMAGE_GENERATION_SUPPORTED_TYPES = [ContentType.ImagePrompt];

export const CONTENT_BRIEF_SUPPORTED_TYPES = [
  ContentType.BlogArticle,
  ContentType.YoutubeVideo,
  ContentType.FacebookPost,
  ContentType.InstagramPost,
  ContentType.TwitterTweet,
  ContentType.LinkedInPost,
  ContentType.EmailNewsletter,
  ContentType.BookChapter,
  ContentType.Script,
  ContentType.WebsiteContent,
];

export const POLL_QUIZ_SUPPORTED_TYPES = [ContentType.PollQuiz];

export const BRAND_VOICE_ANALYSIS_SUPPORTED_TYPES = [
  // Add content types relevant for brand voice analysis
];

export const AI_PERSONA_SUPPORTED_TYPES = [
  // Add content types relevant for AI persona
];

export const KEYWORD_RESEARCH_SUPPORTED_TYPES = [
  // Add content types relevant for keyword research
];

export const REFINEMENT_TYPES = {
  Refine: "Refine",
  Repurpose: "Repurpose",
  Expand: "Expand",
  Summarize: "Summarize",
  Rephrase: "Rephrase",
};

export const CUSTOM_PROMPT_SUPPORTED_TYPES = [
  ContentType.Idea,
  ContentType.BlogArticle,
  ContentType.YoutubeVideo,
  ContentType.FacebookPost,
  ContentType.InstagramPost,
  ContentType.TwitterTweet,
  ContentType.LinkedInPost,
  ContentType.EmailNewsletter,
  ContentType.BookChapter,
  ContentType.Script,
  ContentType.WebsiteContent,
  ContentType.HashtagList,
  ContentType.ImagePrompt,
  ContentType.ThumbnailConcept,
  ContentType.ContentBrief,
  ContentType.PollQuiz,
  ContentType.ReadabilityCheck,
  ContentType.ChannelAnalysis,
  ContentType.EngagementFeedback,
  ContentType.TrendAnalysis,
  ContentType.YoutubeStats,
  ContentType.Translation,
  ContentType.YoutubeVideoDescription,
];

export const CANVA_APP_ID = "YOUR_CANVA_APP_ID"; // Placeholder for Canva App ID

// Video length options for script generation
export const VIDEO_LENGTH_OPTIONS = [
  { value: "30 seconds", label: "Short (30 seconds)" },
  { value: "1-2 minutes", label: "Medium (1-2 minutes)" },
  { value: "3-5 minutes", label: "Long (3-5 minutes)" },
  { value: "5-10 minutes", label: "Extended (5-10 minutes)" },
  { value: "10+ minutes", label: "Detailed (10+ minutes)" },
  { value: "custom", label: "Custom length..." },
] as const;

export { IMAGE_PROMPT_STYLES, IMAGE_PROMPT_MOODS };
