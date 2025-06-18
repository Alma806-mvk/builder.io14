import React, { useState, useCallback, useMemo } from "react";
import {
  SearchIcon,
  ArrowUpRightIcon,
  TagIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  DownloadIcon,
} from "./IconComponents";
import LoadingSpinner from "./LoadingSpinner";
import { performWebSearch } from "../services/frontendGeminiService";
import { VIDEO_EDITING_EXTENSIONS } from "../../constants";
import FileDownloadService from "../services/fileDownloadService";

export interface Source {
  uri: string;
  title: string;
  category?: string;
  safetyScore?: number;
  description?: string;
}

interface EnhancedWebSearchProps {
  apiKeyMissing: boolean;
}

// URL patterns for categorization
const URL_CATEGORIES = {
  Gumroad: {
    patterns: [/gumroad\.com/i],
    icon: "🛒",
    color: "bg-pink-600",
    description: "Digital marketplace for creators",
  },
  "Google Drive": {
    patterns: [
      /drive\.google\.com/i,
      /docs\.google\.com/i,
      /sheets\.google\.com/i,
      /slides\.google\.com/i,
    ],
    icon: "📁",
    color: "bg-blue-600",
    description: "Google cloud storage and documents",
  },
  Dropbox: {
    patterns: [/dropbox\.com/i],
    icon: "📦",
    color: "bg-blue-700",
    description: "Cloud storage platform",
  },
  GitHub: {
    patterns: [/github\.com/i, /gitlab\.com/i, /bitbucket\.org/i],
    icon: "🐙",
    color: "bg-gray-800",
    description: "Code repository and collaboration",
  },
  YouTube: {
    patterns: [/youtube\.com/i, /youtu\.be/i],
    icon: "📺",
    color: "bg-red-600",
    description: "Video sharing platform",
  },
  TikTok: {
    patterns: [/tiktok\.com/i, /vm\.tiktok\.com/i],
    icon: "🎵",
    color: "bg-black",
    description: "Short-form video platform",
  },
  Instagram: {
    patterns: [/instagram\.com/i, /instagr\.am/i],
    icon: "📸",
    color: "bg-pink-500",
    description: "Photo and video sharing",
  },
  "Twitter/X": {
    patterns: [/twitter\.com/i, /x\.com/i, /t\.co/i],
    icon: "🐦",
    color: "bg-blue-500",
    description: "Social media platform",
  },
  LinkedIn: {
    patterns: [/linkedin\.com/i, /lnkd\.in/i],
    icon: "💼",
    color: "bg-blue-700",
    description: "Professional networking",
  },
  Facebook: {
    patterns: [/facebook\.com/i, /fb\.com/i],
    icon: "👥",
    color: "bg-blue-800",
    description: "Social networking platform",
  },
  Pinterest: {
    patterns: [/pinterest\.com/i, /pin\.it/i],
    icon: "📌",
    color: "bg-red-500",
    description: "Visual discovery platform",
  },
  Reddit: {
    patterns: [/reddit\.com/i, /redd\.it/i],
    icon: "🔶",
    color: "bg-orange-600",
    description: "Discussion and community platform",
  },
  Behance: {
    patterns: [/behance\.net/i],
    icon: "🎭",
    color: "bg-blue-600",
    description: "Creative portfolio platform",
  },
  Dribbble: {
    patterns: [/dribbble\.com/i],
    icon: "🏀",
    color: "bg-pink-400",
    description: "Design portfolio platform",
  },
  Figma: {
    patterns: [/figma\.com/i],
    icon: "🎨",
    color: "bg-purple-500",
    description: "Design and prototyping tool",
  },
  Notion: {
    patterns: [/notion\.so/i, /notion\.site/i],
    icon: "📝",
    color: "bg-gray-600",
    description: "Note-taking and collaboration",
  },
  Airtable: {
    patterns: [/airtable\.com/i],
    icon: "📊",
    color: "bg-yellow-600",
    description: "Database and spreadsheet platform",
  },
  Trello: {
    patterns: [/trello\.com/i],
    icon: "📋",
    color: "bg-blue-500",
    description: "Project management tool",
  },
  Slack: {
    patterns: [/slack\.com/i],
    icon: "💬",
    color: "bg-purple-600",
    description: "Team communication platform",
  },
  Discord: {
    patterns: [/discord\.com/i, /discord\.gg/i],
    icon: "🎮",
    color: "bg-indigo-600",
    description: "Voice and text chat platform",
  },
  OneDrive: {
    patterns: [/onedrive\.live\.com/i, /1drv\.ms/i],
    icon: "☁️",
    color: "bg-blue-600",
    description: "Microsoft cloud storage",
  },
  iCloud: {
    patterns: [/icloud\.com/i],
    icon: "☁️",
    color: "bg-gray-600",
    description: "Apple cloud storage",
  },
  Canva: {
    patterns: [/canva\.com/i],
    icon: "🎨",
    color: "bg-cyan-600",
    description: "Design platform",
  },
  Freepik: {
    patterns: [/freepik\.com/i],
    icon: "🎨",
    color: "bg-purple-600",
    description: "Stock photos and graphics",
  },
  Unsplash: {
    patterns: [/unsplash\.com/i],
    icon: "📷",
    color: "bg-gray-700",
    description: "Free stock photography",
  },
  Pexels: {
    patterns: [/pexels\.com/i],
    icon: "📸",
    color: "bg-green-600",
    description: "Free stock photos and videos",
  },
  Shutterstock: {
    patterns: [/shutterstock\.com/i],
    icon: "🖼️",
    color: "bg-red-600",
    description: "Premium stock media",
  },
  "Adobe Stock": {
    patterns: [/stock\.adobe\.com/i],
    icon: "🖼️",
    color: "bg-red-700",
    description: "Premium stock assets",
  },
  "Getty Images": {
    patterns: [/gettyimages\.com/i],
    icon: "🖼️",
    color: "bg-orange-600",
    description: "Premium stock imagery",
  },
  Vimeo: {
    patterns: [/vimeo\.com/i],
    icon: "🎬",
    color: "bg-blue-500",
    description: "Video hosting platform",
  },
  Twitch: {
    patterns: [/twitch\.tv/i],
    icon: "🎮",
    color: "bg-purple-600",
    description: "Live streaming platform",
  },
  Spotify: {
    patterns: [/spotify\.com/i, /open\.spotify\.com/i],
    icon: "🎵",
    color: "bg-green-500",
    description: "Music streaming platform",
  },
  SoundCloud: {
    patterns: [/soundcloud\.com/i],
    icon: "🎧",
    color: "bg-orange-500",
    description: "Audio sharing platform",
  },
  Educational: {
    patterns: [
      /\.edu/i,
      /coursera\.org/i,
      /udemy\.com/i,
      /khan.*academy/i,
      /edx\.org/i,
      /skillshare\.com/i,
      /lynda\.com/i,
      /pluralsight\.com/i,
    ],
    icon: "🎓",
    color: "bg-green-600",
    description: "Educational resources",
  },
  Documentation: {
    patterns: [
      /docs\./i,
      /documentation/i,
      /wiki/i,
      /manual/i,
      /readme/i,
      /guide/i,
    ],
    icon: "📚",
    color: "bg-indigo-600",
    description: "Documentation and guides",
  },
  "News & Media": {
    patterns: [
      /bbc\.com/i,
      /cnn\.com/i,
      /nytimes\.com/i,
      /techcrunch\.com/i,
      /medium\.com/i,
      /dev\.to/i,
      /hackernews/i,
    ],
    icon: "📰",
    color: "bg-gray-700",
    description: "News and media outlets",
  },
  "E-commerce": {
    patterns: [
      /amazon\.com/i,
      /ebay\.com/i,
      /etsy\.com/i,
      /shopify\.com/i,
      /woocommerce\.com/i,
    ],
    icon: "🛍️",
    color: "bg-green-700",
    description: "Online shopping platforms",
  },
  Productivity: {
    patterns: [
      /asana\.com/i,
      /monday\.com/i,
      /clickup\.com/i,
      /basecamp\.com/i,
      /jira\.atlassian\.com/i,
    ],
    icon: "⚡",
    color: "bg-yellow-600",
    description: "Productivity and project management",
  },
};

// Trusted domains for safety scoring
const TRUSTED_DOMAINS = [
  "google.com",
  "youtube.com",
  "github.com",
  "stackoverflow.com",
  "wikipedia.org",
  "mozilla.org",
  "microsoft.com",
  "apple.com",
  "adobe.com",
  "freepik.com",
  "unsplash.com",
  "pexels.com",
  "gumroad.com",
  "dropbox.com",
  "drive.google.com",
  "coursera.org",
  "udemy.com",
  "khanacademy.org",
];

const SUSPICIOUS_PATTERNS = [
  /bit\.ly/i,
  /tinyurl/i,
  /t\.co/i, // URL shorteners
  /\d+\.\d+\.\d+\.\d+/, // IP addresses
  /download.*now/i,
  /click.*here/i,
  /free.*download/i, // Suspicious text
];

export const EnhancedWebSearch: React.FC<EnhancedWebSearchProps> = ({
  apiKeyMissing,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFileType, setSearchFileType] = useState("");
  const [customSearchFileType, setCustomSearchFileType] = useState("");
  const [searchResults, setSearchResults] = useState<Source[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [canLoadMoreSearchResults, setCanLoadMoreSearchResults] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"relevance" | "safety" | "category">(
    "relevance",
  );
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(
    new Set(),
  );
  const [assetType, setAssetType] = useState<"all" | "free" | "paid">("all");

  const SEARCH_FILE_TYPES = useMemo(
    () => [
      { label: "Any File Type", value: "" },
      ...VIDEO_EDITING_EXTENSIONS.filter(
        (ext) => ext.value !== "" && ext.value !== "plugin",
      ),
    ],
    [],
  );

  // Categorize and score URLs for safety
  const categorizeAndScoreUrl = useCallback(
    (url: string, title: string): { category: string; safetyScore: number } => {
      let category = "Other";
      let safetyScore = 50; // Default neutral score

      // Check for category matches
      for (const [categoryName, categoryData] of Object.entries(
        URL_CATEGORIES,
      )) {
        if (categoryData.patterns.some((pattern) => pattern.test(url))) {
          category = categoryName;
          break;
        }
      }

      // Calculate safety score
      try {
        const domain = new URL(url).hostname.toLowerCase();

        // Boost score for trusted domains
        if (TRUSTED_DOMAINS.some((trusted) => domain.includes(trusted))) {
          safetyScore += 40;
        }

        // Reduce score for suspicious patterns
        if (
          SUSPICIOUS_PATTERNS.some(
            (pattern) => pattern.test(url) || pattern.test(title),
          )
        ) {
          safetyScore -= 30;
        }

        // HTTPS bonus
        if (url.startsWith("https://")) {
          safetyScore += 10;
        }

        // Well-known TLD bonus
        if (
          domain.endsWith(".com") ||
          domain.endsWith(".org") ||
          domain.endsWith(".edu")
        ) {
          safetyScore += 5;
        }
      } catch (error) {
        // Invalid URL format
        safetyScore = 20;
      }

      return {
        category,
        safetyScore: Math.max(0, Math.min(100, safetyScore)),
      };
    },
    [],
  );

  const handlePerformWebSearch = useCallback(
    async (isLoadMore = false) => {
      console.log("🔍 Search initiated:", {
        searchQuery,
        apiKeyMissing,
        isLoadMore,
      });

      if (apiKeyMissing) {
        console.warn("❌ API key missing");
        setSearchError(
          "Cannot perform search: VITE_GEMINI_API_KEY is missing.",
        );
        return;
      }
      if (!searchQuery.trim()) {
        console.warn("❌ Empty search query");
        setSearchError("Please enter a search query.");
        return;
      }

      console.log("✅ Starting search...");
      setIsSearching(true);
      if (!isLoadMore) setSearchResults([]);
      setSearchError(null);
      setCanLoadMoreSearchResults(false);

      const effectiveSearchFileType =
        searchFileType === "OTHER_EXTENSION"
          ? customSearchFileType
          : searchFileType;

      console.log("🔍 Search params:", {
        searchQuery,
        effectiveSearchFileType,
      });

      try {
        const newResults = await performWebSearch(
          searchQuery,
          effectiveSearchFileType,
          isLoadMore,
          assetType,
        );

        console.log("📊 Search results received:", newResults.length);

        // Enhance results with categorization and safety scoring
        const enhancedResults = newResults.map((result) => {
          const { category, safetyScore } = categorizeAndScoreUrl(
            result.uri,
            result.title,
          );
          return {
            ...result,
            category,
            safetyScore,
          };
        });

        console.log("🏷️ Enhanced results:", enhancedResults.length);

        setSearchResults((prevResults) => {
          const combinedResults = isLoadMore
            ? [...prevResults, ...enhancedResults]
            : enhancedResults;
          const uniqueResults = Array.from(
            new Map(combinedResults.map((item) => [item.uri, item])).values(),
          );
          console.log("✅ Final results set:", uniqueResults.length);
          return uniqueResults;
        });

        if (enhancedResults.length > 0) setCanLoadMoreSearchResults(true);
        else if (isLoadMore) setCanLoadMoreSearchResults(false);
      } catch (err) {
        console.error("❌ Search error:", err);
        const specificError =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during search.";
        setSearchError(specificError);
        console.error("❌ Full error details:", err);
      } finally {
        console.log("🏁 Search completed, setting loading to false");
        setIsSearching(false);
      }
    },
    [
      apiKeyMissing,
      searchQuery,
      searchFileType,
      customSearchFileType,
      categorizeAndScoreUrl,
    ],
  );

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = searchResults;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (result) => result.category === selectedCategory,
      );
    }

    // Sort results
    switch (sortBy) {
      case "safety":
        filtered.sort((a, b) => (b.safetyScore || 0) - (a.safetyScore || 0));
        break;
      case "category":
        filtered.sort((a, b) =>
          (a.category || "").localeCompare(b.category || ""),
        );
        break;
      case "relevance":
      default:
        // Keep original order (relevance from search)
        break;
    }

    return filtered;
  }, [searchResults, selectedCategory, sortBy]);

  // Get unique categories from results
  const availableCategories = useMemo(() => {
    const categories = [
      "all",
      ...new Set(searchResults.map((r) => r.category).filter(Boolean)),
    ];
    return categories;
  }, [searchResults]);

  const getSafetyBadge = (safetyScore: number) => {
    if (safetyScore >= 70) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="mr-1">🛡️</span>
          Safe
        </span>
      );
    } else if (safetyScore >= 40) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <span className="mr-1">⚠️</span>
          Caution
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <span className="mr-1">⚠️</span>
          Warning
        </span>
      );
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryData =
      URL_CATEGORIES[category as keyof typeof URL_CATEGORIES];
    if (categoryData) {
      return (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${categoryData.color}`}
          title={categoryData.description}
        >
          <span className="mr-1">{categoryData.icon}</span>
          {category}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <span className="mr-1">🌐</span>
        {category}
      </span>
    );
  };

  const handleDownloadFile = useCallback(
    async (result: Source) => {
      const uri = result.uri;
      setDownloadingFiles((prev) => new Set(prev).add(uri));

      try {
        // Generate keywords from search query and title
        const keywords = [
          ...searchQuery.split(" ").filter((word) => word.length > 2),
          ...result.title
            .split(" ")
            .filter((word) => word.length > 2)
            .slice(0, 5),
        ].slice(0, 10);

        // Determine file type from search query or use the selected file type
        const effectiveFileType =
          searchFileType === "OTHER_EXTENSION"
            ? customSearchFileType
            : searchFileType || ".txt";

        await FileDownloadService.generateAndDownloadFile({
          url: result.uri,
          title: result.title,
          keywords,
          fileType: effectiveFileType,
          category: result.category || "Other",
        });
      } catch (error) {
        console.error("Error downloading file:", error);
        // Could add error notification here
      } finally {
        setDownloadingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(uri);
          return newSet;
        });
      }
    },
    [searchQuery, searchFileType, customSearchFileType],
  );

  return (
    <div className="flex-grow bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl space-y-4">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-purple-400 flex items-center">
          <SearchIcon className="h-7 w-7 mr-2" />
          Creative Asset Finder
        </h2>

        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <DownloadIcon className="h-6 w-6 text-purple-400" />
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-purple-300 mb-1">
                🎨 Professional Creative Asset Search
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Search across{" "}
                <span className="font-medium text-purple-400">
                  verified creative platforms
                </span>{" "}
                including Unsplash, Pexels, Google Fonts, Freesound (free) and
                VideoHive, Envato, AudioJungle, Shutterstock (premium).
                <br />
                <span className="font-medium text-pink-400">
                  Toggle between free and paid assets
                </span>{" "}
                - every result links to real download pages.
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="text-xs bg-purple-800/50 text-purple-300 px-2 py-1 rounded">
                  Video Templates
                </span>
                <span className="text-xs bg-pink-800/50 text-pink-300 px-2 py-1 rounded">
                  Audio Assets
                </span>
                <span className="text-xs bg-blue-800/50 text-blue-300 px-2 py-1 rounded">
                  Graphics & Design
                </span>
                <span className="text-xs bg-green-800/50 text-green-300 px-2 py-1 rounded">
                  3D Models
                </span>
                <span className="text-xs bg-orange-800/50 text-orange-300 px-2 py-1 rounded">
                  Fonts & Typography
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search query (searches by extension by default)..."
            className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400"
            onKeyPress={(e) =>
              e.key === "Enter" && handlePerformWebSearch(false)
            }
          />
          <select
            value={searchFileType}
            onChange={(e) => {
              setSearchFileType(e.target.value);
              if (e.target.value !== "OTHER_EXTENSION")
                setCustomSearchFileType("");
            }}
            className="lg:w-1/4 p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-slate-100"
          >
            {SEARCH_FILE_TYPES.map((ext) => (
              <option key={ext.value} value={ext.value}>
                {ext.label}
              </option>
            ))}
          </select>
        </div>

        {searchFileType === "OTHER_EXTENSION" && (
          <input
            type="text"
            value={customSearchFileType}
            onChange={(e) => {
              let val = e.target.value.trim();
              if (val && !val.startsWith(".")) val = "." + val;
              setCustomSearchFileType(val);
            }}
            placeholder=".pdf, .docx, etc."
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400"
          />
        )}

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Free/Paid Toggle */}
          <div className="flex items-center space-x-2 bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setAssetType("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                assetType === "all"
                  ? "bg-purple-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => setAssetType("free")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                assetType === "free"
                  ? "bg-green-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Free Only
            </button>
            <button
              onClick={() => setAssetType("paid")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                assetType === "paid"
                  ? "bg-orange-600 text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Premium
            </button>
          </div>

          <button
            onClick={() => handlePerformWebSearch(false)}
            disabled={
              isSearching ||
              !searchQuery.trim() ||
              (searchFileType === "OTHER_EXTENSION" &&
                !customSearchFileType.trim())
            }
            className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-md disabled:opacity-60 flex items-center justify-center space-x-2 min-w-[160px] transition-all duration-200"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Searching Assets...</span>
              </>
            ) : (
              <>
                <SearchIcon className="h-5 w-5" />
                <span>Find Creative Assets</span>
              </>
            )}
          </button>

          {searchResults.length > 0 && (
            <>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-slate-100 text-sm"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 text-slate-100 text-sm"
              >
                <option key="relevance" value="relevance">
                  Sort by Relevance
                </option>
                <option key="safety" value="safety">
                  Sort by Safety
                </option>
                <option key="category" value="category">
                  Sort by Category
                </option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {searchError && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-red-400 text-sm flex items-center">
            <span className="mr-2">⚠️</span>
            {searchError}
          </p>
        </div>
      )}

      {/* Enhanced Loading */}
      {isSearching && searchResults.length === 0 && (
        <div className="py-10 space-y-4">
          <LoadingSpinner />
          <div className="text-center space-y-2">
            <p className="text-purple-400 font-medium">
              🎨 Searching creative asset databases...
            </p>
            <p className="text-slate-400 text-sm">
              Scanning{" "}
              {assetType === "free"
                ? "free"
                : assetType === "paid"
                  ? "premium"
                  : "free & premium"}{" "}
              platforms for {searchFileType || "creative assets"} related to "
              {searchQuery}"
            </p>
            <p className="text-slate-500 text-xs">
              Searching verified asset websites with guaranteed availability...
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 text-xs">
              <div className="text-purple-300 animate-pulse">📹 VideoHive</div>
              <div className="text-pink-300 animate-pulse">🎵 AudioJungle</div>
              <div className="text-blue-300 animate-pulse">🎨 GraphicRiver</div>
              <div className="text-green-300 animate-pulse">🌐 GitHub</div>
              <div className="text-orange-300 animate-pulse">📷 Unsplash</div>
              <div className="text-red-300 animate-pulse">🔤 Google Fonts</div>
              <div className="text-yellow-300 animate-pulse">📐 TurboSquid</div>
              <div className="text-cyan-300 animate-pulse">🎬 Motion Array</div>
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 mt-3">
              <span className="animate-pulse">⏳</span>
              <span>
                Comprehensive search takes 3-7 seconds for quality results
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              {filteredAndSortedResults.length} of {searchResults.length}{" "}
              results
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </span>
            <span>Sorted by {sortBy}</span>
          </div>

          <div className="space-y-3 pr-2">
            {filteredAndSortedResults.map((result, index) => (
              <div
                key={result.uri || index}
                className="p-4 bg-slate-700/60 border border-slate-600 rounded-lg hover:bg-slate-700/80 transition-colors"
              >
                <div className="flex flex-col space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <a
                      href={result.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 hover:underline font-medium break-all flex-grow group"
                    >
                      {result.title || result.uri}
                      <ArrowUpRightIcon className="inline h-4 w-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <div className="flex-shrink-0">
                      {result.safetyScore !== undefined &&
                        getSafetyBadge(result.safetyScore)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {result.category && getCategoryBadge(result.category)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownloadFile(result)}
                        disabled={downloadingFiles.has(result.uri)}
                        className="inline-flex items-center px-2 py-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
                        title={`Download ${searchFileType || "file"} with resource information`}
                      >
                        <DownloadIcon className="h-3 w-3 mr-1" />
                        {downloadingFiles.has(result.uri)
                          ? "Generating..."
                          : `Get ${searchFileType || "File"}`}
                      </button>
                      <span className="text-xs text-slate-500">
                        Safety: {result.safetyScore}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 break-all">
                    {result.uri}
                  </p>
                </div>
              </div>
            ))}

            {canLoadMoreSearchResults && !isSearching && (
              <button
                onClick={() => handlePerformWebSearch(true)}
                disabled={isSearching}
                className="w-full mt-4 px-4 py-3 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <DocumentTextIcon className="h-4 w-4" />
                <span>Load More Results</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      {searchResults.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
            <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
              <TagIcon className="h-4 w-4 mr-1" />
              Safety Guide
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">🛡️</span>
                <span className="text-slate-400">
                  Safe: Trusted, verified domains
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">⚠️</span>
                <span className="text-slate-400">
                  Caution: Unknown or mixed signals
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-400">⚠️</span>
                <span className="text-slate-400">
                  Warning: Potentially risky
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-900/30 rounded-lg border border-indigo-700/50">
            <h4 className="text-sm font-medium text-indigo-300 mb-2 flex items-center">
              <DownloadIcon className="h-4 w-4 mr-1" />
              File Generation Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-indigo-400">📄</span>
                <span className="text-slate-400">
                  PDF, TXT, JSON, CSV, HTML, MD, XML
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-400">🔗</span>
                <span className="text-slate-400">
                  Contains original URL and metadata
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-400">🏷️</span>
                <span className="text-slate-400">
                  Keywords and category information
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-400">⚡</span>
                <span className="text-slate-400">
                  Instant download with requested extension
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedWebSearch;
