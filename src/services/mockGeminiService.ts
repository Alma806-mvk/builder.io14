import { ContentType, Platform, GeneratedTextOutput } from "../types";

// Mock content generator for when Gemini API key is invalid
export const generateMockContent = (
  contentType: ContentType,
  userInput: string,
  platform: Platform,
): GeneratedTextOutput => {
  const mockContent: Record<ContentType, string> = {
    [ContentType.FacebookPost]: `🎯 Mock Facebook Post about "${userInput}"

This is a sample Facebook post that would be generated by AI. In a real scenario, this would be a creative, engaging post optimized for ${platform}.

Key features:
✅ Attention-grabbing hook
✅ Value-driven content
✅ Call-to-action
✅ Relevant hashtags

#MockContent #AI #SocialMedia #${platform}

⚠️ To get real AI-generated content, add your Gemini API key to .env.local
🔑 Get free key: https://makersuite.google.com/app/apikey`,

    [ContentType.InstagramPost]: `✨ Mock Instagram Post: "${userInput}"

🔥 This is what an AI-generated Instagram post would look like!

📸 Perfect for ${platform}
💡 Engaging and visual
🎯 Optimized for engagement

#MockPost #InstagramContent #AI #${userInput.replace(/\s+/g, "")}

⚠️ Add Gemini API key for real content generation!
🔑 https://makersuite.google.com/app/apikey`,

    [ContentType.TwitterTweet]: `🚀 Mock Tweet about "${userInput}"

This is a sample AI-generated tweet optimized for ${platform}. Would include relevant hashtags, engaging content, and perfect length!

#MockTweet #AI #${userInput.split(" ")[0]}

⚠️ Get real AI content with Gemini API key
🔑 makersuite.google.com/app/apikey`,

    [ContentType.ContentIdea]: `💡 Mock Content Ideas for "${userInput}":

1. 🎯 Behind-the-scenes look at ${userInput}
2. 📊 Tips and tricks related to ${userInput}
3. 🔥 Common mistakes with ${userInput}
4. ✨ Success stories featuring ${userInput}
5. 🎪 Fun facts about ${userInput}

Each idea would be fully developed with hooks, outlines, and format suggestions!

⚠️ To get real AI-generated ideas, add your Gemini API key to .env.local
🔑 Get free key: https://makersuite.google.com/app/apikey`,

    [ContentType.HashtagSuggestion]: `#MockHashtags #${userInput.replace(/\s+/g, "")} #AI #Content #${platform} #Trending #Viral #Engagement #Marketing #SocialMedia

⚠️ Real hashtag suggestions available with Gemini API key
🔑 https://makersuite.google.com/app/apikey`,

    [ContentType.Title]: `🎯 Mock AI-Generated Titles for "${userInput}":

1. The Ultimate Guide to ${userInput} That Everyone's Talking About
2. 5 Mind-Blowing Facts About ${userInput} You Never Knew
3. How ${userInput} Changed Everything (And Why You Should Care)
4. The Secret to ${userInput} That Experts Don't Want You to Know
5. Why ${userInput} is the Future (And How to Get Started Today)

⚠️ Get real AI-generated titles with Gemini API key
🔑 https://makersuite.google.com/app/apikey`,

    [ContentType.ImagePrompt]: `Mock AI Image Prompt for "${userInput}":

A professional, high-quality image featuring ${userInput}. The scene should be vibrant and engaging, with perfect lighting and composition. Include elements that represent innovation, success, and creativity. Style: modern, clean, eye-catching. Perfect for ${platform} content.

⚠️ Real AI image prompts available with Gemini API key
🔑 https://makersuite.google.com/app/apikey`,

    [ContentType.VideoHook]: `🎬 Mock Video Hook for "${userInput}":

"Wait... did you know that ${userInput} could completely change your life? I had no idea until I discovered this one thing..."

[Hook continues with engaging content about ${userInput}]

⚠️ Get real AI-generated video hooks with Gemini API key
🔑 https://makersuite.google.com/app/apikey`,

    // Add more content types as needed
  } as any;

  const defaultMock = `🤖 Mock AI-generated content for "${userInput}" on ${platform}

This is a sample response that would be created by the Gemini AI when properly configured.

⚠️ To get real AI-generated content:
1. Visit: https://makersuite.google.com/app/apikey
2. Create free API key (takes 30 seconds)
3. Add to .env.local: GEMINI_API_KEY=your_key_here
4. Restart the app

🎯 Your Social Content AI Studio is ready - just needs the API key!`;

  // Return structure that matches generateTextContent response
  return {
    text: mockContent[contentType] || defaultMock,
    sources: [],
    responseMimeType: "text/plain",
  };
};
