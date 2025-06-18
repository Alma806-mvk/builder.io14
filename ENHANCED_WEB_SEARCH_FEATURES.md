# Enhanced Web Search Features

## Overview

The Enhanced Web Search component provides advanced search capabilities with safety guarantees, categorization, and improved user interface.

## Key Features

### 1. Extension-Based Search by Default

- The search automatically prioritizes results by file extension when specified
- Pre-configured with video editing extensions (.prproj, .aep, .mogrt, etc.)
- Custom extension support for any file type

### 2. Safety Scoring System

Each search result is automatically scored for safety (0-100) based on:

#### High Trust Indicators (+40 points)

- **Trusted Domains**: Google, YouTube, GitHub, StackOverflow, Wikipedia, Adobe, etc.
- **Educational Sites**: .edu domains, Coursera, Udemy, Khan Academy
- **Popular Platforms**: Microsoft, Apple, Mozilla

#### Security Bonuses

- **HTTPS**: +10 points for secure connections
- **Common TLDs**: +5 points for .com, .org, .edu domains

#### Risk Factors (-30 points)

- **URL Shorteners**: bit.ly, tinyurl, t.co
- **IP Addresses**: Direct numerical IP access
- **Suspicious Patterns**: "download now", "click here", etc.

### 3. Automatic Categorization

Results are automatically categorized into:

| Category             | Description                       | Domains                           |
| -------------------- | --------------------------------- | --------------------------------- |
| 🛒 **Gumroad**       | Digital marketplace for creators  | gumroad.com                       |
| 📁 **Google Drive**  | Cloud storage and documents       | drive.google.com, docs.google.com |
| 📦 **Dropbox**       | Cloud storage platform            | dropbox.com                       |
| 🐙 **GitHub**        | Code repository and collaboration | github.com                        |
| 📺 **YouTube**       | Video sharing platform            | youtube.com, youtu.be             |
| 🎨 **Freepik**       | Stock photos and graphics         | freepik.com                       |
| 📷 **Unsplash**      | Free stock photography            | unsplash.com                      |
| 🖼️ **Adobe Stock**   | Premium stock assets              | stock.adobe.com                   |
| 🎓 **Educational**   | Learning resources                | .edu, coursera.org, udemy.com     |
| 📚 **Documentation** | Technical documentation           | docs._, wiki_, manual\*           |

### 4. Enhanced User Interface

#### Search Controls

- **Smart Search**: Automatically searches by extension when specified
- **File Type Selector**: Pre-configured extensions + custom input
- **Real-time Search**: Enter key support for quick searching

#### Result Management

- **Category Filtering**: Filter results by specific categories
- **Sorting Options**:
  - Relevance (default)
  - Safety score (highest first)
  - Category (alphabetical)
- **Load More**: Infinite scroll with unique result deduplication

#### Safety Indicators

- 🟢 **Safe** (70-100): Trusted, verified domains
- 🟡 **Caution** (40-69): Unknown or mixed signals
- 🔴 **Warning** (0-39): Potentially risky

### 5. Result Display

Each result shows:

- **Clickable Title**: Opens in new tab with security attributes
- **Safety Badge**: Visual safety indicator with score
- **Category Badge**: Color-coded category with description tooltip
- **Full URL**: Complete URL for transparency
- **Safety Score**: Numerical score (0-100)

### 6. Safety Guide

Built-in legend explains the safety scoring system to help users make informed decisions about which links to visit.

## Technical Implementation

### Security Features

- `rel="noopener noreferrer"` on all external links
- URL validation and sanitization
- Pattern matching for known threats
- Domain reputation checking

### Performance

- Debounced search to prevent API spam
- Result deduplication by URL
- Efficient category filtering
- Optimized re-renders with useMemo and useCallback

### Accessibility

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader friendly

## Usage Tips

1. **Specify Extensions**: Always select a file type for more targeted results
2. **Check Safety Scores**: Pay attention to safety badges before clicking
3. **Use Categories**: Filter by category to find specific types of resources
4. **Sort by Safety**: When security is a priority, sort by safety score
5. **Verify Links**: Always verify downloads from unknown sources

## Future Enhancements

- **Domain Whitelist/Blacklist**: User-customizable trusted domains
- **Result Preview**: Hover preview of website content
- **Download Safety**: Additional scanning for downloadable files
- **User Reporting**: Community-driven safety reporting
- **Integration**: Direct integration with cloud storage for safe downloads
