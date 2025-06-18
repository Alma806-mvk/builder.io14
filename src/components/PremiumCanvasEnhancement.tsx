import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  AdjustmentsHorizontalIcon as Settings,
  SwatchIcon as Palette,
  PaintBrushIcon as Paintbrush,
  CursorArrowRaysIcon as MousePointer,
  BoldIcon as Bold,
  ItalicIcon as Italic,
  UnderlineIcon as Underline,
  PlusCircleIcon as Plus,
  MinusCircleIcon as Minus,
  ClipboardIcon as Copy,
  SparklesIcon as Sparkles,
  StarShapeIcon as Star,
  RightArrowIcon as ArrowRight,
  EyeIcon as Eye,
  EyeSlashIcon as EyeOff,
  PlayCircleIcon as Play,
  ChevronDownIcon as ChevronDown,
  RectangleIcon as Square,
  CircleIcon as Circle,
  TriangleIcon as Triangle,
  TypeToolIcon as Type,
  StickyNoteIcon,
  PhotoIcon as ImagePlus,
  FrameIcon as Frame,
  MessageSquareIcon as MessageSquare,
  TableIcon as Layers,
  RefreshIcon as RotateCw,
} from "./IconComponents";
import { CanvasItem, CanvasItemType, ShapeVariant } from "../../types";
import { CANVAS_SHAPE_VARIANTS } from "../../constants";

// Create simple icon components for missing icons
const Move: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <span style={{ fontSize: `${size}px` }}>↔️</span>
);
const AlignLeft: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <span style={{ fontSize: `${size}px` }}>⬅</span>
);
const AlignCenter: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <span style={{ fontSize: `${size}px` }}>⬌</span>
);
const AlignRight: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <span style={{ fontSize: `${size}px` }}>➡</span>
);
const Lock: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <span style={{ fontSize: `${size}px` }}>🔒</span>
);
const Unlock: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <span style={{ fontSize: `${size}px` }}>🔓</span>
);
const Layers3: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <span style={{ fontSize: `${size}px` }}>📚</span>
);

// Helper functions for shape library
const getShapeCategory = (shape: string): string => {
  const categoryMap: Record<string, string> = {
    rectangle: "Basic Shapes",
    roundedRectangle: "Basic Shapes",
    circle: "Basic Shapes",
    ellipse: "Basic Shapes",
    triangle: "Basic Shapes",
    diamond: "Basic Shapes",
    hexagon: "Basic Shapes",
    pentagon: "Basic Shapes",
    octagon: "Basic Shapes",
    parallelogram: "Basic Shapes",
    trapezoid: "Basic Shapes",
    rightArrow: "Arrows",
    leftArrow: "Arrows",
    upArrow: "Arrows",
    downArrow: "Arrows",
    doubleArrow: "Arrows",
    star: "Symbols",
    heart: "Symbols",
    cloud: "Symbols",
    lightning: "Symbols",
    shield: "Symbols",
    gear: "Symbols",
    plus: "Symbols",
    cross: "Symbols",
    checkmark: "Symbols",
    x: "Symbols",
    speechBubble: "Communication",
    bell: "Communication",
    mail: "Communication",
    phone: "Communication",
    location: "Interface",
    home: "Interface",
    user: "Interface",
    info: "Interface",
    warning: "Interface",
    folder: "Interface",
    file: "Interface",
    link: "Interface",
    eye: "Interface",
    lock: "Interface",
    key: "Interface",
    search: "Interface",
    settings: "Interface",
    camera: "Media",
    image: "Media",
    video: "Media",
    music: "Media",
    volume: "Media",
    wifi: "Technology",
    battery: "Technology",
    download: "Technology",
    upload: "Technology",
    refresh: "Technology",
    calendar: "Organization",
    clock: "Organization",
    bookmark: "Organization",
    tag: "Organization",
    paperclip: "Organization",
  };
  return categoryMap[shape] || "Other";
};

const getShapeLabel = (shape: string): string => {
  const labelMap: Record<string, string> = {
    rectangle: "Rectangle",
    roundedRectangle: "Rounded Rect",
    circle: "Circle",
    ellipse: "Ellipse",
    triangle: "Triangle",
    diamond: "Diamond",
    hexagon: "Hexagon",
    pentagon: "Pentagon",
    octagon: "Octagon",
    parallelogram: "Parallelogram",
    trapezoid: "Trapezoid",
    rightArrow: "Right Arrow",
    leftArrow: "Left Arrow",
    upArrow: "Up Arrow",
    downArrow: "Down Arrow",
    doubleArrow: "Double Arrow",
    star: "Star",
    heart: "Heart",
    cloud: "Cloud",
    lightning: "Lightning",
    shield: "Shield",
    gear: "Gear",
    plus: "Plus",
    cross: "Cross",
    checkmark: "Check",
    x: "X Mark",
    speechBubble: "Speech",
    bell: "Bell",
    location: "Location",
    home: "Home",
    user: "User",
    info: "Info",
    warning: "Warning",
    folder: "Folder",
    file: "File",
    link: "Link",
    eye: "Eye",
    lock: "Lock",
    key: "Key",
    mail: "Mail",
    phone: "Phone",
    calendar: "Calendar",
    clock: "Clock",
    search: "Search",
    settings: "Settings",
    camera: "Camera",
    image: "Image",
    video: "Video",
    music: "Music",
    volume: "Volume",
    wifi: "WiFi",
    battery: "Battery",
    download: "Download",
    upload: "Upload",
    refresh: "Refresh",
    bookmark: "Bookmark",
    tag: "Tag",
    paperclip: "Paperclip",
  };
  return labelMap[shape] || shape;
};

const getShapeEmoji = (shape: string): string => {
  const emojiMap: Record<string, string> = {
    rectangle: "⬜",
    roundedRectangle: "▢",
    circle: "⭕",
    ellipse: "⭕",
    triangle: "🔺",
    diamond: "💎",
    hexagon: "⬡",
    pentagon: "⬟",
    octagon: "⛔",
    parallelogram: "▱",
    trapezoid: "⬢",
    rightArrow: "➡️",
    leftArrow: "⬅️",
    upArrow: "⬆️",
    downArrow: "⬇️",
    doubleArrow: "↔️",
    star: "⭐",
    heart: "❤️",
    cloud: "☁️",
    lightning: "⚡",
    shield: "🛡️",
    gear: "⚙️",
    plus: "➕",
    cross: "❌",
    checkmark: "✅",
    x: "❌",
    speechBubble: "💬",
    bell: "🔔",
    location: "📍",
    home: "🏠",
    user: "👤",
    info: "ℹ️",
    warning: "⚠️",
    folder: "📁",
    file: "📄",
    link: "🔗",
    eye: "👁️",
    lock: "🔒",
    key: "🔑",
    mail: "📧",
    phone: "📞",
    calendar: "📅",
    clock: "🕐",
    search: "🔍",
    settings: "⚙️",
    camera: "📷",
    image: "🖼️",
    video: "🎥",
    music: "🎵",
    volume: "🔊",
    wifi: "📶",
    battery: "🔋",
    download: "⬇️",
    upload: "⬆️",
    refresh: "🔄",
    bookmark: "🔖",
    tag: "🏷️",
    paperclip: "📎",
  };
  return emojiMap[shape] || "⬜";
};
import { CanvasItem, CanvasItemType, ShapeVariant } from "../../types";

interface PremiumCanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
  order: number;
}

interface PremiumCanvasTool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  cursor: string;
  category: "select" | "draw" | "shape" | "text" | "media";
  shortcut?: string;
}

interface PremiumCanvasEnhancementProps {
  canvasItems: CanvasItem[];
  selectedCanvasItemId: string | null;
  setSelectedCanvasItemId: React.Dispatch<React.SetStateAction<string | null>>;
  onUpdateCanvasItem: (id: string, updates: Partial<CanvasItem>) => void;
  onAddCanvasItem: (type: CanvasItemType, props?: Partial<CanvasItem>) => void;
  onDeleteCanvasItem: (id: string) => void;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  canvasOffset: { x: number; y: number };
  setCanvasOffset: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
}

const PremiumCanvasEnhancement: React.FC<PremiumCanvasEnhancementProps> = ({
  canvasItems,
  selectedCanvasItemId,
  setSelectedCanvasItemId,
  onUpdateCanvasItem,
  onAddCanvasItem,
  onDeleteCanvasItem,
  zoomLevel,
  setZoomLevel,
  canvasOffset,
  setCanvasOffset,
}) => {
  // Enhanced State
  const [currentTool, setCurrentTool] = useState("select");
  const [showLayers, setShowLayers] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(25);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Layers System
  const [layers, setLayers] = useState<PremiumCanvasLayer[]>([
    {
      id: "background",
      name: "Background",
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: "normal",
      order: 0,
    },
    {
      id: "main",
      name: "Main Content",
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: "normal",
      order: 1,
    },
    {
      id: "overlay",
      name: "Overlay",
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: "normal",
      order: 2,
    },
  ]);
  const [currentLayer, setCurrentLayer] = useState("main");

  // Theme and UI State
  const [canvasTheme, setCanvasTheme] = useState("dark");
  const [currentColor, setCurrentColor] = useState("#3b82f6");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);

  // Animation State
  const [isAnimationMode, setIsAnimationMode] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Shape Library State
  const [showShapeLibrary, setShowShapeLibrary] = useState(false);

  // Refs
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Premium Tools Configuration
  const premiumTools: PremiumCanvasTool[] = useMemo(
    () => [
      {
        id: "select",
        name: "Select",
        icon: MousePointer,
        cursor: "default",
        category: "select",
        shortcut: "V",
      },
      {
        id: "move",
        name: "Move",
        icon: Move,
        cursor: "move",
        category: "select",
        shortcut: "M",
      },
      {
        id: "brush",
        name: "Brush",
        icon: Paintbrush,
        cursor: "crosshair",
        category: "draw",
        shortcut: "B",
      },
      {
        id: "pen",
        name: "Pen Tool",
        icon: Type,
        cursor: "crosshair",
        category: "draw",
        shortcut: "P",
      },
      {
        id: "eraser",
        name: "Eraser",
        icon: Type,
        cursor: "crosshair",
        category: "draw",
        shortcut: "E",
      },
      {
        id: "text",
        name: "Text",
        icon: Type,
        cursor: "text",
        category: "text",
        shortcut: "T",
      },
      {
        id: "line",
        name: "Line",
        icon: Type,
        cursor: "crosshair",
        category: "draw",
        shortcut: "L",
      },
      {
        id: "rectangle",
        name: "Rectangle",
        icon: Square,
        cursor: "crosshair",
        category: "shape",
        shortcut: "R",
      },
      {
        id: "circle",
        name: "Circle",
        icon: Circle,
        cursor: "crosshair",
        category: "shape",
        shortcut: "C",
      },
      {
        id: "polygon",
        name: "Polygon",
        icon: Triangle,
        cursor: "crosshair",
        category: "shape",
        shortcut: "G",
      },
      {
        id: "sticky",
        name: "Sticky Note",
        icon: StickyNoteIcon,
        cursor: "crosshair",
        category: "media",
        shortcut: "N",
      },
      {
        id: "image",
        name: "Image",
        icon: ImagePlus,
        cursor: "crosshair",
        category: "media",
        shortcut: "I",
      },
      {
        id: "frame",
        name: "Frame",
        icon: Frame,
        cursor: "crosshair",
        category: "media",
        shortcut: "F",
      },
      {
        id: "comment",
        name: "Comment",
        icon: MessageSquare,
        cursor: "crosshair",
        category: "media",
        shortcut: "K",
      },
    ],
    [],
  );

  // Theme Configuration
  const themes = {
    dark: {
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      gridColor: "#334155",
      textColor: "#f1f5f9",
      panelBg: "#1e293b",
      borderColor: "#334155",
    },
    light: {
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      gridColor: "#cbd5e1",
      textColor: "#0f172a",
      panelBg: "#ffffff",
      borderColor: "#e2e8f0",
    },
    neon: {
      background: "linear-gradient(135deg, #000000 0%, #1a0033 100%)",
      gridColor: "#ff00ff",
      textColor: "#ffffff",
      panelBg: "#1a0033",
      borderColor: "#ff00ff",
    },
  };

  const currentTheme = themes[canvasTheme as keyof typeof themes];

  // Sync selected items with existing selection
  useEffect(() => {
    if (selectedCanvasItemId) {
      setSelectedIds([selectedCanvasItemId]);
    } else {
      setSelectedIds([]);
    }
  }, [selectedCanvasItemId]);

  // Enhanced Functions
  const duplicateSelectedItems = useCallback(() => {
    const itemsToDuplicate = canvasItems.filter((item) =>
      selectedIds.includes(item.id),
    );
    itemsToDuplicate.forEach((item) => {
      const newItem = {
        ...item,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        x: item.x + 20,
        y: item.y + 20,
      };
      onAddCanvasItem(item.type, newItem);
    });
  }, [canvasItems, selectedIds, onAddCanvasItem]);

  const groupSelectedItems = useCallback(() => {
    if (selectedIds.length < 2) return;
    const groupId = `group_${Date.now()}`;
    selectedIds.forEach((id) => {
      const item = canvasItems.find((item) => item.id === id);
      if (item) {
        onUpdateCanvasItem(id, { ...item, groupId: groupId } as any);
      }
    });
  }, [selectedIds, canvasItems, onUpdateCanvasItem]);

  const alignItems = useCallback(
    (alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
      if (selectedIds.length < 2) return;

      const selectedItems = canvasItems.filter((item) =>
        selectedIds.includes(item.id),
      );
      const bounds = {
        left: Math.min(...selectedItems.map((item) => item.x)),
        right: Math.max(
          ...selectedItems.map((item) => item.x + (item.width || 200)),
        ),
        top: Math.min(...selectedItems.map((item) => item.y)),
        bottom: Math.max(
          ...selectedItems.map((item) => item.y + (item.height || 100)),
        ),
      };

      selectedItems.forEach((item) => {
        let newX = item.x;
        let newY = item.y;

        switch (alignment) {
          case "left":
            newX = bounds.left;
            break;
          case "center":
            newX =
              bounds.left +
              (bounds.right - bounds.left) / 2 -
              (item.width || 200) / 2;
            break;
          case "right":
            newX = bounds.right - (item.width || 200);
            break;
          case "top":
            newY = bounds.top;
            break;
          case "middle":
            newY =
              bounds.top +
              (bounds.bottom - bounds.top) / 2 -
              (item.height || 100) / 2;
            break;
          case "bottom":
            newY = bounds.bottom - (item.height || 100);
            break;
        }

        onUpdateCanvasItem(item.id, { x: newX, y: newY });
      });
    },
    [selectedIds, canvasItems, onUpdateCanvasItem],
  );

  const bringToFront = useCallback(() => {
    if (selectedIds.length === 0) return;
    const maxZIndex = Math.max(...canvasItems.map((item) => item.zIndex || 0));
    selectedIds.forEach((id) => {
      onUpdateCanvasItem(id, { zIndex: maxZIndex + 1 });
    });
  }, [selectedIds, canvasItems, onUpdateCanvasItem]);

  const sendToBack = useCallback(() => {
    if (selectedIds.length === 0) return;
    const minZIndex = Math.min(...canvasItems.map((item) => item.zIndex || 0));
    selectedIds.forEach((id) => {
      onUpdateCanvasItem(id, { zIndex: minZIndex - 1 });
    });
  }, [selectedIds, canvasItems, onUpdateCanvasItem]);

  // Color Picker Functions
  const handleColorChange = useCallback(
    (color: string) => {
      setCurrentColor(color);
      if (selectedIds.length > 0) {
        selectedIds.forEach((id) => {
          const item = canvasItems.find((item) => item.id === id);
          if (item) {
            if (
              item.type === "textElement" ||
              item.type === "stickyNote" ||
              item.type === "commentElement"
            ) {
              onUpdateCanvasItem(id, { textColor: color });
            } else {
              onUpdateCanvasItem(id, { backgroundColor: color });
            }
          }
        });
      }
    },
    [selectedIds, canvasItems, onUpdateCanvasItem],
  );

  // Effects Functions
  const applyEffectToSelected = useCallback(
    (effect: string) => {
      if (selectedIds.length === 0) return;

      selectedIds.forEach((id) => {
        const item = canvasItems.find((item) => item.id === id);
        if (!item) return;

        let updates: any = {};

        switch (effect) {
          case "shadow":
            updates = {
              ...item,
              style: {
                ...((item as any).style || {}),
                boxShadow:
                  "0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.15)",
              },
            };
            break;
          case "gradient":
            updates = {
              ...item,
              backgroundColor: `linear-gradient(135deg, ${currentColor}, ${adjustColorBrightness(currentColor, -30)})`,
            };
            break;
          case "blur":
            updates = {
              ...item,
              style: {
                ...((item as any).style || {}),
                filter: "blur(2px)",
              },
            };
            break;
          case "glow":
            updates = {
              ...item,
              style: {
                ...((item as any).style || {}),
                boxShadow: `0 0 20px ${currentColor}, 0 0 40px ${currentColor}40`,
              },
            };
            break;
          case "radius":
            updates = {
              ...item,
              style: {
                ...((item as any).style || {}),
                borderRadius: "12px",
              },
            };
            break;
        }

        onUpdateCanvasItem(id, updates);
      });
    },
    [selectedIds, canvasItems, onUpdateCanvasItem, currentColor],
  );

  // Transform Functions
  const transformSelected = useCallback(
    (transform: string) => {
      if (selectedIds.length === 0) return;

      selectedIds.forEach((id) => {
        const item = canvasItems.find((item) => item.id === id);
        if (!item) return;

        let updates: any = {};

        switch (transform) {
          case "flipH":
            updates = {
              ...item,
              style: {
                ...((item as any).style || {}),
                transform: `${(item as any).style?.transform || ""} scaleX(-1)`,
              },
            };
            break;
          case "flipV":
            updates = {
              ...item,
              style: {
                ...((item as any).style || {}),
                transform: `${(item as any).style?.transform || ""} scaleY(-1)`,
              },
            };
            break;
          case "rotate90":
            updates = {
              ...item,
              style: {
                ...((item as any).style || {}),
                transform: `${(item as any).style?.transform || ""} rotate(90deg)`,
              },
            };
            break;
          case "reset":
            updates = {
              ...item,
              style: {
                ...((item as any).style || {}),
                transform: "none",
                filter: "none",
                boxShadow: "none",
              },
            };
            break;
        }

        onUpdateCanvasItem(id, updates);
      });
    },
    [selectedIds, canvasItems, onUpdateCanvasItem],
  );

  // Helper function to adjust color brightness
  const adjustColorBrightness = (color: string, percent: number): string => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "d":
            e.preventDefault();
            duplicateSelectedItems();
            break;
          case "g":
            e.preventDefault();
            groupSelectedItems();
            break;
          case "a":
            e.preventDefault();
            setSelectedIds(canvasItems.map((item) => item.id));
            break;
        }
      } else {
        switch (e.key) {
          case "Delete":
          case "Backspace":
            selectedIds.forEach((id) => onDeleteCanvasItem(id));
            setSelectedIds([]);
            break;
          case "Escape":
            setSelectedIds([]);
            setSelectedCanvasItemId(null);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedIds,
    canvasItems,
    onDeleteCanvasItem,
    duplicateSelectedItems,
    groupSelectedItems,
    setSelectedCanvasItemId,
  ]);

  // Click outside to close color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If not showing any enhancements, return null
  if (!showLayers && !showProperties && !showAdvancedTools) {
    return (
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          gap: "8px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setShowAdvancedTools(true)}
          style={{
            padding: "8px 12px",
            backgroundColor: "#8b5cf6",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 600,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s",
          }}
          title="Enable Premium Canvas Features"
        >
          <Sparkles size={16} />
          Premium Tools
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {/* Advanced Tools Panel */}
      {showAdvancedTools && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            backgroundColor: currentTheme.panelBg,
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            border: `1px solid ${currentTheme.borderColor}`,
            backdropFilter: "blur(20px)",
            pointerEvents: "auto",
            color: currentTheme.textColor,
            fontSize: "12px",
          }}
        >
          {/* Premium Tools */}
          <div style={{ display: "flex", gap: "4px" }}>
            {premiumTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setCurrentTool(tool.id)}
                style={{
                  ...buttonStyle,
                  backgroundColor:
                    currentTool === tool.id ? "#3b82f6" : "transparent",
                  color: currentTool === tool.id ? "#ffffff" : "inherit",
                }}
                title={`${tool.name} (${tool.shortcut})`}
              >
                <tool.icon size={16} />
              </button>
            ))}
          </div>

          <div style={separatorStyle} />

          {/* Color Picker */}
          <div style={{ position: "relative" }} ref={colorPickerRef}>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              style={{
                ...buttonStyle,
                backgroundColor: currentColor,
                border: "2px solid #ffffff",
                borderRadius: "6px",
                width: "32px",
                height: "32px",
              }}
              title="Color Picker"
            />

            {showColorPicker && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: "8px",
                  backgroundColor: currentTheme.panelBg,
                  border: `1px solid ${currentTheme.borderColor}`,
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  zIndex: 1000,
                  minWidth: "240px",
                }}
              >
                <div style={{ marginBottom: "12px" }}>
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    style={{
                      width: "100%",
                      height: "40px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(8, 1fr)",
                    gap: "4px",
                  }}
                >
                  {[
                    "#ef4444",
                    "#f97316",
                    "#f59e0b",
                    "#eab308",
                    "#84cc16",
                    "#22c55e",
                    "#10b981",
                    "#14b8a6",
                    "#06b6d4",
                    "#0ea5e9",
                    "#3b82f6",
                    "#6366f1",
                    "#8b5cf6",
                    "#a855f7",
                    "#d946ef",
                    "#ec4899",
                    "#f43f5e",
                    "#000000",
                    "#374151",
                    "#6b7280",
                    "#9ca3af",
                    "#d1d5db",
                    "#e5e7eb",
                    "#f3f4f6",
                    "#ffffff",
                    "#fbbf24",
                    "#fb7185",
                    "#34d399",
                    "#60a5fa",
                    "#c084fc",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: color,
                        border:
                          currentColor === color
                            ? "2px solid #ffffff"
                            : "1px solid #00000020",
                        borderRadius: "4px",
                        cursor: "pointer",
                        padding: 0,
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={separatorStyle} />

          {/* Alignment Tools */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => alignItems("left")}
              disabled={selectedIds.length < 2}
              style={buttonStyle}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              onClick={() => alignItems("center")}
              disabled={selectedIds.length < 2}
              style={buttonStyle}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              onClick={() => alignItems("right")}
              disabled={selectedIds.length < 2}
              style={buttonStyle}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
          </div>

          <div style={separatorStyle} />

          {/* Object Operations */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={duplicateSelectedItems}
              disabled={selectedIds.length === 0}
              style={buttonStyle}
              title="Duplicate (Ctrl+D)"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={bringToFront}
              disabled={selectedIds.length === 0}
              style={buttonStyle}
              title="Bring to Front"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={sendToBack}
              disabled={selectedIds.length === 0}
              style={buttonStyle}
              title="Send to Back"
            >
              <Minus size={16} />
            </button>
          </div>

          <div style={separatorStyle} />

          {/* Effects & Filters */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              style={buttonStyle}
              title="Add Drop Shadow"
              onClick={() => applyEffectToSelected("shadow")}
              disabled={selectedIds.length === 0}
            >
              <span style={{ fontSize: "16px" }}>🌫️</span>
            </button>
            <button
              style={buttonStyle}
              title="Add Gradient Fill"
              onClick={() => applyEffectToSelected("gradient")}
              disabled={selectedIds.length === 0}
            >
              <span style={{ fontSize: "16px" }}>🌈</span>
            </button>
            <button
              style={buttonStyle}
              title="Add Glow Effect"
              onClick={() => applyEffectToSelected("glow")}
              disabled={selectedIds.length === 0}
            >
              <span style={{ fontSize: "16px" }}>✨</span>
            </button>
            <button
              style={buttonStyle}
              title="Add Border Radius"
              onClick={() => applyEffectToSelected("radius")}
              disabled={selectedIds.length === 0}
            >
              <span style={{ fontSize: "16px" }}>🔲</span>
            </button>
          </div>

          <div style={separatorStyle} />

          {/* Transform Tools */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              style={buttonStyle}
              title="Flip Horizontal"
              onClick={() => transformSelected("flipH")}
              disabled={selectedIds.length === 0}
            >
              <span style={{ fontSize: "16px" }}>↔️</span>
            </button>
            <button
              style={buttonStyle}
              title="Flip Vertical"
              onClick={() => transformSelected("flipV")}
              disabled={selectedIds.length === 0}
            >
              <span style={{ fontSize: "16px" }}>↕️</span>
            </button>
            <button
              style={buttonStyle}
              title="Rotate 90°"
              onClick={() => transformSelected("rotate90")}
              disabled={selectedIds.length === 0}
            >
              <span style={{ fontSize: "16px" }}>🔄</span>
            </button>
            <button
              style={buttonStyle}
              title="Reset Transform"
              onClick={() => transformSelected("reset")}
              disabled={selectedIds.length === 0}
            >
              <span style={{ fontSize: "16px" }}>↩️</span>
            </button>
          </div>

          <div style={separatorStyle} />

          {/* Panel Toggles */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => setShowLayers(!showLayers)}
              style={{
                ...buttonStyle,
                backgroundColor: showLayers ? "#3b82f6" : "transparent",
                color: showLayers ? "#ffffff" : "inherit",
              }}
              title="Toggle Layers"
            >
              <Layers size={16} />
            </button>
            <button
              onClick={() => setShowProperties(!showProperties)}
              style={{
                ...buttonStyle,
                backgroundColor: showProperties ? "#3b82f6" : "transparent",
                color: showProperties ? "#ffffff" : "inherit",
              }}
              title="Toggle Properties"
            >
              <Settings size={16} />
            </button>
          </div>

          <div style={separatorStyle} />

          {/* Close Advanced Tools */}
          <button
            onClick={() => setShowAdvancedTools(false)}
            style={{
              ...buttonStyle,
              backgroundColor: "#ef4444",
              color: "#ffffff",
            }}
            title="Close Advanced Tools"
          >
            ✕
          </button>
        </div>
      )}

      {/* Layers Panel */}
      {showLayers && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            width: "280px",
            backgroundColor: currentTheme.panelBg,
            border: `1px solid ${currentTheme.borderColor}`,
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(20px)",
            pointerEvents: "auto",
            color: currentTheme.textColor,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                Layers
              </h3>
              <button
                onClick={() => setShowLayers(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              {layers
                .slice()
                .reverse()
                .map((layer) => (
                  <div
                    key={layer.id}
                    onClick={() => setCurrentLayer(layer.id)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor:
                        currentLayer === layer.id ? "#3b82f6" : "transparent",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLayers((prev) =>
                          prev.map((l) =>
                            l.id === layer.id
                              ? { ...l, visible: !l.visible }
                              : l,
                          ),
                        );
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        color: "inherit",
                      }}
                    >
                      {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <span style={{ flex: 1 }}>{layer.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLayers((prev) =>
                          prev.map((l) =>
                            l.id === layer.id ? { ...l, locked: !l.locked } : l,
                          ),
                        );
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        color: "inherit",
                      }}
                    >
                      {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              borderTop: `1px solid ${currentTheme.borderColor}`,
            }}
          >
            <h4
              style={{
                margin: "0 0 12px 0",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Quick Add
            </h4>

            {/* Basic Elements */}
            <div style={{ marginBottom: "16px" }}>
              <h5
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "10px",
                  fontWeight: 600,
                  opacity: 0.7,
                }}
              >
                ELEMENTS
              </h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px",
                }}
              >
                {[
                  { type: "textElement", label: "Text", icon: Type },
                  { type: "stickyNote", label: "Note", icon: StickyNoteIcon },
                  { type: "imageElement", label: "Image", icon: ImagePlus },
                  { type: "frameElement", label: "Frame", icon: Frame },
                  {
                    type: "commentElement",
                    label: "Comment",
                    icon: MessageSquare,
                  },
                ].map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => onAddCanvasItem(type as CanvasItemType)}
                    style={{
                      padding: "10px 6px",
                      backgroundColor: currentTheme.borderColor,
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "10px",
                      color: currentTheme.textColor,
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Shapes */}
            <div style={{ marginBottom: "16px" }}>
              <h5
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "10px",
                  fontWeight: 600,
                  opacity: 0.7,
                }}
              >
                POPULAR SHAPES
              </h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "6px",
                }}
              >
                {[
                  { shape: "rectangle", label: "Rectangle", emoji: "⬜" },
                  { shape: "circle", label: "Circle", emoji: "⭕" },
                  { shape: "triangle", label: "Triangle", emoji: "🔺" },
                  { shape: "star", label: "Star", emoji: "⭐" },
                  { shape: "heart", label: "Heart", emoji: "❤️" },
                  { shape: "rightArrow", label: "Arrow", emoji: "➡️" },
                  { shape: "diamond", label: "Diamond", emoji: "💎" },
                  { shape: "hexagon", label: "Hex", emoji: "⬡" },
                  { shape: "cloud", label: "Cloud", emoji: "☁️" },
                ].map(({ shape, label, emoji }) => (
                  <button
                    key={shape}
                    onClick={() =>
                      onAddCanvasItem("shapeElement", {
                        shapeVariant: shape as ShapeVariant,
                      })
                    }
                    style={{
                      padding: "8px 4px",
                      backgroundColor: currentTheme.borderColor,
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "3px",
                      fontSize: "9px",
                      color: currentTheme.textColor,
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: "12px" }}>{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* All Shapes Button */}
            <button
              onClick={() => setShowShapeLibrary(!showShapeLibrary)}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              📐 Browse All {CANVAS_SHAPE_VARIANTS.length}+ Shapes
            </button>
          </div>
        </div>
      )}

      {/* Properties Panel */}
      {showProperties && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "300px",
            backgroundColor: currentTheme.panelBg,
            border: `1px solid ${currentTheme.borderColor}`,
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(20px)",
            pointerEvents: "auto",
            color: currentTheme.textColor,
            maxHeight: "calc(100vh - 100px)",
            overflow: "auto",
          }}
        >
          <div style={{ padding: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>
                Properties
              </h3>
              <button
                onClick={() => setShowProperties(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ✕
              </button>
            </div>

            {selectedIds.length === 0 && (
              <div
                style={{
                  color: `${currentTheme.textColor}80`,
                  fontSize: "12px",
                }}
              >
                Select an element to edit its properties
              </div>
            )}

            {selectedIds.length === 1 &&
              (() => {
                const selectedItem = canvasItems.find(
                  (item) => item.id === selectedIds[0],
                );
                if (!selectedItem) return null;

                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        Transform
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "8px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "11px",
                              marginBottom: "4px",
                              display: "block",
                            }}
                          >
                            X
                          </label>
                          <input
                            type="number"
                            value={Math.round(selectedItem.x)}
                            onChange={(e) =>
                              onUpdateCanvasItem(selectedItem.id, {
                                x: parseFloat(e.target.value),
                              })
                            }
                            style={inputStyle(currentTheme)}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "11px",
                              marginBottom: "4px",
                              display: "block",
                            }}
                          >
                            Y
                          </label>
                          <input
                            type="number"
                            value={Math.round(selectedItem.y)}
                            onChange={(e) =>
                              onUpdateCanvasItem(selectedItem.id, {
                                y: parseFloat(e.target.value),
                              })
                            }
                            style={inputStyle(currentTheme)}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "11px",
                              marginBottom: "4px",
                              display: "block",
                            }}
                          >
                            Width
                          </label>
                          <input
                            type="number"
                            value={selectedItem.width || 200}
                            onChange={(e) =>
                              onUpdateCanvasItem(selectedItem.id, {
                                width: parseFloat(e.target.value),
                              })
                            }
                            style={inputStyle(currentTheme)}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: "11px",
                              marginBottom: "4px",
                              display: "block",
                            }}
                          >
                            Height
                          </label>
                          <input
                            type="number"
                            value={selectedItem.height || 100}
                            onChange={(e) =>
                              onUpdateCanvasItem(selectedItem.id, {
                                height: parseFloat(e.target.value),
                              })
                            }
                            style={inputStyle(currentTheme)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        Appearance
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div>
                          <label
                            style={{
                              fontSize: "11px",
                              marginBottom: "4px",
                              display: "block",
                            }}
                          >
                            Background
                          </label>
                          <input
                            type="color"
                            value={selectedItem.backgroundColor || "#3b82f6"}
                            onChange={(e) =>
                              onUpdateCanvasItem(selectedItem.id, {
                                backgroundColor: e.target.value,
                              })
                            }
                            style={{
                              width: "100%",
                              height: "32px",
                              borderRadius: "4px",
                              border: "none",
                            }}
                          />
                        </div>

                        {(selectedItem.type === "textElement" ||
                          selectedItem.type === "stickyNote" ||
                          selectedItem.type === "commentElement") && (
                          <div>
                            <label
                              style={{
                                fontSize: "11px",
                                marginBottom: "4px",
                                display: "block",
                              }}
                            >
                              Text Color
                            </label>
                            <input
                              type="color"
                              value={selectedItem.textColor || "#000000"}
                              onChange={(e) =>
                                onUpdateCanvasItem(selectedItem.id, {
                                  textColor: e.target.value,
                                })
                              }
                              style={{
                                width: "100%",
                                height: "32px",
                                borderRadius: "4px",
                                border: "none",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

            {selectedIds.length > 1 && (
              <div>
                <h4
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Multiple Selection ({selectedIds.length} items)
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() => alignItems("left")}
                    style={fullButtonStyle(currentTheme)}
                  >
                    Align Left
                  </button>
                  <button
                    onClick={() => alignItems("center")}
                    style={fullButtonStyle(currentTheme)}
                  >
                    Align Center
                  </button>
                  <button
                    onClick={() => alignItems("right")}
                    style={fullButtonStyle(currentTheme)}
                  >
                    Align Right
                  </button>
                  <button
                    onClick={groupSelectedItems}
                    style={fullButtonStyle(currentTheme)}
                  >
                    Group Items
                  </button>
                </div>
              </div>
            )}

            {/* Keyboard Shortcuts Help */}
            <div
              style={{
                marginTop: "20px",
                padding: "12px",
                backgroundColor: `${currentTheme.borderColor}50`,
                borderRadius: "8px",
              }}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                ⌨️ Shortcuts
              </h4>
              <div
                style={{ fontSize: "10px", lineHeight: "1.4", opacity: 0.8 }}
              >
                <div>
                  <strong>V</strong> Select • <strong>M</strong> Move •{" "}
                  <strong>B</strong> Brush • <strong>T</strong> Text
                </div>
                <div>
                  <strong>Ctrl+D</strong> Duplicate • <strong>Ctrl+G</strong>{" "}
                  Group • <strong>Del</strong> Delete
                </div>
                <div>
                  <strong>Ctrl+Z</strong> Undo • <strong>Ctrl+Y</strong> Redo •{" "}
                  <strong>Esc</strong> Deselect
                </div>
                <div>
                  <strong>Ctrl+A</strong> Select All • <strong>Ctrl++</strong>{" "}
                  Zoom In • <strong>Ctrl+-</strong> Zoom Out
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shape Library Modal */}
      {showShapeLibrary && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "800px",
              maxHeight: "80vh",
              backgroundColor: currentTheme.panelBg,
              border: `1px solid ${currentTheme.borderColor}`,
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(20px)",
              overflow: "hidden",
              color: currentTheme.textColor,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px",
                borderBottom: `1px solid ${currentTheme.borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
                🎨 Professional Shape Library
              </h2>
              <button
                onClick={() => setShowShapeLibrary(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "20px",
                  padding: "4px",
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div
              style={{
                padding: "20px",
                overflow: "auto",
                maxHeight: "calc(80vh - 80px)",
              }}
            >
              {/* Shape Categories */}
              {Object.entries(
                CANVAS_SHAPE_VARIANTS.reduce(
                  (acc, shape) => {
                    const category = getShapeCategory(shape);
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(shape);
                    return acc;
                  },
                  {} as Record<string, string[]>,
                ),
              ).map(([category, shapes]) => (
                <div key={category} style={{ marginBottom: "24px" }}>
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#3b82f6",
                    }}
                  >
                    {category}
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(80px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {shapes.map((shape) => (
                      <button
                        key={shape}
                        onClick={() => {
                          onAddCanvasItem("shapeElement", {
                            shapeVariant: shape as ShapeVariant,
                          });
                          setShowShapeLibrary(false);
                        }}
                        style={{
                          padding: "12px 8px",
                          backgroundColor: currentTheme.borderColor,
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "10px",
                          color: currentTheme.textColor,
                          transition: "all 0.2s",
                          ":hover": {
                            backgroundColor: "#3b82f6",
                          },
                        }}
                        title={`Add ${getShapeLabel(shape)}`}
                      >
                        <span style={{ fontSize: "20px" }}>
                          {getShapeEmoji(shape)}
                        </span>
                        {getShapeLabel(shape)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Multi-selection overlay */}
      {selectedIds.length > 1 && !showAdvancedTools && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: currentTheme.panelBg,
            padding: "8px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            display: "flex",
            gap: "8px",
            fontSize: "12px",
            alignItems: "center",
            border: `1px solid ${currentTheme.borderColor}`,
            pointerEvents: "auto",
            color: currentTheme.textColor,
          }}
        >
          <span>{selectedIds.length} items selected</span>
          <button
            onClick={groupSelectedItems}
            style={smallButtonStyle}
            title="Group (Ctrl+G)"
          >
            <Layers3 size={12} />
          </button>
          <button
            onClick={bringToFront}
            style={smallButtonStyle}
            title="Bring to Front"
          >
            <Plus size={12} />
          </button>
          <button
            onClick={sendToBack}
            style={smallButtonStyle}
            title="Send to Back"
          >
            <Minus size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

// Styles
const buttonStyle: React.CSSProperties = {
  padding: "8px",
  backgroundColor: "transparent",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
  color: "inherit",
};

const smallButtonStyle: React.CSSProperties = {
  padding: "6px",
  backgroundColor: "transparent",
  border: "1px solid currentColor",
  borderRadius: "4px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
  color: "inherit",
  opacity: 0.8,
};

const separatorStyle: React.CSSProperties = {
  width: "1px",
  height: "24px",
  backgroundColor: "currentColor",
  opacity: 0.2,
};

const inputStyle = (theme: any): React.CSSProperties => ({
  padding: "6px 8px",
  backgroundColor: "transparent",
  border: `1px solid ${theme.borderColor}`,
  borderRadius: "4px",
  fontSize: "12px",
  color: theme.textColor,
  width: "100%",
});

const fullButtonStyle = (theme: any): React.CSSProperties => ({
  padding: "8px 12px",
  backgroundColor: theme.borderColor,
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  color: theme.textColor,
  transition: "all 0.2s",
  width: "100%",
});

export default PremiumCanvasEnhancement;
