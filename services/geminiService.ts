import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import {
  Platform,
  ContentType,
  RefinementType,
  Source,
  ABTestableContentType,
  SeoKeywordMode,
  ThumbnailConceptOutput,
  AiPersonaDefinition,
  Language,
  AspectRatioGuidance,
  PromptOptimizationSuggestion,
  ContentBriefOutput,
  PollQuizOutput,
  ReadabilityOutput,
  ContentStrategyPlanOutput,
  TrendAnalysisOutput,
  TrendItem,
  EngagementFeedbackOutput, // New types
} from "../types";
import { GEMINI_TEXT_MODEL, GEMINI_IMAGE_MODEL } from "../constants";

let ai: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (
      !apiKey ||
      apiKey === "your_gemini_api_key_here" ||
      apiKey === "your_actual_gemini_api_key_here"
    ) {
      throw new Error(
        "INVALID_API_KEY: Please add your Gemini API key to .env.local. Get free key: https://makersuite.google.com/app/apikey",
      );
    }
    ai = new GoogleGenAI({ apiKey: apiKey as string });
  }
  return ai;
};

const getSystemInstructionFromDefinition = (
  personaDef: AiPersonaDefinition | undefined,
  baseInstruction?: string,
): string | undefined => {
  if (!personaDef) {
    return baseInstruction || "You are a helpful and versatile AI assistant.";
  }
  const finalInstruction = baseInstruction
    ? `${baseInstruction} ${personaDef.systemInstruction}`
    : personaDef.systemInstruction;
  return finalInstruction;
};

const generateBasePromptDetails = (
  platform: Platform,
  userInput: string,
  targetAudience?: string,
  batchVariations?: number,
  seoKeywords?: string,
  seoMode?: SeoKeywordMode,
  aspectRatioGuidance?: AspectRatioGuidance,
  videoLength?: string,
): string => {
  let details = `🎯 PLATFORM: ${platform}\n📝 TOPIC: ${userInput}\n`;

  if (targetAudience) {
    details += `👥 TARGET AUDIENCE: ${targetAudience}\n🎨 TONE INSTRUCTION: Craft content specifically for this audience. Tailor language complexity, cultural references, pain points, and aspirations to resonate deeply with ${targetAudience}.\n`;
  }

  if (batchVariations && batchVariations > 1) {
    details += `🔢 VARIATIONS REQUESTED: ${batchVariations} unique variations. Ensure each variation takes a different approach while maintaining quality.\n`;
  }

  if (seoKeywords && seoMode === SeoKeywordMode.Incorporate) {
    details += `🔍 SEO KEYWORDS: ${seoKeywords}\n📈 SEO INSTRUCTION: Naturally integrate these keywords for maximum discoverability while maintaining engaging, human-readable content.\n`;
  }

  if (aspectRatioGuidance && aspectRatioGuidance !== AspectRatioGuidance.None) {
    details += `📐 VISUAL FORMAT: ${aspectRatioGuidance}\n🎨 VISUAL INSTRUCTION: Consider this aspect ratio for any visual descriptions, ensuring optimal composition and readability.\n`;
  }

  if (videoLength) {
    details += `⏱️ VIDEO LENGTH: ${videoLength}\n🎬 PACING INSTRUCTION: Structure content to naturally fill ${videoLength} when spoken at optimal pace. Adjust depth, examples, and pacing accordingly.\n`;
  }

  return details + "\n";
};

interface TextGenerationOptions {
  platform: Platform;
  contentType: ContentType;
  userInput: string;
  targetAudience?: string;
  batchVariations?: number;
  originalText?: string;
  refinementType?: RefinementType;
  repurposeTargetPlatform?: Platform;
  repurposeTargetContentType?: ContentType;
  abTestType?: ABTestableContentType;
  isABTesting?: boolean;
  multiPlatformTargets?: Platform[];
  seoKeywords?: string;
  seoMode?: SeoKeywordMode;
  aiPersonaDef?: AiPersonaDefinition;
  nicheForTrends?: string;
  strategyInputs?: any;
  captionToOptimize?: string;
  targetLanguage?: Language;
  aspectRatioGuidance?: AspectRatioGuidance;
  engagementFeedbackConfig?: any;
  videoLength?: string;
}

const generatePrompt = (
  options: TextGenerationOptions,
): { prompt: string; systemInstruction?: string; outputConfig?: any } => {
  const {
    platform,
    contentType,
    userInput,
    targetAudience,
    batchVariations,
    originalText,
    refinementType,
    repurposeTargetPlatform,
    repurposeTargetContentType,
    abTestType,
    isABTesting,
    multiPlatformTargets,
    seoKeywords,
    seoMode,
    aiPersonaDef,
    nicheForTrends,
    strategyInputs,
    captionToOptimize,
    targetLanguage,
    aspectRatioGuidance,
    engagementFeedbackConfig,
    videoLength,
  } = options;

  const baseDetails = generateBasePromptDetails(
    platform,
    userInput,
    targetAudience,
    batchVariations,
    seoKeywords,
    seoMode,
    aspectRatioGuidance,
    videoLength,
  );

  let systemInstruction: string | undefined;
  let outputConfig: any = {};

  // Define logic for each content type with PREMIUM QUALITY PROMPTS
  switch (contentType) {
    case ContentType.Idea:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are an elite creative strategist and viral content architect with 15+ years of experience. You've launched campaigns that generated millions of views and built brands from zero to millions of followers. Your ideas are innovative, trend-aware, and conversion-focused.",
      );
      return {
        prompt: `${baseDetails}

🚀 PREMIUM CONTENT IDEA GENERATION

Generate 12 innovative, high-conversion content ideas for "${userInput}" optimized for ${platform}.

QUALITY STANDARDS:
✅ Each idea must be IMMEDIATELY actionable and specific
✅ Include psychological hooks that trigger engagement
✅ Consider current algorithm preferences and trending formats
✅ Address specific pain points and desires of the target audience
✅ Include unique angles that differentiate from competitors

REQUIRED STRUCTURE FOR EACH IDEA:

🎯 **IDEA #X: [Compelling Title]**
📝 **Concept**: [2-3 sentence description with specific details]
🎬 **Format**: [Exact content type: video, carousel, live, etc.]
🧠 **Psychology**: [Why this hooks the audience psychologically]
📈 **Growth Potential**: [Viral elements and shareability factors]
💡 **Unique Angle**: [What makes this different from typical content]
⚡ **Call-to-Action**: [Specific engagement prompt]

CONTENT VARIETY:
- Educational (teach something valuable)
- Entertainment (humor, storytelling, surprises)
- Inspirational (motivation, transformation stories)
- Behind-the-scenes (authenticity, relatability)
- Trending (current events, viral challenges)
- Controversial (respectful hot takes that spark discussion)
- User-generated (community involvement)
- Problem-solving (direct solutions to audience pain points)

Each idea should feel like it could generate significant engagement and potentially go viral while providing genuine value to the audience.`,
        systemInstruction,
      };

    case ContentType.Title:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a master copywriter and viral content specialist who has created headlines that generated millions of clicks. You understand neuroscience, psychology, and the science of persuasion. Your titles consistently outperform industry benchmarks.",
      );
      return {
        prompt: `${baseDetails}

🎯 PREMIUM HEADLINE & TITLE CREATION

Create 15 high-converting, attention-grabbing titles for "${userInput}" optimized for ${platform}.

CONVERSION SCIENCE:
✅ Apply proven psychological triggers (curiosity gap, fear of missing out, social proof)
✅ Use power words that trigger emotional responses
✅ Optimize for platform-specific character limits and display formats
✅ Include numbers, urgency, and benefit-driven language where appropriate
✅ Test multiple emotional approaches (excitement, fear, curiosity, desire)

TITLE CATEGORIES (3 titles each):

🧠 **CURIOSITY BUILDERS**
- Create irresistible information gaps
- Use "secrets," "mistakes," "hidden," "never told"
- Promise surprising revelations

🔥 **BENEFIT-DRIVEN**
- Clear value propositions
- Results-focused language
- Time-saving or money-making promises

⚡ **URGENCY CREATORS**
- Time-sensitive language
- Scarcity implications
- "Before it's too late" messaging

😱 **CONTROVERSY STARTERS**
- Respectful contrarian takes
- Challenge common beliefs
- Spark healthy debate

�� **SOCIAL PROOF**
- Numbers and statistics
- Testimonial implications
- Authority positioning

FORMAT FOR EACH TITLE:
📝 [Title]
🎯 **Psychological Trigger**: [Why this works]
📊 **Expected Performance**: [Why it will convert]

Ensure each title feels premium, professional, and worth clicking while delivering on its promise.`,
        systemInstruction,
      };

    case ContentType.Script:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are an award-winning scriptwriter and content strategist who has created scripts for viral videos with millions of views. You understand pacing, emotional arcs, and audience retention psychology. Your scripts feel natural, engaging, and convert viewers into followers and customers.",
      );

      const lengthGuidance = videoLength
        ? `\n⏱️ TARGET DURATION: ${videoLength}\n🎬 PACING STRATEGY: Structure content to naturally fill ${videoLength} with optimal pacing, strategic pauses, and audience retention hooks.`
        : "";

      return {
        prompt: `${baseDetails}${lengthGuidance}

🎬 PREMIUM VIDEO SCRIPT CREATION

Create a professional, high-converting video script for "${userInput}" on ${platform}.

SCRIPT STRUCTURE & PSYCHOLOGY:

🎣 **HOOK (0-3 seconds)**
- Create immediate pattern interruption
- Use proven attention-grabbing techniques
- Promise specific value or create curiosity gap
- Include visual or auditory elements that stop scrolling

📖 **MAIN CONTENT (Body)**
- Follow proven storytelling frameworks (Problem-Agitation-Solution or Before-After-Bridge)
- Include emotional peaks and valleys for retention
- Use conversational, natural language
- Add strategic pauses and emphasis points
- Include visual cues and scene descriptions
- Maintain engagement with questions and interactions

📢 **CALL-TO-ACTION (Closing)**
- Clear, specific next steps
- Multiple engagement prompts (like, comment, share, follow)
- Create anticipation for future content
- Include reason WHY they should take action

PREMIUM ELEMENTS TO INCLUDE:
✅ **Retention Hooks**: Strategic questions and cliffhangers
✅ **Visual Directions**: [Camera angles, text overlays, graphics]
✅ **Emotional Triggers**: Moments designed to create connection
✅ **Platform Optimization**: ${platform}-specific features and timing
✅ **Engagement Maximizers**: Interactive elements and community building
✅ **Conversion Elements**: Subtle calls-to-action throughout

TECHNICAL FORMATTING:
- Use [brackets] for visual/technical directions
- Include (pause) markers for emphasis
- Add emoji indicators for tone
- Specify camera angles and transitions
- Note text overlay opportunities

The script should feel natural when spoken, maintain high retention throughout, and convert viewers into engaged followers while providing genuine value.`,
        systemInstruction,
      };

    case ContentType.MicroScript:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a viral short-form content expert who understands the psychology of scroll-stopping content. You've created scripts that generated millions of views on TikTok, Instagram Reels, and YouTube Shorts. You know exactly how to hook attention and maintain it for 15-60 seconds.",
      );
      return {
        prompt: `${baseDetails}

⚡ PREMIUM MICRO-VIDEO SCRIPT (15-60 seconds)

Create a viral-worthy short-form video script for "${userInput}" optimized for TikTok, Instagram Reels, and YouTube Shorts.

VIRAL FORMULA STRUCTURE:

🎣 **HOOK (0-3 seconds)**
Power techniques:
- Pattern interrupt (unexpected opening)
- Bold statement or question
- Visual hook with movement/transformation
- Numbers or statistics shock
- Relatable problem statement
[Include specific camera direction and visual element]

🎬 **VALUE DELIVERY (3-45 seconds)**
Content delivery strategy:
- Quick-fire valuable information
- Step-by-step process or reveal
- Before/after transformation
- Story with emotional arc
- Educational content with entertainment
[Include pacing notes, visual transitions, text overlays]

📢 **ENGAGEMENT CTA (45-60 seconds)**
Conversion optimization:
- Specific comment prompt
- Share/save instruction with reason
- Follow hook for more content
- Challenge or trend participation
[Include visual cues for maximum engagement]

MICRO-SCRIPT SUCCESS ELEMENTS:
✅ **Fast Pacing**: Keep energy high with quick cuts and transitions
✅ **Visual Storytelling**: Every second should be visually interesting
✅ **Audio Hooks**: Include trending sounds or music cues where relevant
✅ **Text Overlay Strategy**: Key points that support audio narration
✅ **Retention Tricks**: Questions, countdowns, reveals, transformations
✅ **Shareability Factor**: Content people WANT to share with friends

TECHNICAL DIRECTIONS:
- [Camera: Close-up/Wide shot/Transition]
- [Text: Overlay message]
- [Audio: Music/sound effect cues]
- [Visual: What viewer sees on screen]
- [Pacing: Fast/Slow/Pause indicators]

The script should feel addictive, valuable, and shareable while maintaining authentic engagement.`,
        systemInstruction,
      };

    case ContentType.VideoHook:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a viral video specialist who understands the neuroscience of attention. You've analyzed thousands of viral videos and know exactly what makes people stop scrolling in the first 3 seconds. Your hooks consistently achieve 90%+ retention rates.",
      );
      return {
        prompt: `${baseDetails}

🎣 PREMIUM VIDEO HOOK CREATION

Generate 12 scroll-stopping video hooks for "${userInput}" on ${platform}.

HOOK PSYCHOLOGY & NEUROSCIENCE:
✅ **Pattern Interruption**: Break expected patterns to capture attention
✅ **Curiosity Gaps**: Create irresistible information gaps
✅ **Emotional Triggers**: Target specific emotions (surprise, fear, excitement, desire)
✅ **Social Proof**: Leverage authority, popularity, or social validation
✅ **Visual Movement**: Include dynamic visual elements
✅ **Audio Hooks**: Compelling opening sounds or music

HOOK CATEGORIES (2 hooks each):

🧠 **CURIOSITY BUILDERS**
- "What I'm about to show you will change everything..."
- "The secret that [industry experts] don't want you to know..."

💥 **SHOCK & AWE**
- Surprising statistics or facts
- Controversial or contrarian statements

🎯 **PROBLEM-FOCUSED**
- "If you're struggling with [specific problem]..."
- "Stop doing [common mistake] immediately..."

🏆 **AUTHORITY POSITIONING**
- "After [X years/experiences], here's what I learned..."
- "Industry insiders revealed this to me..."

⚡ **URGENCY CREATORS**
- "This changes everything starting today..."
- "Don't scroll past this if you want..."

🤝 **RELATABILITY HOOKS**
- "POV: You've been doing [thing] wrong your whole life..."
- "Tell me you [relatable situation] without telling me..."

FORMAT FOR EACH HOOK:
🎣 **Hook**: [Exact opening line]
🎬 **Visual**: [What viewer sees in first 3 seconds]
🧠 **Psychology**: [Why this captures attention]
📊 **Platform Fit**: [Why this works on ${platform}]
⏱️ **Timing**: [Pacing and delivery notes]

Each hook should feel irresistible to ignore and create immediate engagement while setting up valuable content delivery.`,
        systemInstruction,
      };

    case ContentType.ThumbnailConcept:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a conversion-focused visual designer and thumbnail specialist who understands the psychology of click-through rates. Your thumbnail concepts consistently achieve 15%+ CTR and have generated millions of views. You know color psychology, composition rules, and what makes people click.",
      );
      return {
        prompt: `${baseDetails}

🎨 PREMIUM THUMBNAIL CONCEPT DESIGN

Create 8 high-converting thumbnail concepts for "${userInput}" on ${platform}.

CONVERSION PSYCHOLOGY:
✅ **Eye-Catching Colors**: High contrast, emotion-triggering color schemes
✅ **Facial Expressions**: Emotions that create curiosity or excitement
✅ **Text Hierarchy**: Clear, readable, benefit-driven text overlays
✅ **Visual Composition**: Rule of thirds, leading lines, focal points
✅ **Emotional Triggers**: Surprise, curiosity, fear of missing out
✅ **Platform Optimization**: ${platform}-specific size and display considerations

THUMBNAIL CONCEPTS:

🎯 **CONCEPT 1: EMOTION-DRIVEN**
📸 **Visual Composition**: [Detailed description of main subject, background, positioning]
🎨 **Color Scheme**: [Primary colors and psychological impact]
📝 **Text Overlay**: [Exact text, font style, positioning]
😃 **Facial Expression/Emotion**: [If applicable, describe emotion and why it converts]
🧠 **Psychological Hook**: [Why this thumbnail stops the scroll]
📊 **Expected CTR**: [Why this will get clicked]

🎯 **CONCEPT 2: CURIOSITY-BASED**
[Repeat structure for each concept]

THUMBNAIL CATEGORIES:
- **Emotion-Driven**: Faces showing surprise, excitement, shock
- **Curiosity-Based**: Partial reveals, question marks, mysterious elements
- **Before/After**: Split-screen comparisons, transformations
- **Authority-Based**: Professional setups, credentials, expertise indicators
- **Problem-Focused**: Visual representations of pain points
- **Solution-Oriented**: Clear benefit demonstrations
- **Trend-Leveraging**: Current visual trends and memes
- **Social Proof**: Numbers, testimonials, popularity indicators

TECHNICAL SPECIFICATIONS:
- **Aspect Ratio**: 16:9 for YouTube, 1:1 for Instagram, platform-specific optimization
- **Text Readability**: Large, bold fonts that read well on mobile
- **Visual Hierarchy**: Clear primary and secondary focal points
- **Brand Consistency**: Colors and style that align with content brand

Each concept should feel premium, professional, and irresistibly clickable while accurately representing the content value.`,
        systemInstruction,
      };

    case ContentType.ContentBrief:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a strategic content architect and brand consultant who has developed content strategies for Fortune 500 companies and viral creators. You understand audience psychology, content marketing funnels, and conversion optimization. Your briefs are comprehensive, actionable, and results-focused.",
      );
      return {
        prompt: `${baseDetails}

📋 PREMIUM CONTENT STRATEGY BRIEF

Develop a comprehensive, actionable content brief for "${userInput}" on ${platform}.

STRATEGIC FRAMEWORK:

🎯 **CONTENT POSITIONING**
- Primary value proposition
- Unique angle differentiator
- Competitive advantage
- Brand alignment strategy

📊 **AUDIENCE ANALYSIS**
- Primary demographic profile
- Psychographic insights
- Pain points and desires
- Consumption behaviors
- Engagement preferences

🎬 **CONTENT ARCHITECTURE**

**Title Suggestions** (10 variations):
- 3 Curiosity-driven titles
- 3 Benefit-focused titles
- 2 Authority-positioning titles
- 2 Trend-leveraging titles

**Key Messaging Angles** (8 approaches):
- Educational angle
- Entertainment angle
- Inspirational angle
- Problem-solving angle
- Behind-the-scenes angle
- Trending/timely angle
- Controversial/contrarian angle
- Community-building angle

**Main Talking Points** (Structured outline):
1. Hook/Opening (attention-grabber)
2. Problem identification (audience pain point)
3. Solution presentation (your approach)
4. Value delivery (specific benefits)
5. Social proof (credibility building)
6. Call-to-action (engagement/conversion)

**Content Flow Strategy**:
- Optimal content length and pacing
- Retention hooks and engagement triggers
- Visual and audio elements
- Interactive components
- Conversion optimization points

📢 **ENGAGEMENT OPTIMIZATION**

**Call-to-Action Strategies** (6 variations):
- Comment engagement prompts
- Share/save motivators
- Follow conversion hooks
- Cross-platform traffic drivers
- Community building actions
- Conversion-focused CTAs

**Tone & Style Guidelines**:
- Voice and personality
- Language complexity level
- Emotional resonance strategy
- Brand consistency notes
- Platform-specific adaptations

🚀 **DISTRIBUTION & AMPLIFICATION**
- Optimal posting times
- Hashtag strategy
- Cross-promotion opportunities
- Community engagement plan
- Trend-riding tactics

This brief should serve as a complete roadmap for creating high-performing, conversion-focused content that builds audience and drives business results.`,
        systemInstruction,
      };

    case ContentType.ContentStrategyPlan:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a senior content strategist and digital marketing expert who has built comprehensive content ecosystems for Fortune 500 brands and viral creators. You understand the full spectrum of content operations, from strategic planning to execution, analytics, and optimization. Your strategies integrate SEO, conversion optimization, audience psychology, and operational efficiency.",
      );
      outputConfig.responseMimeType = "application/json";
      return {
        prompt: `${baseDetails}

🎯 ENTERPRISE-LEVEL COMPREHENSIVE CONTENT STRATEGY

Create a complete, actionable content strategy for "${userInput}" targeting ${targetAudience || "the specified audience"} on ${platform}.

**IMPORTANT: Return ONLY valid JSON in the exact format specified below:**

{
  "targetAudienceOverview": "Comprehensive demographic and psychographic profile including age ranges, income levels, education, interests, pain points, content consumption habits, preferred platforms, and buying behaviors",
  "goals": ["Specific SMART goal 1 with metrics", "Specific SMART goal 2 with metrics", "Specific SMART goal 3 with metrics", "Specific SMART goal 4 with metrics"],
  "contentPillars": [
    {
      "pillarName": "Content Pillar 1 Name",
      "description": "Detailed description of this content pillar, its strategic purpose, and audience connection",
      "keywords": ["primary-keyword", "secondary-keyword", "long-tail-keyword", "trending-keyword", "niche-keyword"],
      "contentTypes": ["Video", "Image", "Carousel", "Story", "Live"],
      "postingFrequency": "X times per week",
      "engagementStrategy": "Specific engagement approach for this pillar"
    },
    {
      "pillarName": "Content Pillar 2 Name",
      "description": "Detailed description of this content pillar, its strategic purpose, and audience connection",
      "keywords": ["primary-keyword", "secondary-keyword", "long-tail-keyword", "trending-keyword", "niche-keyword"],
      "contentTypes": ["Video", "Image", "Carousel", "Story", "Live"],
      "postingFrequency": "X times per week",
      "engagementStrategy": "Specific engagement approach for this pillar"
    },
    {
      "pillarName": "Content Pillar 3 Name",
      "description": "Detailed description of this content pillar, its strategic purpose, and audience connection",
      "keywords": ["primary-keyword", "secondary-keyword", "long-tail-keyword", "trending-keyword", "niche-keyword"],
      "contentTypes": ["Video", "Image", "Carousel", "Story", "Live"],
      "postingFrequency": "X times per week",
      "engagementStrategy": "Specific engagement approach for this pillar"
    }
  ],
  "keyThemes": [
    {
      "themeName": "Theme 1 Name",
      "description": "Detailed description of this theme and strategic positioning",
      "relatedPillars": ["Pillar 1", "Pillar 2"],
      "contentIdeas": [
        {"title": "Specific Content Title 1", "format": "video", "platform": "${platform}", "cta": "Specific call-to-action", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]},
        {"title": "Specific Content Title 2", "format": "carousel", "platform": "${platform}", "cta": "Specific call-to-action", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]},
        {"title": "Specific Content Title 3", "format": "image", "platform": "${platform}", "cta": "Specific call-to-action", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]}
      ],
      "seoKeywords": ["seo-keyword-1", "seo-keyword-2", "seo-keyword-3"],
      "conversionGoal": "Specific conversion objective for this theme"
    },
    {
      "themeName": "Theme 2 Name",
      "description": "Detailed description of this theme and strategic positioning",
      "relatedPillars": ["Pillar 1", "Pillar 3"],
      "contentIdeas": [
        {"title": "Specific Content Title 1", "format": "video", "platform": "${platform}", "cta": "Specific call-to-action", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]},
        {"title": "Specific Content Title 2", "format": "carousel", "platform": "${platform}", "cta": "Specific call-to-action", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]},
        {"title": "Specific Content Title 3", "format": "image", "platform": "${platform}", "cta": "Specific call-to-action", "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]}
      ],
      "seoKeywords": ["seo-keyword-1", "seo-keyword-2", "seo-keyword-3"],
      "conversionGoal": "Specific conversion objective for this theme"
    }
  ],
  "postingSchedule": {
    "optimalTimes": {
      "Monday": ["9:00 AM", "1:00 PM", "7:00 PM"],
      "Tuesday": ["9:00 AM", "1:00 PM", "7:00 PM"],
      "Wednesday": ["9:00 AM", "1:00 PM", "7:00 PM"],
      "Thursday": ["9:00 AM", "1:00 PM", "7:00 PM"],
      "Friday": ["9:00 AM", "1:00 PM", "7:00 PM"],
      "Saturday": ["10:00 AM", "2:00 PM", "8:00 PM"],
      "Sunday": ["10:00 AM", "2:00 PM", "8:00 PM"]
    },
    "frequency": "Daily with specific content types",
    "timezone": "Target audience timezone",
    "seasonalAdjustments": "How to adjust posting times for seasons/holidays"
  },
  "suggestedWeeklySchedule": [
    {"dayOfWeek": "Monday", "contentType": "Educational/Tutorial", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "9:00 AM", "cta": "Learn more in comments"},
    {"dayOfWeek": "Tuesday", "contentType": "Behind-the-scenes", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "1:00 PM", "cta": "Share your experience"},
    {"dayOfWeek": "Wednesday", "contentType": "User-generated content", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "7:00 PM", "cta": "Tag a friend"},
    {"dayOfWeek": "Thursday", "contentType": "Trending/Timely", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "9:00 AM", "cta": "What's your take?"},
    {"dayOfWeek": "Friday", "contentType": "Entertainment/Fun", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "7:00 PM", "cta": "Weekend vibes - share yours!"},
    {"dayOfWeek": "Saturday", "contentType": "Lifestyle/Personal", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "10:00 AM", "cta": "Follow for more"},
    {"dayOfWeek": "Sunday", "contentType": "Inspirational/Motivational", "topicHint": "Specific topic suggestion", "platform": "${platform}", "optimalTime": "2:00 PM", "cta": "Save this for motivation"}
  ],
  "seoStrategy": {
    "primaryKeywords": ["main-keyword-1", "main-keyword-2", "main-keyword-3"],
    "longtailKeywords": ["specific long-tail phrase 1", "specific long-tail phrase 2", "specific long-tail phrase 3"],
    "hashtagStrategy": {
      "trending": ["#trending1", "#trending2", "#trending3"],
      "niche": ["#niche1", "#niche2", "#niche3"],
      "branded": ["#brandhashtag1", "#brandhashtag2"],
      "community": ["#community1", "#community2", "#community3"]
    },
    "contentOptimization": "Specific SEO optimization techniques for content titles, descriptions, and tags"
  },
  "ctaStrategy": {
    "engagementCTAs": ["Comment your thoughts below", "Share this with someone who needs it", "Save for later", "Tag a friend who should see this"],
    "conversionCTAs": ["Link in bio for more", "DM us for details", "Sign up at [website]", "Get yours now"],
    "communityBuildingCTAs": ["Follow for daily tips", "Turn on notifications", "Join our community", "What's your experience?"],
    "placementGuidelines": "Strategic placement of CTAs in content (beginning, middle, end) and timing recommendations"
  },
  "contentManagement": {
    "workflowSteps": ["Ideation", "Content creation", "Review/editing", "Scheduling", "Publishing", "Engagement", "Analytics review"],
    "editingGuidelines": {
      "visualStyle": "Consistent color palette, fonts, and branding elements",
      "videoSpecs": "Resolution, aspect ratios, duration guidelines for ${platform}",
      "imageSpecs": "Dimensions, file formats, quality requirements",
      "brandingElements": "Logo placement, watermarks, consistent visual identity"
    },
    "qualityChecklist": ["Brand consistency", "Grammar/spelling", "Visual quality", "CTA inclusion", "Hashtag optimization", "Timing optimization"],
    "approvalProcess": "Content review and approval workflow before publishing"
  },
  "distributionStrategy": {
    "primaryPlatform": "${platform}",
    "crossPlatformSharing": ["Platform 1 adaptation", "Platform 2 adaptation", "Platform 3 adaptation"],
    "repurposingPlan": "How to adapt content for different platforms and formats",
    "communityEngagement": "Strategies for engaging with audience comments, messages, and community participation"
  },
  "analyticsAndKPIs": {
    "primaryMetrics": ["Engagement rate (target: X%)", "Reach growth (target: X%)", "Follower growth (target: X per month)", "Website traffic (target: X clicks)", "Conversion rate (target: X%)"],
    "secondaryMetrics": ["Saves/Shares", "Comments quality", "Story completion rate", "Click-through rate", "Brand mention tracking"],
    "reportingSchedule": "Weekly performance reviews, monthly strategy adjustments, quarterly goal assessment",
    "analyticsTools": ["Native platform analytics", "Third-party tools", "UTM tracking for links", "Social listening tools"]
  },
  "budgetAndResources": {
    "timeAllocation": "Hours per week for content creation, editing, posting, and engagement",
    "toolsNeeded": ["Content creation tools", "Scheduling platforms", "Analytics tools", "Design software"],
    "teamRoles": ["Content creator", "Editor", "Community manager", "Analyst"],
    "budgetBreakdown": "Estimated costs for tools, advertising, and potential outsourcing"
  },
  "competitorAnalysis": {
    "topCompetitors": ["Competitor 1 strengths", "Competitor 2 strategies", "Competitor 3 positioning"],
    "gapOpportunities": ["Underserved content areas", "Audience needs not being met", "Format innovations"],
    "differentiationStrategy": "How to stand out from competitors and establish unique positioning"
  },
  "contentCalendarTemplate": {
    "monthlyThemes": ["Month 1 focus", "Month 2 focus", "Month 3 focus"],
    "seasonalContent": "Holiday and seasonal content planning",
    "evergreen vs trending": "Balance between timeless content and trending topics (70% evergreen, 30% trending recommended)",
    "batchCreationSchedule": "Recommended content creation batching schedule for efficiency"
  },
  "riskMitigation": {
    "contentBackups": "Backup content ready for posting in case of trending topic changes",
    "crisisManagement": "Response strategy for negative feedback or PR issues",
    "platformChanges": "Adaptation strategies for algorithm or platform policy changes",
    "burnoutPrevention": "Sustainable content creation practices to prevent creator burnout"
  }
}`,
        systemInstruction,
        outputConfig,
      };

    case ContentType.PollsQuizzes:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are an engagement specialist and interactive content expert who understands the psychology of participation. Your polls and quizzes consistently achieve 40%+ engagement rates and create viral community discussions. You know how to make people want to participate and share.",
      );
      return {
        prompt: `${baseDetails}

🎯 PREMIUM INTERACTIVE CONTENT CREATION

Design highly engaging polls and quizzes for "${userInput}" on ${platform}.

ENGAGEMENT PSYCHOLOGY:
✅ **Participation Triggers**: Make answering irresistible
✅ **Social Sharing**: Create share-worthy results
✅ **Curiosity Gaps**: Questions people NEED to answer
✅ **Personal Relevance**: Connect to audience's lives
✅ **Discussion Starters**: Spark conversations in comments

INTERACTIVE CONTENT SUITE:

🗳️ **ENGAGEMENT POLLS** (6 strategic polls)

**Poll 1: Opinion Divider**
📝 Question: [Thought-provoking either/or question]
🎯 Options: [Two compelling choices that divide opinions]
🧠 Psychology: [Why this creates engagement]
💬 Discussion Starter: [Follow-up question for comments]

**Poll 2: Personal Experience**
📝 Question: [Relatable personal situation]
🎯 Options: [Multiple choices reflecting different experiences]
🧠 Psychology: [Connection to audience identity]
💬 Discussion Starter: [Encourages story sharing]

[Continue for all 6 polls with different psychological triggers]

🧩 **KNOWLEDGE QUIZZES** (3 comprehensive quizzes)

**Quiz 1: Expertise Assessment**
📚 Topic: [Specific knowledge area]
❓ Questions: [5 progressive difficulty questions]
🏆 Scoring: [Meaningful result categories]
🎉 Results: [Personalized feedback and recommendations]
💡 Value Add: [Educational insights provided]

**Quiz 2: Personality/Style Assessment**
🧠 Topic: [Personality or preference assessment]
❓ Questions: [5 scenario-based questions]
🎭 Results: [Fun, shareable personality types]
📱 Share Factor: [Why people will share results]

**Quiz 3: Challenge/Skills Test**
⚡ Topic: [Practical skills or knowledge test]
❓ Questions: [5 applied knowledge questions]
🎯 Results: [Actionable improvement suggestions]
📈 Growth Path: [Next steps for improvement]

TECHNICAL OPTIMIZATION:
- **Mobile-Friendly**: Easy thumb navigation
- **Visual Appeal**: Engaging graphics and emojis
- **Clear Instructions**: Fool-proof participation
- **Results Sharing**: Built-in social sharing appeal
- **Follow-up Content**: Hooks for continued engagement

Each interactive element should feel addictive, shareable, and valuable while driving meaningful engagement and community building.`,
        systemInstruction,
      };

    case ContentType.TrendAnalysis:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a senior trend analyst and digital strategist who has predicted viral movements and helped brands capitalize on emerging opportunities. You understand algorithm patterns, cultural shifts, and how to translate trend data into actionable content strategies.",
      );
      outputConfig.tools = [{ googleSearch: {} }];
      return {
        prompt: `${baseDetails}

📊 PREMIUM TREND ANALYSIS & OPPORTUNITY IDENTIFICATION

Conduct comprehensive trend analysis for "${userInput}" using Google Search intelligence.

ANALYSIS FRAMEWORK:

🔍 **CURRENT TREND LANDSCAPE**
Using Google Search, identify and analyze:

**Viral Content Patterns**:
- Top performing content themes (last 30 days)
- Emerging viral formats and styles
- Algorithm-favored content types
- Cross-platform trend migrations

**Audience Behavior Shifts**:
- Changing consumption patterns
- New engagement preferences
- Demographic trend adoption
- Platform usage evolution

**Content Opportunity Gaps**:
- Underserved trending topics
- Unsaturated viral formats
- Emerging niche interests
- Seasonal trend patterns

🚀 **STRATEGIC OPPORTUNITIES**

**Immediate Action Items** (Next 7 days):
1. [Specific trending topic to leverage]
2. [Viral format to adopt]
3. [Hashtag/keyword opportunities]
4. [Platform-specific trends to ride]

**Medium-term Strategies** (Next 30 days):
1. [Emerging trend positioning]
2. [Content series opportunities]
3. [Community building tactics]
4. [Cross-platform expansion]

**Future Trend Preparation** (Next 90 days):
1. [Predicted trend developments]
2. [Early adoption opportunities]
3. [Content stockpiling strategies]
4. [Audience preparation tactics]

📈 **PERFORMANCE PREDICTION**

**High-Probability Viral Elements**:
- Content formats showing exponential growth
- Hashtags with rising momentum
- Audio trends gaining traction
- Visual styles becoming popular

**Risk Assessment**:
- Trends approaching saturation
- Platform algorithm changes
- Seasonal trend lifecycles
- Competitive landscape shifts

🎯 **ACTIONABLE CONTENT CALENDAR**

**Week 1-2 Focus**: [Immediate trend implementation]
**Week 3-4 Focus**: [Emerging trend preparation]
**Monthly Theme**: [Overarching trend strategy]

Provide specific, data-driven recommendations that can be immediately implemented for maximum trend capitalization and viral potential.`,
        systemInstruction,
        outputConfig,
      };

    case ContentType.RefinedText:
      if (!originalText) {
        throw new Error("Original text is required for refinement.");
      }
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a master editor and content optimization specialist who has refined content for viral creators and major brands. You understand engagement psychology, conversion optimization, and how to enhance content while maintaining its authentic voice and core message.",
      );
      const refinementInstructions = {
        [RefinementType.Shorter]:
          "Condense this content into its most powerful, impactful form. Remove all unnecessary words while amplifying the core message. Make every word count for maximum engagement and retention. Focus on power phrases and emotional triggers.",
        [RefinementType.Longer]:
          "Expand this content with rich details, compelling examples, and deeper insights. Add storytelling elements, emotional depth, and practical value that makes the audience want to stay engaged. Include specific examples and actionable advice.",
        [RefinementType.MoreFormal]:
          "Transform this content into a professional, authoritative piece that establishes credibility and expertise. Use sophisticated language, industry terminology, and polished structure while maintaining engagement and accessibility.",
        [RefinementType.SlightlyMoreFormal]:
          "Elevate the professionalism while keeping the conversational tone. Polish the language and structure to feel more credible and trustworthy without losing the authentic voice and relatability.",
        [RefinementType.MuchMoreFormal]:
          "Create an executive-level, highly professional version with sophisticated vocabulary, formal structure, and authoritative tone. This should feel like premium, expert-level content worthy of industry leadership.",
        [RefinementType.MoreCasual]:
          "Make this content feel like a conversation with a knowledgeable friend. Use casual language, relatable examples, and a warm, approachable tone while maintaining the valuable insights and core message.",
        [RefinementType.SlightlyMoreCasual]:
          "Soften the tone slightly to feel more approachable and relatable. Add conversational elements and friendly language while maintaining professionalism and credibility.",
        [RefinementType.MuchMoreCasual]:
          "Transform this into very casual, friend-to-friend conversation style. Use slang, casual expressions, and a very relaxed tone while keeping the valuable content and insights intact.",
        [RefinementType.AddEmojis]:
          "Strategically integrate emojis to enhance emotional impact, improve readability, and increase engagement. Use emojis to break up text, emphasize key points, and add personality while maintaining professionalism.",
        [RefinementType.MoreEngaging]:
          "Amplify the engagement factor with compelling hooks, interactive elements, and emotional triggers. Add questions, storytelling elements, and calls-to-action that make the audience want to participate and share.",
        [RefinementType.ExpandKeyPoints]:
          "Take the most important points and develop them into comprehensive, valuable sections. Add detailed explanations, real-world examples, case studies, and practical applications that provide deep value.",
        [RefinementType.CondenseMainIdea]:
          "Distill this content down to its absolute core message and most essential points. Create a powerful, concentrated version that delivers maximum impact in minimum time while maintaining all crucial information.",
        [RefinementType.SimplifyLanguage]:
          "Make this content accessible to a broader audience by simplifying complex terms, breaking down difficult concepts, and using clear, straightforward language while maintaining depth and value.",
      };
      return {
        prompt: `${baseDetails}

🎯 PREMIUM CONTENT REFINEMENT

ORIGINAL CONTENT:
"${originalText}"

REFINEMENT OBJECTIVE: ${refinementType}
STRATEGY: ${refinementInstructions[refinementType!]}

QUALITY STANDARDS:
✅ Maintain the authentic voice and core message
✅ Enhance engagement and readability
✅ Optimize for ${platform} best practices
✅ Preserve all valuable insights and information
✅ Improve conversion potential
✅ Ensure premium feel and professional quality

REFINEMENT PROCESS:
1. **Content Analysis**: Identify strengths and optimization opportunities
2. **Strategic Enhancement**: Apply refinement strategy while preserving value
3. **Platform Optimization**: Ensure content works perfectly for ${platform}
4. **Engagement Amplification**: Add elements that increase audience interaction
5. **Quality Assurance**: Verify improved impact while maintaining authenticity

DELIVERABLE:
Provide the refined content that feels premium, engaging, and perfectly suited for the intended purpose while achieving the specific refinement goal of "${refinementType}".`,
        systemInstruction,
      };

    case ContentType.YoutubeChannelStats:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a YouTube analytics expert who provides comprehensive channel statistics and insights. You understand YouTube metrics, growth patterns, and can extract meaningful insights from channel data.",
      );
      outputConfig.tools = [{ googleSearch: {} }];
      return {
        prompt: `${baseDetails}

🎯 YOUTUBE CHANNEL STATISTICS ANALYSIS

Analyze and provide comprehensive statistics for the YouTube channel: "${userInput}"

Use Google Search to find the most current and accurate information about this channel.

REQUIRED OUTPUT FORMAT:
Provide the statistics in this exact structure:

**YouTube Channel Statistics for [CHANNEL_URL]:**

**Channel Name:** [Exact channel name]
**Total Videos:** [Number of videos]
**Subscribers:** [Subscriber count with M/K notation]
**All-time Views:** [Total view count] (as of [Current Date])
**Joined YouTube:** [Channel creation date]
**Location:** [Channel location/country]

SEARCH REQUIREMENTS:
- Find the official YouTube channel
- Get the most recent subscriber count
- Find total video count
- Locate channel creation date
- Identify channel location if available
- Calculate total view count across all videos

DATA ACCURACY:
- Use the most recent data available
- Include approximate dates for when statistics were gathered
- If exact numbers aren't available, provide best estimates with notation
- Cross-reference multiple sources for accuracy

OUTPUT STYLE:
- Clean, structured format matching the template exactly
- Use proper number formatting (3.6M+ for millions, 726K for thousands)
- Include current date reference for view counts
- Maintain consistent spacing and formatting`,
        systemInstruction,
        outputConfig,
      };

    // Continue with other content types...
    case ContentType.RepurposedContent:
      if (!originalText) {
        throw new Error("Original text is required for repurposing.");
      }
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a content repurposing strategist who understands how to adapt content across platforms while maximizing engagement and conversion for each unique audience and format.",
      );
      return {
        prompt: `${baseDetails}

🔄 PREMIUM CONTENT REPURPOSING

ORIGINAL CONTENT:
"${originalText}"

TARGET PLATFORM: ${repurposeTargetPlatform}
TARGET FORMAT: ${repurposeTargetContentType}

REPURPOSING STRATEGY:
✅ **Platform Optimization**: Adapt for ${repurposeTargetPlatform}'s unique audience and algorithm preferences
✅ **Format Transformation**: Convert to ${repurposeTargetContentType} while maximizing platform-specific features
✅ **Audience Alignment**: Adjust tone, language, and examples for platform demographics
✅ **Engagement Optimization**: Include platform-specific engagement triggers and calls-to-action
✅ **Value Preservation**: Maintain core insights while enhancing for new format

ADAPTATION ELEMENTS:
- **Length & Pacing**: Optimal for ${repurposeTargetPlatform} consumption patterns
- **Visual Elements**: Platform-appropriate visual cues and formatting
- **Interaction Style**: Engagement methods that work best on ${repurposeTargetPlatform}
- **Hashtag Strategy**: Platform-specific discovery optimization
- **CTA Optimization**: Conversion methods native to ${repurposeTargetPlatform}

Deliver repurposed content that feels native to ${repurposeTargetPlatform} while maintaining the value and insights from the original content.`,
        systemInstruction,
      };

    case ContentType.ABTest:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a conversion optimization expert and A/B testing specialist who understands the psychology of different approaches and how to create meaningful variations that test distinct hypotheses for maximum learning and performance improvement.",
      );
      if (!isABTesting || !abTestType) {
        throw new Error("A/B testing configuration is required.");
      }
      return {
        prompt: `${baseDetails}

🧪 PREMIUM A/B TEST VARIATIONS

CONTENT TYPE: ${abTestType}
TOPIC: "${userInput}"
PLATFORM: ${platform}

A/B TESTING STRATEGY:
Create 4 distinct variations that test different psychological approaches and engagement strategies.

VARIATION FRAMEWORK:

**VARIATION A: EMOTIONAL APPEAL**
Focus: Emotional triggers and personal connection
Approach: Use storytelling, emotions, and relatable scenarios
Psychology: Appeals to feelings and personal experiences

**VARIATION B: LOGICAL/RATIONAL**
Focus: Facts, data, and logical benefits
Approach: Use statistics, logical arguments, and clear value propositions
Psychology: Appeals to rational decision-making

**VARIATION C: CURIOSITY/MYSTERY**
Focus: Intrigue and information gaps
Approach: Create curiosity gaps and mysterious elements
Psychology: Appeals to natural curiosity and FOMO

**VARIATION D: SOCIAL PROOF/AUTHORITY**
Focus: Credibility and social validation
Approach: Use testimonials, expert positioning, and popularity indicators
Psychology: Appeals to social conformity and authority trust

FOR EACH VARIATION:
📝 **Content**: [Complete variation based on content type]
🧠 **Psychology**: [Why this approach works]
🎯 **Target Audience**: [Who this appeals to most]
📊 **Success Metrics**: [What to measure for this variation]
💡 **Optimization Notes**: [How to improve based on results]

Each variation should be significantly different in approach while maintaining quality and brand consistency, allowing for meaningful testing insights.`,
        systemInstruction,
      };

    // Add the rest of the content types with premium quality prompts...
    case ContentType.EngagementFeedback:
      if (!originalText) {
        throw new Error(
          "Original content is required for engagement feedback.",
        );
      }
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a viral content analyst and engagement optimization expert who has studied millions of high-performing posts. You understand audience psychology, platform algorithms, and the specific elements that drive massive engagement and conversion.",
      );
      return {
        prompt: `${baseDetails}

📊 PREMIUM ENGAGEMENT ANALYSIS & OPTIMIZATION

CONTENT TO ANALYZE:
"${originalText}"

PLATFORM: ${platform}
TARGET AUDIENCE: ${targetAudience || "General"}

COMPREHENSIVE ENGAGEMENT AUDIT:

🎯 **ENGAGEMENT SCORE**: [Rate 1-10 with detailed breakdown]

**Overall Rating**: X/10
**Breakdown**:
- Hook Effectiveness: X/10
- Retention Potential: X/10
- Emotional Impact: X/10
- Call-to-Action Strength: X/10
- Shareability Factor: X/10

🧠 **PSYCHOLOGICAL ANALYSIS**

**Emotional Triggers Present**:
- [List identified emotional hooks]
- [Rate effectiveness of each]

**Audience Connection Points**:
- [Relatability factors]
- [Personal relevance elements]
- [Community building aspects]

**Attention & Retention Elements**:
- [Hook strength analysis]
- [Retention mechanisms identified]
- [Potential drop-off points]

📈 **PERFORMANCE PREDICTION**

**Expected Engagement Metrics**:
- Estimated reach potential
- Predicted engagement rate
- Likely audience actions
- Viral potential assessment

**Algorithm Compatibility**:
- Platform algorithm alignment
- Optimization for discovery
- Engagement signal strength

🚀 **OPTIMIZATION RECOMMENDATIONS**

**Immediate Improvements** (High Impact):
1. [Specific change with expected impact]
2. [Hook enhancement recommendation]
3. [CTA optimization suggestion]

**Strategic Enhancements** (Medium Impact):
1. [Content structure improvements]
2. [Emotional amplification opportunities]
3. [Community engagement additions]

**Advanced Optimizations** (Experimental):
1. [Innovative engagement tactics]
2. [Trending format adaptations]
3. [Cross-platform optimization]

💡 **CONVERSION PATHWAY**

**Engagement Funnel Analysis**:
- Attention → Interest conversion
- Interest → Engagement conversion
- Engagement → Follow conversion
- Follow → Community conversion

Provide actionable, specific recommendations that can immediately improve engagement performance and long-term audience building.`,
        systemInstruction,
      };

    case ContentType.ChannelAnalysis:
      systemInstruction = getSystemInstructionFromDefinition(
        aiPersonaDef,
        "You are a YouTube strategy expert and content analyst with deep knowledge of creator economy trends, algorithm behavior, and viral content patterns. You've analyzed thousands of successful channels and can identify content gaps, optimization opportunities, and strategic growth paths. Your insights help creators scale their channels and maximize their content potential.",
      );
      return {
        prompt: `🎯 COMPREHENSIVE YOUTUBE CHANNEL ANALYSIS

Analyze the following YouTube channel(s) and provide strategic insights: ${userInput}

Conduct comprehensive research and provide detailed analysis for ALL of the following sections:

**Overall Channel(s) Summary & Niche:**
Provide a detailed overview of each channel's core identity, content focus, and niche positioning. Include subscriber count, total views, upload frequency, and overall brand positioning.

**Competitor Benchmarking Insights (if multiple channels provided):**
Compare performance metrics, content strategies, and audience engagement between channels. Identify what makes top performers successful and where gaps exist.

**Audience Engagement Insights (Inferred from Search):**
Analyze engagement patterns, comment themes, community interaction levels, and audience loyalty indicators. Identify what content drives the highest engagement.

**Content Series & Playlist Recommendations:**
Suggest specific content series ideas, playlist strategies, and recurring content formats that could boost channel growth and audience retention.

**Format Diversification Suggestions:**
Recommend new content formats, video styles, and presentation approaches that align with the channel's brand while expanding reach potential.

**'Low-Hanging Fruit' Video Ideas (actionable & specific):**
Provide 5-10 specific, immediately actionable video concepts that have high viral potential and align with current trends and the channel's niche.

**Inferred Thumbnail & Title Optimization Patterns:**
Analyze successful thumbnails and titles from similar channels to recommend specific design patterns, emotional triggers, and copywriting approaches.

**Potential Content Gaps & Strategic Opportunities:**
Identify underserved topics in the niche, trending subjects the channel hasn't covered, and strategic content opportunities for competitive advantage.

**Key SEO Keywords & Phrases (Tag Cloud Insights):**
Provide a comprehensive list of high-impact keywords, trending search terms, and SEO phrases that should be incorporated into titles, descriptions, and tags.

**Collaboration Theme Suggestions:**
Recommend specific collaboration ideas, cross-channel opportunities, and partnership strategies that could accelerate growth.

**Speculative Historical Content Evolution:**
Analyze how the channel's content has evolved over time and predict future content directions based on current trends and audience development.

🔍 **RESEARCH REQUIREMENTS:**
- Use actual data from YouTube searches, Google Trends, and social media insights
- Include specific metrics, numbers, and quantifiable insights where possible
- Provide actionable recommendations with clear implementation steps
- Focus on data-driven insights rather than generic advice
- Include current trend analysis and algorithm considerations

📊 **DELIVERABLE FORMAT:**
Present each section with detailed insights, specific examples, and actionable recommendations. Include relevant statistics, trending topics, and competitive analysis data to support all recommendations.`,
        systemInstruction,
        outputConfig: { responseMimeType: "text/plain" },
      };

    default:
      systemInstruction = getSystemInstructionFromDefinition(aiPersonaDef);
      return {
        prompt: userInput,
        systemInstruction,
        outputConfig: { responseMimeType: "text/plain" },
      };
  }
};

// Mock content generation functions for fallback
const generateMockContent = (
  contentType: ContentType,
  userInput: string,
  platform: Platform,
  refinementType?: RefinementType,
  originalText?: string,
): any => {
  const mockMap = {
    [ContentType.RefinedText]: generateRefinedMockContent(
      userInput,
      platform,
      refinementType,
      originalText,
    ),
    [ContentType.EngagementFeedback]: generateEngagementFeedbackMockContent(
      userInput,
      platform,
    ),
    [ContentType.CheckReadability]: generateReadabilityMockContent(
      userInput,
      platform,
    ),
    [ContentType.TrendAnalysis]: generateTrendAnalysisMockContent(
      userInput,
      platform,
    ),
  };
  return (
    mockMap[contentType] ||
    `🚀 Premium ${contentType} content for "${userInput}" on ${platform} would appear here. This is mock content for development purposes.`
  );
};

const generateRefinedMockContent = (
  userInput: string,
  platform: Platform,
  refinementType?: RefinementType,
  originalText?: string,
): string => {
  if (!originalText || !refinementType) {
    return `🔄 Refined content would appear here. Original text and refinement type are required.`;
  }

  switch (refinementType) {
    case RefinementType.AddEmojis:
      return `✨ Enhanced version with strategic emojis:

🎯 ${originalText.split(" ").slice(0, 5).join(" ")} 💡
📈 ${originalText.split(" ").slice(5, 10).join(" ")} 🚀
💯 ${originalText.split(" ").slice(10).join(" ")} ⭐

This version uses emojis to improve readability and engagement while maintaining the core message.`;

    case RefinementType.Shorter:
      const shortenedContent = originalText
        .split(" ")
        .slice(0, Math.max(10, originalText.split(" ").length / 2))
        .join(" ");
      return `🎯 Condensed version for ${platform}:

${shortenedContent}${originalText.length > shortenedContent.length ? "..." : ""}

Key improvements: Removed fluff, emphasized core message, increased impact per word.`;

    case RefinementType.Longer:
      return `📚 Expanded version for ${platform}:

${originalText}

Additional value: This expanded version includes more context, examples, and actionable insights that provide deeper value to your audience while maintaining engagement throughout.

Enhanced elements:
• More detailed explanations
• Practical examples
• Actionable next steps
• Emotional connection points

This creates a more comprehensive piece that establishes authority and provides maximum value.`;

    case RefinementType.MoreEngaging:
      return `🚀 High-engagement version for ${platform}:

🤔 Ever wondered about this? ${originalText.split(".")[0]}...

Here's what's fascinating: ${originalText.split(".").slice(1, 2).join(".")}

💡 But here's the game-changer: ${originalText.split(".").slice(2).join(".")}

🔥 What do you think? Drop a comment and let me know your experience!

Enhanced with: Questions, hooks, emotional triggers, and strong CTAs for maximum engagement.`;

    case RefinementType.MoreFormal:
      return `📄 Professional version for ${platform}:

${originalText
  .replace(/!/g, ".")
  .replace(/\?/g, ".")
  .split(" ")
  .map((word) => (word.length > 6 ? word : word))
  .join(" ")}

This refined version maintains professionalism while preserving the core insights and value of the original content.`;

    case RefinementType.MoreCasual:
      return `😊 Casual, friendly version for ${platform}:

Hey! So ${originalText.toLowerCase().replace(/\./g, "... ")}

Pretty cool, right? This casual version feels like chatting with a friend while still delivering all the valuable insights!`;

    default:
      return `🔄 Refined content for "${refinementType}" would appear here, taking your original text and applying the specific refinement while maintaining the core message and optimizing for ${platform}.`;
  }
};

const generateEngagementFeedbackMockContent = (
  userInput: string,
  platform: Platform,
): string => {
  return `📊 Engagement Analysis for "${userInput}" on ${platform}:

🎯 **Engagement Score: 8.2/10**

**Strengths:**
✅ Strong emotional hooks that connect with audience
✅ Clear value proposition and actionable insights
✅ Platform-optimized formatting and length
✅ Effective use of storytelling elements

**Opportunities:**
🔧 Add more interactive elements (questions, polls)
🔧 Include stronger call-to-action for comments
🔧 Consider trending hashtags for discovery
🔧 Add visual break points for better readability

**Predicted Performance:**
📈 Expected reach: Above average for your niche
💬 Engagement rate: 4-6% (strong for ${platform})
🔄 Share potential: High due to value and relatability

**Optimization Recommendations:**
1. Add a compelling question at the end
2. Include 2-3 relevant emojis for visual appeal
3. Consider a "save this post" prompt
4. Add urgency or scarcity elements

This content has strong viral potential with minor optimizations!`;
};

const generateReadabilityMockContent = (
  userInput: string,
  platform: Platform,
): { scoreDescription: string; simplifiedContent?: string } => {
  return {
    scoreDescription: `📖 Readability Analysis for "${userInput}" on ${platform}:

**Readability Score: 8.5/10** ✅

**Reading Level:** Grade 7-8 (Excellent for social media)
**Sentence Length:** Optimal (12-15 words average)
**Vocabulary:** Accessible with strategic complexity
**Structure:** Well-organized with clear flow

**Strengths:**
✅ Clear, conversational tone
✅ Good use of short paragraphs
✅ Active voice throughout
✅ Logical information flow

**Areas for Enhancement:**
🔧 Break up one longer sentence for better flow
🔧 Add transition words for smoother reading
🔧 Consider bullet points for key information

**Platform Optimization:**
Perfect for ${platform} consumption patterns. Content is easily scannable and engaging for mobile users.`,
    simplifiedContent: `Simplified version: This content about "${userInput}" is easy to read and understand. It uses simple words and short sentences. The ideas flow well together. Perfect for ${platform} audiences who want clear, valuable information without complexity.`,
  };
};

const generateTrendAnalysisMockContent = (
  userInput: string,
  platform: Platform,
): TrendAnalysisOutput => {
  return {
    type: "trend_analysis",
    query: userInput,
    items: [
      {
        title: `Rising Trend: ${userInput} Content Strategies`,
        link: "https://example.com/trend1",
        snippet: `Latest ${userInput} trends show 340% increase in engagement when using specific formatting and timing strategies optimized for ${platform}.`,
        sourceType: "news",
      },
      {
        title: `Viral ${userInput} Formats on ${platform}`,
        link: "https://example.com/trend2",
        snippet: `New viral format combining ${userInput} with interactive elements is generating 500% more shares than traditional posts.`,
        sourceType: "discussion",
      },
      {
        title: `${userInput} Algorithm Updates Impact`,
        link: "https://example.com/trend3",
        snippet: `Recent ${platform} algorithm changes favor ${userInput} content that includes specific engagement triggers and community-building elements.`,
        sourceType: "topic",
      },
    ],
    groundingSources: [
      { uri: "https://example.com/source1", title: "Industry Analysis Report" },
      { uri: "https://example.com/source2", title: "Platform Trends Database" },
    ],
  };
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateTextContent = async (
  options: any,
): Promise<{ text: string; sources?: Source[]; responseMimeType?: string }> => {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  // Check if we're in a development environment that might have network restrictions
  const isBuilderEnvironment =
    typeof window !== "undefined" &&
    window.location.hostname.includes("builder.codes");

  if (isBuilderEnvironment) {
    console.log(
      "🏗️ Builder.io environment detected - network restrictions may apply",
    );
    console.log("🔄 Will fallback to mock content if network calls fail");
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Reset AI instance on retries to avoid any state issues
      if (attempt > 0) {
        ai = null; // Force fresh instance creation
      }

      // Create completely fresh instances for each attempt
      const currentAI = getAIInstance();
      const { prompt, systemInstruction, outputConfig } =
        generatePrompt(options);

      const requestConfig: any = {
        model: GEMINI_TEXT_MODEL,
        contents: prompt,
        config: { ...outputConfig },
      };
      if (systemInstruction) {
        requestConfig.config.systemInstruction = systemInstruction;
      }

      let response: GenerateContentResponse;
      let sources: Source[] | undefined = undefined;
      let responseText = "";

      try {
        // Create fresh response for each attempt to avoid stream issues
        response = await currentAI.models.generateContent(requestConfig);

        // Immediately extract the text to avoid multiple reads
        responseText =
          response.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (!responseText) {
          throw new Error("Empty response from AI service");
        }

        // Only process grounding metadata if response is valid
        const searchableContentTypes = [
          ContentType.TrendingTopics,
          ContentType.ContentGapFinder,
          ContentType.ChannelAnalysis,
          ContentType.ContentStrategyPlan,
          ContentType.TrendAnalysis,
          ContentType.YoutubeChannelStats,
        ];

        if (
          searchableContentTypes.includes(options.contentType) &&
          response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ) {
          sources = response.candidates[0].groundingMetadata.groundingChunks
            .filter((chunk) => chunk.web && chunk.web.uri)
            .map((chunk) => ({
              uri: chunk.web!.uri,
              title: chunk.web!.title || "Web Source",
            }));
        }
      } catch (responseError: any) {
        // Handle response parsing errors specifically
        if (
          responseError.message &&
          responseError.message.includes("body stream already read")
        ) {
          throw new Error("Response stream consumed - retry needed");
        }
        throw responseError;
      }

      console.log(
        `✅ Content generated successfully on attempt ${attempt + 1}`,
      );
      return {
        text: responseText,
        sources,
        responseMimeType: outputConfig?.responseMimeType || "text/plain",
      };
    } catch (error: any) {
      console.error(
        `❌ Attempt ${attempt + 1} failed:`,
        error.message || error,
      );

      const isFinalAttempt = attempt === maxRetries;

      // Handle specific error types - check nested error structure too
      const errorMessage = error.message || error.toString() || "";
      const errorCode =
        error.code || error.status || (error.error && error.error.code);
      const errorStatus = error.status || (error.error && error.error.status);

      // Check for nested error object (common in Gemini API responses)
      const nestedError = error.error;
      if (nestedError) {
        console.log(`🔍 Nested error detected:`, {
          code: nestedError.code,
          message: nestedError.message,
          status: nestedError.status,
        });
      }

      const isNetworkError =
        errorMessage.includes("fetch") ||
        errorMessage.includes("network") ||
        errorMessage.includes("ENOTFOUND") ||
        errorCode === "ENOTFOUND";

      const isRetryableError =
        errorMessage.includes("overloaded") ||
        errorMessage.includes("503") ||
        errorMessage.includes("UNAVAILABLE") ||
        errorMessage.includes("body stream already read") ||
        errorMessage.includes("Response stream consumed") ||
        errorMessage.includes("The model is overloaded") ||
        errorMessage.includes("Please try again later") ||
        (errorCode &&
          (errorCode === 503 || errorCode === 429 || errorCode === 500)) ||
        (errorStatus &&
          (errorStatus === "UNAVAILABLE" ||
            errorStatus === "RESOURCE_EXHAUSTED")) ||
        // Check nested error fields
        (nestedError && nestedError.code === 503) ||
        (nestedError && nestedError.status === "UNAVAILABLE") ||
        (nestedError &&
          nestedError.message &&
          (nestedError.message.includes("overloaded") ||
            nestedError.message.includes("Please try again later")));

      if (isFinalAttempt || (!isRetryableError && !isNetworkError)) {
        console.log(
          `🔄 Fallback: Using premium mock content for ${options.contentType}`,
        );
        return {
          text: generateMockContent(
            options.contentType,
            options.userInput,
            options.platform,
            options.refinementType,
            options.originalText,
          ),
        };
      }

      if (!isFinalAttempt) {
        // Use longer delays for model overloaded errors
        const isOverloadedError =
          errorMessage.includes("overloaded") ||
          errorMessage.includes("The model is overloaded") ||
          errorMessage.includes("Please try again later") ||
          errorCode === 503 ||
          (nestedError && nestedError.code === 503) ||
          (nestedError &&
            nestedError.message &&
            (nestedError.message.includes("overloaded") ||
              nestedError.message.includes("Please try again later")));

        const isStreamError =
          errorMessage.includes("body stream already read") ||
          errorMessage.includes("Response stream consumed");

        // Use more aggressive backoff for API overload
        const delay = isOverloadedError
          ? Math.min(baseDelay * Math.pow(4, attempt), 30000) // Cap at 30 seconds
          : isStreamError
            ? baseDelay * Math.pow(2, attempt) // Standard backoff for stream errors
            : baseDelay * Math.pow(2, attempt); // Standard backoff for other errors

        if (isOverloadedError) {
          console.log(
            `⏳ 🔄 Model overloaded (attempt ${attempt + 1}/${maxRetries + 1}) - Extended backoff: ${delay}ms`,
          );
          console.log(`📊 Error details:`, {
            code: errorCode || nestedError?.code,
            status: errorStatus || nestedError?.status,
            message: errorMessage.substring(0, 100) + "...",
          });
        } else if (isStreamError) {
          console.log(
            `⏳ 🔄 Response stream issue (attempt ${attempt + 1}/${maxRetries + 1}) - Fresh instance retry in ${delay}ms`,
          );
        } else {
          console.log(
            `⏳ 🔄 API error (attempt ${attempt + 1}/${maxRetries + 1}) - Retrying in ${delay}ms`,
          );
          console.log(`📊 Error type:`, {
            code: errorCode,
            status: errorStatus,
            isNetwork: isNetworkError,
          });
        }

        await sleep(delay);
      }
    }
  }

  // This should never be reached, but just in case
  return {
    text: generateMockContent(
      options.contentType,
      options.userInput,
      options.platform,
      options.refinementType,
      options.originalText,
    ),
  };
};

export const generateImage = async (
  prompt: string,
  negativePrompt?: string,
  aspectRatioGuidance?: AspectRatioGuidance,
): Promise<{ base64Data: string; mimeType: string }> => {
  try {
    const ai = getAIInstance();

    let fullPrompt = prompt;
    if (negativePrompt) {
      fullPrompt += ` [Avoid: ${negativePrompt}]`;
    }

    // Add aspect ratio guidance to prompt
    if (
      aspectRatioGuidance &&
      aspectRatioGuidance !== AspectRatioGuidance.None
    ) {
      fullPrompt += ` [Aspect ratio: ${aspectRatioGuidance}]`;
    }

    const result = await ai.models.generateImage({
      model: GEMINI_IMAGE_MODEL,
      prompt: fullPrompt,
    });

    return {
      base64Data: result.image.base64Data,
      mimeType: result.image.mimeType,
    };
  } catch (error: any) {
    console.error("Image generation error:", error);

    // Return a placeholder for development
    throw new Error(
      "Image generation temporarily unavailable. Please try again later or check your API configuration.",
    );
  }
};

export const performWebSearch = async (query: string): Promise<any> => {
  try {
    const ai = getAIInstance();

    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: `Search for: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract search results from response
    const searchResults =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter((chunk) => chunk.web && chunk.web.uri)
        .map((chunk) => ({
          uri: chunk.web!.uri,
          title: chunk.web!.title || "Web Result",
          snippet: chunk.web!.snippet || "",
        })) || [];

    return searchResults;
  } catch (error: any) {
    console.error("Web search error:", error);

    // Return mock search results for development
    return [
      {
        uri: "https://example.com/search-result-1",
        title: `Search Results for: ${query}`,
        snippet: `Mock search result content for "${query}". This would contain relevant information found through web search.`,
      },
      {
        uri: "https://example.com/search-result-2",
        title: `Related Information: ${query}`,
        snippet: `Additional search findings related to "${query}". Web search functionality would provide real-time results.`,
      },
    ];
  }
};

export default generateTextContent;
