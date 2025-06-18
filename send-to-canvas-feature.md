# Send to Canvas Feature

## ✅ **Feature Overview**

Added a powerful "Send to Canvas" feature that allows users to selectively send different parts of generated content to the canvas workspace for further editing and organization.

## 🎯 **Key Features**

### **Smart Content Detection**

- **Automatically detects content type** and provides relevant options
- **Intelligent parsing** for scripts (Hook, Main Content, CTA)
- **Structured content support** for Content Briefs, etc.
- **Multiple size options** (Full content, sections, snippets)

### **Flexible Selection Options**

- 📄 **Full Content** - Send entire generated output
- 🔸 **First Section** - Send first paragraph/section only
- ✂️ **Custom Snippets** - Send first 100 characters with "..."
- 📋 **Structured Data** - Send formatted JSON for complex outputs

### **Script-Specific Options** (for ContentType.Script)

- 🎣 **Hook Only** - Extract and send just the hook section
- 📖 **Main Content Only** - Extract main content without hook/CTA
- 📢 **CTA Only** - Extract call-to-action section

### **Content Brief Options**

- 📌 **Title Suggestions Only** - Send just the title suggestions
- 🎯 **Key Angles Only** - Send key angles as separate items

## 🚀 **How It Works**

### **User Interface**

1. Generate content in the generator
2. Look for the green **"Send to Canvas"** button in the action bar
3. Click to open dropdown with content options
4. Select which part of the content to send
5. Content automatically appears on canvas as a text element

### **Smart Positioning**

- Content appears at random positions to avoid overlap
- Automatically switches to Canvas tab
- New text element is selected for immediate editing
- Dynamic sizing based on content length

### **Canvas Integration**

- Creates **text elements** on canvas
- Maintains original formatting
- Fully editable once on canvas
- Can be styled, resized, and repositioned

## 🛠 **Technical Implementation**

### **Components Updated**

- `GeneratorOutput.tsx` - Added send to canvas UI and options logic
- `GeneratorLayout.tsx` - Pass-through props for canvas functionality
- `App.tsx` - Canvas item creation and state management
- `IconComponents.tsx` - Added canvas icon (🎨)

### **New Functions**

```typescript
// Main canvas integration function
const handleSendToCanvas = useCallback(
  (content: string, title: string) => {
    // Creates text element on canvas with dynamic sizing
    // Automatically positions and selects new item
    // Switches to canvas tab
  },
  [canvasItems, nextZIndex, canvasOffset, zoomLevel],
);

// Content parsing and options generation
const getSendToCanvasOptions = () => {
  // Analyzes output type and content structure
  // Generates appropriate options for different content types
  // Handles text extraction for scripts, briefs, etc.
};
```

### **Content Parsing Logic**

- **Text Content**: Full content, sections, snippets
- **Scripts**: Pattern matching for HOOK, MAIN CONTENT, CTA sections
- **Structured Data**: JSON formatting with specific field extraction
- **Dynamic Options**: Different options based on content type and length

## ✨ **User Experience**

### **Visual Design**

- **Green button** to distinguish from other actions
- **Dropdown interface** with clear icons and labels
- **Hover effects** and smooth transitions
- **Click-outside to close** dropdown

### **Smart Defaults**

- **Dynamic canvas positioning** prevents overlap
- **Automatic sizing** based on content length
- **Immediate selection** of new canvas items
- **Tab switching** for seamless workflow

### **Content Options Examples**

#### **For Scripts:**

- 📄 Full Content → Complete script
- 🎣 Hook Only → "Hey there! Did you know..."
- 📖 Main Content Only → "In this video, we'll cover..."
- 📢 CTA Only → "Don't forget to subscribe!"

#### **For Content Briefs:**

- 📄 Full Structured Content → Complete JSON
- 📌 Title Suggestions Only → List of titles
- 🎯 Key Angles Only → Key messaging points

#### **For Any Content:**

- 🔸 First Section → Opening paragraph
- ✂️ First 100 Characters → Quick snippet preview

## 🎨 **Canvas Benefits**

### **Content Organization**

- **Visual layout** of different content pieces
- **Side-by-side comparison** of options
- **Drag and drop** positioning
- **Layered organization** with z-index

### **Further Editing**

- **Text styling** (fonts, colors, sizes)
- **Background customization**
- **Border and formatting** options
- **Collaborative annotations**

### **Workflow Integration**

- **Template creation** from canvas layouts
- **Export capabilities** for presentations
- **Screenshot generation** for documentation
- **Version comparison** across iterations

## 🔮 **Future Enhancements**

### **Planned Features**

- **Batch send** multiple content sections at once
- **Custom section selection** with text highlighting
- **Template-based positioning** for consistent layouts
- **Content linking** between related canvas items
- **Auto-arrangement** options for better layouts

### **Advanced Parsing**

- **Markdown detection** and formatted sending
- **List item separation** for bullet points
- **Table extraction** for structured data
- **Quote highlighting** for key messages

The Send to Canvas feature bridges the gap between content generation and visual organization, enabling users to create comprehensive content layouts and workflows directly in the application! 🎉
