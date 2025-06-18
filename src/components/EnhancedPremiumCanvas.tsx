import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  Undo2,
  Redo2,
  Square,
  Circle,
  Triangle,
  Type,
  StickyNote,
  ImagePlus,
  Frame,
  MessageSquare,
  Layers,
  Settings,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Palette,
  Paintbrush,
  Move,
  MousePointer,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Plus,
  Minus,
  Grid,
  Lock,
  Unlock,
  Star,
  ArrowRight,
  Sparkles,
  Gradient,
  Brush,
  Eraser,
  FlipHorizontal,
  FlipVertical,
  RotateCw,
  Save,
  FolderOpen,
  Share,
  Zap,
  PenTool,
  Layers3,
  Shapes,
  Camera,
  Scissors,
  Wand2,
  Droplets,
  Sun,
  Moon,
  Contrast,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  ChevronDown,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Minimize2,
  RefreshCw,
  Crop,
  Filter,
  Blend,
} from "lucide-react";
import { CanvasItem, CanvasItemType, ShapeVariant } from "../../types";

// Enhanced Canvas Types extending existing ones
interface PremiumCanvasItem extends CanvasItem {
  // Advanced Transform
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  skewX?: number;
  skewY?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  locked?: boolean;
  visible?: boolean;
  opacity?: number;

  // Enhanced Styling
  shadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
    enabled: boolean;
  };
  gradient?: {
    type: "linear" | "radial";
    colors: Array<{ color: string; stop: number }>;
    angle?: number;
    enabled: boolean;
  };
  advancedBorder?: {
    color: string;
    width: number;
    style: "solid" | "dashed" | "dotted";
    radius?: number;
  };

  // Animation & Effects
  animation?: {
    type: "none" | "fadeIn" | "slideIn" | "bounce" | "pulse" | "spin";
    duration: number;
    delay: number;
    loop: boolean;
  };
  filter?: {
    blur: number;
    brightness: number;
    contrast: number;
    saturate: number;
    hueRotate: number;
  };

  // Grouping & Layers
  groupId?: string;
  layer?: string;
  blendMode?:
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten";

  // Text Advanced Properties
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: "left" | "center" | "right" | "justify";
  textStroke?: {
    color: string;
    width: number;
  };
  textShadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  };

  // Interactive
  link?: string;
  tooltip?: string;

  // Custom Data
  customData?: Record<string, any>;
}

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

interface EnhancedCanvasProps {
  // Inherit from existing canvas props
  canvasItems: CanvasItem[];
  setCanvasItems: React.Dispatch<React.SetStateAction<CanvasItem[]>>;
  selectedCanvasItemId: string | null;
  setSelectedCanvasItemId: React.Dispatch<React.SetStateAction<string | null>>;
  canvasOffset: { x: number; y: number };
  setCanvasOffset: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  onAddCanvasItem: (type: CanvasItemType, props?: Partial<CanvasItem>) => void;
  onUpdateCanvasItem: (id: string, updates: Partial<CanvasItem>) => void;
  onDeleteCanvasItem: (id: string) => void;
  onClearCanvas: () => void;
  onScreenshotCanvas: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const EnhancedPremiumCanvas: React.FC<EnhancedCanvasProps> = ({
  canvasItems,
  setCanvasItems,
  selectedCanvasItemId,
  setSelectedCanvasItemId,
  canvasOffset,
  setCanvasOffset,
  zoomLevel,
  setZoomLevel,
  onAddCanvasItem,
  onUpdateCanvasItem,
  onDeleteCanvasItem,
  onClearCanvas,
  onScreenshotCanvas,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  // Enhanced State
  const [currentTool, setCurrentTool] = useState("select");
  const [showLayers, setShowLayers] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(25);
  const [gridSnap, setGridSnap] = useState(true);
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

  // Advanced Tools State
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [currentColor, setCurrentColor] = useState("#3b82f6");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Canvas Themes
  const [canvasTheme, setCanvasTheme] = useState("dark");
  const [customBackground, setCustomBackground] = useState("");

  // Animation State
  const [isAnimationMode, setIsAnimationMode] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Refs
  const canvasContainerRef = useRef<HTMLDivElement>(null);
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
        name: "Pen",
        icon: PenTool,
        cursor: "crosshair",
        category: "draw",
        shortcut: "P",
      },
      {
        id: "eraser",
        name: "Eraser",
        icon: Eraser,
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
        id: "sticky",
        name: "Sticky Note",
        icon: StickyNote,
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
        onUpdateCanvasItem(id, { ...item, groupId } as any);
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

  // Zoom Functions
  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev * 1.2, 5));
  }, [setZoomLevel]);

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev / 1.2, 0.1));
  }, [setZoomLevel]);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setCanvasOffset({ x: 0, y: 0 });
  }, [setZoomLevel, setCanvasOffset]);

  const fitToScreen = useCallback(() => {
    if (!canvasContainerRef.current || canvasItems.length === 0) return;

    const container = canvasContainerRef.current.getBoundingClientRect();
    const bounds = {
      left: Math.min(...canvasItems.map((item) => item.x)),
      right: Math.max(
        ...canvasItems.map((item) => item.x + (item.width || 200)),
      ),
      top: Math.min(...canvasItems.map((item) => item.y)),
      bottom: Math.max(
        ...canvasItems.map((item) => item.y + (item.height || 100)),
      ),
    };

    const contentWidth = bounds.right - bounds.left;
    const contentHeight = bounds.bottom - bounds.top;
    const scaleX = container.width / contentWidth;
    const scaleY = container.height / contentHeight;
    const newZoom = Math.min(scaleX, scaleY) * 0.8;

    setZoomLevel(newZoom);
    setCanvasOffset({
      x: container.width / 2 - (bounds.left + contentWidth / 2) * newZoom,
      y: container.height / 2 - (bounds.top + contentHeight / 2) * newZoom,
    });
  }, [canvasItems, setZoomLevel, setCanvasOffset]);

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

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              onRedo();
            } else {
              onUndo();
            }
            break;
          case "y":
            e.preventDefault();
            onRedo();
            break;
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
          case "=":
          case "+":
            e.preventDefault();
            zoomIn();
            break;
          case "-":
            e.preventDefault();
            zoomOut();
            break;
          case "0":
            e.preventDefault();
            resetZoom();
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
            break;
          // Tool shortcuts
          case "v":
            setCurrentTool("select");
            break;
          case "m":
            setCurrentTool("move");
            break;
          case "b":
            setCurrentTool("brush");
            break;
          case "t":
            setCurrentTool("text");
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
    onUndo,
    onRedo,
    duplicateSelectedItems,
    groupSelectedItems,
    zoomIn,
    zoomOut,
    resetZoom,
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

  // Enhanced Item Selection
  const handleItemClick = useCallback(
    (itemId: string, ctrlKey: boolean) => {
      if (ctrlKey) {
        setSelectedIds((prev) =>
          prev.includes(itemId)
            ? prev.filter((id) => id !== itemId)
            : [...prev, itemId],
        );
      } else {
        setSelectedIds([itemId]);
        setSelectedCanvasItemId(itemId);
      }
    },
    [setSelectedCanvasItemId],
  );

  return (
    <div
      className="enhanced-premium-canvas"
      style={{
        width: "100%",
        height: "100%",
        background: currentTheme.background,
        color: currentTheme.textColor,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Enhanced Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          backgroundColor: currentTheme.panelBg,
          borderBottom: `1px solid ${currentTheme.borderColor}`,
          flexWrap: "wrap",
          minHeight: "64px",
        }}
      >
        {/* File Operations */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            style={buttonStyle}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            style={buttonStyle}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <div style={separatorStyle} />

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

        {/* Zoom Controls */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <button
            onClick={zoomOut}
            style={buttonStyle}
            title="Zoom Out (Ctrl+-)"
          >
            <ZoomOut size={16} />
          </button>
          <span
            style={{
              fontSize: "12px",
              minWidth: "60px",
              textAlign: "center",
              padding: "4px 8px",
              backgroundColor: currentTheme.borderColor,
              borderRadius: "4px",
            }}
          >
            {Math.round(zoomLevel * 100)}%
          </span>
          <button onClick={zoomIn} style={buttonStyle} title="Zoom In (Ctrl++)">
            <ZoomIn size={16} />
          </button>
          <button
            onClick={resetZoom}
            style={buttonStyle}
            title="Reset Zoom (Ctrl+0)"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={fitToScreen}
            style={buttonStyle}
            title="Fit to Screen"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        <div style={separatorStyle} />

        {/* View Options */}
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => setShowGrid(!showGrid)}
            style={{
              ...buttonStyle,
              backgroundColor: showGrid ? "#3b82f6" : "transparent",
              color: showGrid ? "#ffffff" : "inherit",
            }}
            title="Toggle Grid"
          >
            <Grid size={16} />
          </button>
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

        <div style={{ flex: 1 }} />

        {/* Advanced Features Toggle */}
        <button
          onClick={() => setShowAdvancedTools(!showAdvancedTools)}
          style={{
            ...buttonStyle,
            backgroundColor: showAdvancedTools ? "#8b5cf6" : "transparent",
            color: showAdvancedTools ? "#ffffff" : "inherit",
            padding: "8px 12px",
          }}
          title="Toggle Advanced Tools"
        >
          <Sparkles size={16} />
          <span style={{ marginLeft: "6px", fontSize: "12px" }}>Advanced</span>
        </button>

        {/* Theme Selector */}
        <select
          value={canvasTheme}
          onChange={(e) => setCanvasTheme(e.target.value)}
          style={{
            padding: "6px 12px",
            backgroundColor: currentTheme.panelBg,
            color: currentTheme.textColor,
            border: `1px solid ${currentTheme.borderColor}`,
            borderRadius: "6px",
            fontSize: "12px",
          }}
        >
          <option value="dark">Dark Pro</option>
          <option value="light">Light Studio</option>
          <option value="neon">Neon Night</option>
        </select>
      </div>

      {/* Advanced Tools Panel */}
      {showAdvancedTools && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            backgroundColor: `${currentTheme.panelBg}dd`,
            borderBottom: `1px solid ${currentTheme.borderColor}`,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Animation Controls */}
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <button
              onClick={() => setIsAnimationMode(!isAnimationMode)}
              style={{
                ...buttonStyle,
                backgroundColor: isAnimationMode ? "#10b981" : "transparent",
              }}
              title="Animation Mode"
            >
              <Play size={16} />
            </button>

            {isAnimationMode && (
              <>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={buttonStyle}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={animationFrame}
                  onChange={(e) => setAnimationFrame(parseInt(e.target.value))}
                  style={{ width: "100px" }}
                />
              </>
            )}
          </div>

          <div style={separatorStyle} />

          {/* Brush Controls */}
          {currentTool === "brush" && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "12px" }}>Size:</span>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                style={{ width: "80px" }}
              />
              <span style={{ fontSize: "12px", minWidth: "24px" }}>
                {brushSize}px
              </span>

              <span style={{ fontSize: "12px" }}>Opacity:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={brushOpacity}
                onChange={(e) => setBrushOpacity(parseFloat(e.target.value))}
                style={{ width: "80px" }}
              />
              <span style={{ fontSize: "12px", minWidth: "30px" }}>
                {Math.round(brushOpacity * 100)}%
              </span>
            </div>
          )}

          {/* Effects */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button style={buttonStyle} title="Add Shadow">
              <Droplets size={16} />
            </button>
            <button style={buttonStyle} title="Add Gradient">
              <Gradient size={16} />
            </button>
            <button style={buttonStyle} title="Apply Filter">
              <Filter size={16} />
            </button>
            <button style={buttonStyle} title="Blend Mode">
              <Blend size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Sidebar - Layers & Tools */}
        {showLayers && (
          <div
            style={{
              width: "280px",
              backgroundColor: currentTheme.panelBg,
              borderRight: `1px solid ${currentTheme.borderColor}`,
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            {/* Layers Panel */}
            <div style={{ padding: "16px" }}>
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Layers
              </h3>
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
                        {layer.visible ? (
                          <Eye size={14} />
                        ) : (
                          <EyeOff size={14} />
                        )}
                      </button>
                      <span style={{ flex: 1 }}>{layer.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLayers((prev) =>
                            prev.map((l) =>
                              l.id === layer.id
                                ? { ...l, locked: !l.locked }
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
                        {layer.locked ? (
                          <Lock size={14} />
                        ) : (
                          <Unlock size={14} />
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Add Panel */}
            <div
              style={{
                padding: "16px",
                borderTop: `1px solid ${currentTheme.borderColor}`,
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Quick Add
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {[
                  { type: "textElement", label: "Text", icon: Type },
                  { type: "stickyNote", label: "Note", icon: StickyNote },
                  {
                    type: "shapeElement",
                    label: "Shape",
                    icon: Square,
                    props: { shapeVariant: "rectangle" as ShapeVariant },
                  },
                  { type: "imageElement", label: "Image", icon: ImagePlus },
                  { type: "frameElement", label: "Frame", icon: Frame },
                  {
                    type: "commentElement",
                    label: "Comment",
                    icon: MessageSquare,
                  },
                ].map(({ type, label, icon: Icon, props }) => (
                  <button
                    key={type}
                    onClick={() =>
                      onAddCanvasItem(type as CanvasItemType, props)
                    }
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
                      fontSize: "11px",
                      color: currentTheme.textColor,
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Canvas Area - Use existing canvas with enhanced overlay */}
        <div style={{ flex: 1, position: "relative" }}>
          {/* This would contain your existing canvas implementation */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }}
          >
            {/* Your existing canvas content goes here */}
          </div>

          {/* Enhanced Overlays */}
          {selectedIds.length > 1 && (
            <div
              style={{
                position: "absolute",
                top: "16px",
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
                zIndex: 1000,
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

        {/* Right Sidebar - Properties */}
        {showProperties && (
          <div
            style={{
              width: "300px",
              backgroundColor: currentTheme.panelBg,
              borderLeft: `1px solid ${currentTheme.borderColor}`,
              padding: "16px",
              overflow: "auto",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Properties
            </h3>

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
                    {/* Transform Properties */}
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

                    {/* Appearance Properties */}
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

                    {/* Advanced Effects */}
                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        Effects
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
                            Opacity
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={
                              (selectedItem as PremiumCanvasItem).opacity || 1
                            }
                            onChange={(e) =>
                              onUpdateCanvasItem(selectedItem.id, {
                                opacity: parseFloat(e.target.value),
                              } as any)
                            }
                            style={{ width: "100%" }}
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
                            Rotation
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={
                              (selectedItem as PremiumCanvasItem).rotation || 0
                            }
                            onChange={(e) =>
                              onUpdateCanvasItem(selectedItem.id, {
                                rotation: parseFloat(e.target.value),
                              } as any)
                            }
                            style={{ width: "100%" }}
                          />
                          <span
                            style={{
                              fontSize: "10px",
                              color: `${currentTheme.textColor}80`,
                            }}
                          >
                            {(selectedItem as PremiumCanvasItem).rotation || 0}°
                          </span>
                        </div>
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
                    style={buttonStyle}
                  >
                    Align Left
                  </button>
                  <button
                    onClick={() => alignItems("center")}
                    style={buttonStyle}
                  >
                    Align Center
                  </button>
                  <button
                    onClick={() => alignItems("right")}
                    style={buttonStyle}
                  >
                    Align Right
                  </button>
                  <button onClick={groupSelectedItems} style={buttonStyle}>
                    Group Items
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          backgroundColor: currentTheme.borderColor,
          fontSize: "11px",
          color: `${currentTheme.textColor}80`,
          borderTop: `1px solid ${currentTheme.borderColor}`,
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          <span>Items: {canvasItems.length}</span>
          <span>Selected: {selectedIds.length}</span>
          <span>Layer: {layers.find((l) => l.id === currentLayer)?.name}</span>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <span>
            Tool: {premiumTools.find((t) => t.id === currentTool)?.name}
          </span>
          <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
          <span>Grid: {showGrid ? "On" : "Off"}</span>
          <span>Theme: {canvasTheme}</span>
        </div>
      </div>
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

export default EnhancedPremiumCanvas;
