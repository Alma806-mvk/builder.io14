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
} from "lucide-react";

// Enhanced Canvas Types
interface PremiumCanvasItem extends CanvasItem {
  // Layout & Transform
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

  // Advanced Styling
  shadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  };
  gradient?: {
    type: "linear" | "radial";
    colors: Array<{ color: string; stop: number }>;
    angle?: number;
  };
  border?: {
    color: string;
    width: number;
    style: "solid" | "dashed" | "dotted";
    radius?: number;
  };

  // Animation
  animation?: {
    type: "none" | "fadeIn" | "slideIn" | "bounce" | "pulse" | "spin";
    duration: number;
    delay: number;
    loop: boolean;
  };

  // Grouping
  groupId?: string;

  // Layer System
  layer?: string;
  blendMode?:
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten";

  // Text Advanced
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: "left" | "center" | "right" | "justify";
  textStroke?: {
    color: string;
    width: number;
  };

  // Shape Advanced
  pathData?: string; // For custom SVG paths
  strokeDashArray?: string;
  strokeDashOffset?: number;

  // Interactive
  link?: string;
  tooltip?: string;

  // Custom Properties
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

interface PremiumCanvasTheme {
  id: string;
  name: string;
  background: string;
  grid: {
    size: number;
    color: string;
    style: "dots" | "lines" | "crosses";
  };
  colors: string[];
  fonts: string[];
}

interface PremiumCanvasTool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  cursor: string;
  category: "select" | "draw" | "shape" | "text" | "media";
}

// Premium Canvas Component
const PremiumCanvas: React.FC = () => {
  // Core Canvas State
  const [canvasItems, setCanvasItems] = useState<PremiumCanvasItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [gridSnap, setGridSnap] = useState(true);
  const [gridSize, setGridSize] = useState(20);

  // Advanced Features State
  const [currentTool, setCurrentTool] = useState<string>("select");
  const [layers, setLayers] = useState<PremiumCanvasLayer[]>([
    {
      id: "layer1",
      name: "Background",
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: "normal",
      order: 0,
    },
    {
      id: "layer2",
      name: "Main",
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: "normal",
      order: 1,
    },
    {
      id: "layer3",
      name: "Overlay",
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: "normal",
      order: 2,
    },
  ]);
  const [currentLayer, setCurrentLayer] = useState("layer2");
  const [themes] = useState<PremiumCanvasTheme[]>([
    {
      id: "dark",
      name: "Dark Pro",
      background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)",
      grid: { size: 20, color: "#ffffff10", style: "dots" },
      colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
      fonts: ["Inter", "Roboto", "Playfair Display"],
    },
    {
      id: "light",
      name: "Light Studio",
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      grid: { size: 20, color: "#00000015", style: "lines" },
      colors: ["#3b82f6", "#8b5cf6", "#ef4444", "#f59e0b", "#10b981"],
      fonts: ["Inter", "Roboto", "Playfair Display"],
    },
    {
      id: "neon",
      name: "Neon Night",
      background: "linear-gradient(135deg, #000000 0%, #1a0033 100%)",
      grid: { size: 25, color: "#ff00ff20", style: "crosses" },
      colors: ["#ff00ff", "#00ffff", "#ffff00", "#ff0080", "#80ff00"],
      fonts: ["Orbitron", "Exo 2", "Rajdhani"],
    },
  ]);
  const [currentTheme, setCurrentTheme] = useState("dark");

  // UI State
  const [showLayers, setShowLayers] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [showGuides, setShowGuides] = useState(true);

  // Advanced Drawing State
  const [brushSize, setBrushSize] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [currentColor, setCurrentColor] = useState("#6366f1");
  const [currentFont, setCurrentFont] = useState("Inter");
  const [fontSize, setFontSize] = useState(16);

  // Animation State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [frameDuration, setFrameDuration] = useState(100);

  // Refs
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Premium Tools Configuration
  const tools: PremiumCanvasTool[] = useMemo(
    () => [
      {
        id: "select",
        name: "Select",
        icon: MousePointer,
        cursor: "default",
        category: "select",
      },
      {
        id: "move",
        name: "Move",
        icon: Move,
        cursor: "move",
        category: "select",
      },
      {
        id: "brush",
        name: "Brush",
        icon: Paintbrush,
        cursor: "crosshair",
        category: "draw",
      },
      {
        id: "pen",
        name: "Pen",
        icon: PenTool,
        cursor: "crosshair",
        category: "draw",
      },
      {
        id: "eraser",
        name: "Eraser",
        icon: Eraser,
        cursor: "crosshair",
        category: "draw",
      },
      {
        id: "text",
        name: "Text",
        icon: Type,
        cursor: "text",
        category: "text",
      },
      {
        id: "rectangle",
        name: "Rectangle",
        icon: Square,
        cursor: "crosshair",
        category: "shape",
      },
      {
        id: "circle",
        name: "Circle",
        icon: Circle,
        cursor: "crosshair",
        category: "shape",
      },
      {
        id: "triangle",
        name: "Triangle",
        icon: Triangle,
        cursor: "crosshair",
        category: "shape",
      },
      {
        id: "star",
        name: "Star",
        icon: Star,
        cursor: "crosshair",
        category: "shape",
      },
      {
        id: "arrow",
        name: "Arrow",
        icon: ArrowRight,
        cursor: "crosshair",
        category: "shape",
      },
      {
        id: "sticky",
        name: "Sticky Note",
        icon: StickyNote,
        cursor: "crosshair",
        category: "media",
      },
      {
        id: "image",
        name: "Image",
        icon: ImagePlus,
        cursor: "crosshair",
        category: "media",
      },
      {
        id: "frame",
        name: "Frame",
        icon: Frame,
        cursor: "crosshair",
        category: "media",
      },
      {
        id: "comment",
        name: "Comment",
        icon: MessageSquare,
        cursor: "crosshair",
        category: "media",
      },
    ],
    [],
  );

  // Current theme object
  const theme = themes.find((t) => t.id === currentTheme) || themes[0];

  // Enhanced Functions
  const addCanvasItem = useCallback(
    (type: string, position?: { x: number; y: number }) => {
      const id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const basePosition = position || {
        x: (100 - canvasOffset.x) / zoomLevel,
        y: (100 - canvasOffset.y) / zoomLevel,
      };

      let newItem: PremiumCanvasItem = {
        id,
        type: type as CanvasItemType,
        x: basePosition.x,
        y: basePosition.y,
        width: 200,
        height: 100,
        zIndex: canvasItems.length + 1,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        visible: true,
        locked: false,
        layer: currentLayer,
        blendMode: "normal",
      };

      // Configure based on type
      switch (type) {
        case "text":
          newItem = {
            ...newItem,
            content: "Text Element",
            fontFamily: currentFont,
            fontSize: `${fontSize}px`,
            textColor: currentColor,
            textAlign: "left",
            lineHeight: 1.4,
            letterSpacing: 0,
          };
          break;

        case "sticky":
          newItem = {
            ...newItem,
            content: "Sticky Note",
            backgroundColor: "#fbbf24",
            fontFamily: "Inter",
            fontSize: "14px",
            textColor: "#1f2937",
            border: { color: "#f59e0b", width: 1, style: "solid", radius: 8 },
          };
          break;

        case "rectangle":
          newItem = {
            ...newItem,
            shapeVariant: "rectangle",
            backgroundColor: currentColor,
            border: { color: "#374151", width: 2, style: "solid", radius: 4 },
          };
          break;

        case "circle":
          newItem = {
            ...newItem,
            shapeVariant: "circle",
            backgroundColor: currentColor,
            border: { color: "#374151", width: 2, style: "solid", radius: 50 },
            width: 150,
            height: 150,
          };
          break;

        case "triangle":
          newItem = {
            ...newItem,
            shapeVariant: "triangle",
            backgroundColor: currentColor,
            border: { color: "#374151", width: 2, style: "solid" },
            width: 150,
            height: 130,
          };
          break;

        case "star":
          newItem = {
            ...newItem,
            shapeVariant: "star",
            backgroundColor: currentColor,
            border: { color: "#374151", width: 2, style: "solid" },
            width: 150,
            height: 150,
          };
          break;

        case "arrow":
          newItem = {
            ...newItem,
            shapeVariant: "rightArrow",
            backgroundColor: currentColor,
            border: { color: "#374151", width: 2, style: "solid" },
            width: 200,
            height: 80,
          };
          break;

        case "frame":
          newItem = {
            ...newItem,
            backgroundColor: "transparent",
            border: { color: "#6b7280", width: 2, style: "dashed", radius: 4 },
            width: 300,
            height: 200,
          };
          break;

        case "comment":
          newItem = {
            ...newItem,
            content: "Add your comment here...",
            backgroundColor: "#fef3c7",
            textColor: "#92400e",
            fontFamily: "Inter",
            fontSize: "12px",
            border: { color: "#f59e0b", width: 1, style: "solid", radius: 6 },
            width: 180,
            height: 80,
          };
          break;
      }

      setCanvasItems((prev) => [...prev, newItem]);
      setSelectedItemIds([id]);
    },
    [
      canvasItems.length,
      canvasOffset,
      zoomLevel,
      currentLayer,
      currentColor,
      currentFont,
      fontSize,
    ],
  );

  const updateItemProperty = useCallback(
    <K extends keyof PremiumCanvasItem>(
      itemId: string,
      property: K,
      value: PremiumCanvasItem[K],
    ) => {
      setCanvasItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, [property]: value } : item,
        ),
      );
    },
    [],
  );

  const duplicateItems = useCallback(() => {
    const itemsToDuplicate = canvasItems.filter((item) =>
      selectedItemIds.includes(item.id),
    );
    const newItems = itemsToDuplicate.map((item) => ({
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      x: item.x + 20,
      y: item.y + 20,
      zIndex: canvasItems.length + 1,
    }));

    setCanvasItems((prev) => [...prev, ...newItems]);
    setSelectedItemIds(newItems.map((item) => item.id));
  }, [canvasItems, selectedItemIds]);

  const deleteSelectedItems = useCallback(() => {
    setCanvasItems((prev) =>
      prev.filter((item) => !selectedItemIds.includes(item.id)),
    );
    setSelectedItemIds([]);
  }, [selectedItemIds]);

  const groupSelectedItems = useCallback(() => {
    if (selectedItemIds.length < 2) return;

    const groupId = `group_${Date.now()}`;
    setCanvasItems((prev) =>
      prev.map((item) =>
        selectedItemIds.includes(item.id) ? { ...item, groupId } : item,
      ),
    );
  }, [selectedItemIds]);

  const ungroupSelectedItems = useCallback(() => {
    setCanvasItems((prev) =>
      prev.map((item) =>
        selectedItemIds.includes(item.id)
          ? { ...item, groupId: undefined }
          : item,
      ),
    );
  }, [selectedItemIds]);

  const bringToFront = useCallback(() => {
    if (selectedItemIds.length === 0) return;

    const maxZIndex = Math.max(...canvasItems.map((item) => item.zIndex));
    setCanvasItems((prev) =>
      prev.map((item) =>
        selectedItemIds.includes(item.id)
          ? { ...item, zIndex: maxZIndex + 1 }
          : item,
      ),
    );
  }, [canvasItems, selectedItemIds]);

  const sendToBack = useCallback(() => {
    if (selectedItemIds.length === 0) return;

    const minZIndex = Math.min(...canvasItems.map((item) => item.zIndex));
    setCanvasItems((prev) =>
      prev.map((item) =>
        selectedItemIds.includes(item.id)
          ? { ...item, zIndex: minZIndex - 1 }
          : item,
      ),
    );
  }, [canvasItems, selectedItemIds]);

  const alignItems = useCallback(
    (alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
      if (selectedItemIds.length < 2) return;

      const selectedItems = canvasItems.filter((item) =>
        selectedItemIds.includes(item.id),
      );
      const bounds = {
        left: Math.min(...selectedItems.map((item) => item.x)),
        right: Math.max(
          ...selectedItems.map((item) => item.x + (item.width || 0)),
        ),
        top: Math.min(...selectedItems.map((item) => item.y)),
        bottom: Math.max(
          ...selectedItems.map((item) => item.y + (item.height || 0)),
        ),
      };

      setCanvasItems((prev) =>
        prev.map((item) => {
          if (!selectedItemIds.includes(item.id)) return item;

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
                (item.width || 0) / 2;
              break;
            case "right":
              newX = bounds.right - (item.width || 0);
              break;
            case "top":
              newY = bounds.top;
              break;
            case "middle":
              newY =
                bounds.top +
                (bounds.bottom - bounds.top) / 2 -
                (item.height || 0) / 2;
              break;
            case "bottom":
              newY = bounds.bottom - (item.height || 0);
              break;
          }

          return { ...item, x: newX, y: newY };
        }),
      );
    },
    [canvasItems, selectedItemIds],
  );

  const distributeItems = useCallback(
    (direction: "horizontal" | "vertical") => {
      if (selectedItemIds.length < 3) return;

      const selectedItems = canvasItems.filter((item) =>
        selectedItemIds.includes(item.id),
      );
      selectedItems.sort((a, b) =>
        direction === "horizontal" ? a.x - b.x : a.y - b.y,
      );

      const first = selectedItems[0];
      const last = selectedItems[selectedItems.length - 1];
      const totalDistance =
        direction === "horizontal"
          ? last.x + (last.width || 0) - first.x
          : last.y + (last.height || 0) - first.y;

      const spacing = totalDistance / (selectedItems.length - 1);

      setCanvasItems((prev) =>
        prev.map((item) => {
          const index = selectedItems.findIndex(
            (selected) => selected.id === item.id,
          );
          if (index === -1 || index === 0 || index === selectedItems.length - 1)
            return item;

          if (direction === "horizontal") {
            return { ...item, x: first.x + spacing * index };
          } else {
            return { ...item, y: first.y + spacing * index };
          }
        }),
      );
    },
    [canvasItems, selectedItemIds],
  );

  // Zoom and Pan Functions
  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev * 1.2, 5));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev / 1.2, 0.1));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setCanvasOffset({ x: 0, y: 0 });
  }, []);

  const fitToScreen = useCallback(() => {
    if (!canvasContainerRef.current || canvasItems.length === 0) return;

    const container = canvasContainerRef.current.getBoundingClientRect();
    const bounds = {
      left: Math.min(...canvasItems.map((item) => item.x)),
      right: Math.max(...canvasItems.map((item) => item.x + (item.width || 0))),
      top: Math.min(...canvasItems.map((item) => item.y)),
      bottom: Math.max(
        ...canvasItems.map((item) => item.y + (item.height || 0)),
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
  }, [canvasItems]);

  // Export Functions
  const exportCanvas = useCallback(
    async (format: "png" | "jpg" | "svg" | "pdf") => {
      // Implementation for exporting canvas in different formats
      console.log(`Exporting canvas as ${format}`);
    },
    [],
  );

  const saveProject = useCallback(() => {
    const projectData = {
      items: canvasItems,
      layers,
      theme: currentTheme,
      settings: {
        gridSize,
        gridSnap,
        showGrid,
        showRulers,
        showGuides,
      },
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `canvas-project-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [
    canvasItems,
    layers,
    currentTheme,
    gridSize,
    gridSnap,
    showGrid,
    showRulers,
    showGuides,
  ]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault();
            // Undo functionality
            break;
          case "y":
            e.preventDefault();
            // Redo functionality
            break;
          case "d":
            e.preventDefault();
            duplicateItems();
            break;
          case "g":
            e.preventDefault();
            groupSelectedItems();
            break;
          case "s":
            e.preventDefault();
            saveProject();
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
            deleteSelectedItems();
            break;
          case "Escape":
            setSelectedItemIds([]);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    duplicateItems,
    groupSelectedItems,
    saveProject,
    zoomIn,
    zoomOut,
    resetZoom,
    deleteSelectedItems,
  ]);

  // Render Canvas Item
  const renderCanvasItem = (item: PremiumCanvasItem) => {
    if (!item.visible) return null;

    const isSelected = selectedItemIds.includes(item.id);
    const transform = `
      translate(${item.x}px, ${item.y}px)
      scale(${item.scaleX || 1}, ${item.scaleY || 1})
      rotate(${item.rotation || 0}deg)
      skew(${item.skewX || 0}deg, ${item.skewY || 0}deg)
      ${item.flipHorizontal ? "scaleX(-1)" : ""}
      ${item.flipVertical ? "scaleY(-1)" : ""}
    `;

    const itemStyle: React.CSSProperties = {
      position: "absolute",
      left: 0,
      top: 0,
      width: item.width || 200,
      height: item.height || 100,
      transform,
      transformOrigin: "center",
      opacity: item.opacity || 1,
      zIndex: item.zIndex,
      pointerEvents: item.locked ? "none" : "auto",
      cursor: item.locked ? "not-allowed" : "move",
      mixBlendMode: item.blendMode as any,
      filter: item.shadow
        ? `drop-shadow(${item.shadow.offsetX}px ${item.shadow.offsetY}px ${item.shadow.blur}px ${item.shadow.color})`
        : undefined,
    };

    let content: React.ReactNode = null;

    switch (item.type) {
      case "textElement":
        content = (
          <div
            style={{
              width: "100%",
              height: "100%",
              fontFamily: item.fontFamily,
              fontSize: item.fontSize,
              fontWeight: item.fontWeight,
              fontStyle: item.fontStyle,
              color: item.textColor,
              textAlign: item.textAlign,
              lineHeight: item.lineHeight,
              letterSpacing: item.letterSpacing
                ? `${item.letterSpacing}px`
                : undefined,
              textDecoration: item.textDecoration,
              backgroundColor: item.backgroundColor || "transparent",
              border: item.border
                ? `${item.border.width}px ${item.border.style} ${item.border.color}`
                : undefined,
              borderRadius: item.border?.radius
                ? `${item.border.radius}px`
                : undefined,
              padding: "8px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              WebkitTextStroke: item.textStroke
                ? `${item.textStroke.width}px ${item.textStroke.color}`
                : undefined,
            }}
          >
            {item.content || "Text Element"}
          </div>
        );
        break;

      case "stickyNote":
        content = (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: item.backgroundColor || "#fbbf24",
              border: item.border
                ? `${item.border.width}px ${item.border.style} ${item.border.color}`
                : "1px solid #f59e0b",
              borderRadius: item.border?.radius || 8,
              padding: "12px",
              fontFamily: item.fontFamily || "Inter",
              fontSize: item.fontSize || "14px",
              color: item.textColor || "#1f2937",
              overflow: "hidden",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "4px",
                right: "8px",
                opacity: 0.3,
              }}
            >
              📌
            </div>
            {item.content || "Sticky Note"}
          </div>
        );
        break;

      case "shapeElement":
        const shapeStyle: React.CSSProperties = {
          width: "100%",
          height: "100%",
          backgroundColor: item.backgroundColor || currentColor,
          border: item.border
            ? `${item.border.width}px ${item.border.style} ${item.border.color}`
            : "2px solid #374151",
          borderRadius:
            item.border?.radius || (item.shapeVariant === "circle" ? "50%" : 4),
        };

        if (item.shapeVariant === "triangle") {
          content = (
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${(item.width || 150) / 2}px solid transparent`,
                borderRight: `${(item.width || 150) / 2}px solid transparent`,
                borderBottom: `${item.height || 130}px solid ${item.backgroundColor || currentColor}`,
                filter: item.border
                  ? `drop-shadow(0 0 0 ${item.border.width}px ${item.border.color})`
                  : undefined,
              }}
            />
          );
        } else if (item.shapeVariant === "star") {
          content = (
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              style={{
                fill: item.backgroundColor || currentColor,
                stroke: item.border?.color,
                strokeWidth: item.border?.width,
              }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          );
        } else if (item.shapeVariant === "rightArrow") {
          content = (
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 12"
              style={{
                fill: item.backgroundColor || currentColor,
                stroke: item.border?.color,
                strokeWidth: item.border?.width,
              }}
            >
              <path d="M0 2h16v-2l8 6-8 6v-2H0z" />
            </svg>
          );
        } else {
          content = <div style={shapeStyle} />;
        }
        break;

      case "frameElement":
        content = (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: item.backgroundColor || "transparent",
              border: item.border
                ? `${item.border.width}px ${item.border.style} ${item.border.color}`
                : "2px dashed #6b7280",
              borderRadius: item.border?.radius || 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              fontSize: "14px",
              fontFamily: "Inter",
            }}
          >
            Frame Element
          </div>
        );
        break;

      case "commentElement":
        content = (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: item.backgroundColor || "#fef3c7",
              border: item.border
                ? `${item.border.width}px ${item.border.style} ${item.border.color}`
                : "1px solid #f59e0b",
              borderRadius: item.border?.radius || 6,
              padding: "8px",
              fontSize: item.fontSize || "12px",
              color: item.textColor || "#92400e",
              fontFamily: item.fontFamily || "Inter",
              position: "relative",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-8px",
                left: "12px",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "8px solid #fef3c7",
              }}
            />
            {item.content || "Comment"}
          </div>
        );
        break;

      case "imageElement":
        if (item.base64Data) {
          content = (
            <img
              src={`data:${item.mimeType};base64,${item.base64Data}`}
              alt={item.content || "Canvas Image"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                border: item.border
                  ? `${item.border.width}px ${item.border.style} ${item.border.color}`
                  : undefined,
                borderRadius: item.border?.radius
                  ? `${item.border.radius}px`
                  : undefined,
              }}
            />
          );
        } else {
          content = (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#f3f4f6",
                border: "2px dashed #d1d5db",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                fontSize: "14px",
                fontFamily: "Inter",
              }}
            >
              <ImagePlus size={24} />
            </div>
          );
        }
        break;
    }

    return (
      <div
        key={item.id}
        style={itemStyle}
        className={`canvas-item ${isSelected ? "selected" : ""} ${item.locked ? "locked" : ""}`}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (!item.locked) {
            if (e.ctrlKey || e.metaKey) {
              setSelectedItemIds((prev) =>
                prev.includes(item.id)
                  ? prev.filter((id) => id !== item.id)
                  : [...prev, item.id],
              );
            } else {
              setSelectedItemIds([item.id]);
            }
          }
        }}
      >
        {content}

        {isSelected && !item.locked && (
          <>
            {/* Selection Border */}
            <div
              style={{
                position: "absolute",
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                border: "2px solid #3b82f6",
                borderRadius: "4px",
                pointerEvents: "none",
                zIndex: 1000,
              }}
            />

            {/* Resize Handles */}
            {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((position) => (
              <div
                key={position}
                style={{
                  position: "absolute",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#3b82f6",
                  border: "1px solid white",
                  borderRadius: "2px",
                  cursor: `${position}-resize`,
                  zIndex: 1001,
                  ...getHandlePosition(position),
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  // Handle resize start
                }}
              />
            ))}

            {/* Rotation Handle */}
            <div
              style={{
                position: "absolute",
                top: -20,
                left: "50%",
                transform: "translateX(-50%)",
                width: "12px",
                height: "12px",
                backgroundColor: "#10b981",
                border: "1px solid white",
                borderRadius: "50%",
                cursor: "grab",
                zIndex: 1001,
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                // Handle rotation start
              }}
            />
          </>
        )}
      </div>
    );
  };

  // Helper function for resize handle positioning
  const getHandlePosition = (position: string): React.CSSProperties => {
    switch (position) {
      case "nw":
        return { top: -4, left: -4 };
      case "n":
        return { top: -4, left: "50%", transform: "translateX(-50%)" };
      case "ne":
        return { top: -4, right: -4 };
      case "e":
        return { top: "50%", right: -4, transform: "translateY(-50%)" };
      case "se":
        return { bottom: -4, right: -4 };
      case "s":
        return { bottom: -4, left: "50%", transform: "translateX(-50%)" };
      case "sw":
        return { bottom: -4, left: -4 };
      case "w":
        return { top: "50%", left: -4, transform: "translateY(-50%)" };
      default:
        return {};
    }
  };

  return (
    <div
      className="premium-canvas-container"
      style={{
        width: "100%",
        height: "100vh",
        background: theme.background,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        color: currentTheme === "dark" ? "#ffffff" : "#000000",
        overflow: "hidden",
      }}
    >
      {/* Top Toolbar */}
      {showToolbar && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            backgroundColor: currentTheme === "dark" ? "#1f2937" : "#f8fafc",
            borderBottom: `1px solid ${currentTheme === "dark" ? "#374151" : "#e2e8f0"}`,
            flexWrap: "wrap",
          }}
        >
          {/* File Operations */}
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            <button
              onClick={saveProject}
              style={buttonStyle}
              title="Save Project (Ctrl+S)"
            >
              <Save size={16} />
            </button>
            <button onClick={() => {}} style={buttonStyle} title="Open Project">
              <FolderOpen size={16} />
            </button>
            <button
              onClick={() => exportCanvas("png")}
              style={buttonStyle}
              title="Export"
            >
              <Download size={16} />
            </button>
          </div>

          <div style={separatorStyle} />

          {/* Undo/Redo */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button style={buttonStyle} title="Undo (Ctrl+Z)">
              <Undo2 size={16} />
            </button>
            <button style={buttonStyle} title="Redo (Ctrl+Y)">
              <Redo2 size={16} />
            </button>
          </div>

          <div style={separatorStyle} />

          {/* Tools */}
          <div style={{ display: "flex", gap: "4px" }}>
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setCurrentTool(tool.id)}
                style={{
                  ...buttonStyle,
                  backgroundColor:
                    currentTool === tool.id
                      ? currentTheme === "dark"
                        ? "#3b82f6"
                        : "#dbeafe"
                      : "transparent",
                }}
                title={tool.name}
              >
                <tool.icon size={16} />
              </button>
            ))}
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
                backgroundColor:
                  currentTheme === "dark" ? "#374151" : "#e2e8f0",
                borderRadius: "4px",
              }}
            >
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={zoomIn}
              style={buttonStyle}
              title="Zoom In (Ctrl++)"
            >
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
              <Sparkles size={16} />
            </button>
          </div>

          <div style={separatorStyle} />

          {/* Object Operations */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={duplicateItems}
              disabled={selectedItemIds.length === 0}
              style={buttonStyle}
              title="Duplicate (Ctrl+D)"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={deleteSelectedItems}
              disabled={selectedItemIds.length === 0}
              style={buttonStyle}
              title="Delete (Del)"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div style={separatorStyle} />

          {/* Alignment */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => alignItems("left")}
              disabled={selectedItemIds.length < 2}
              style={buttonStyle}
              title="Align Left"
            >
              <AlignLeft size={16} />
            </button>
            <button
              onClick={() => alignItems("center")}
              disabled={selectedItemIds.length < 2}
              style={buttonStyle}
              title="Align Center"
            >
              <AlignCenter size={16} />
            </button>
            <button
              onClick={() => alignItems("right")}
              disabled={selectedItemIds.length < 2}
              style={buttonStyle}
              title="Align Right"
            >
              <AlignRight size={16} />
            </button>
          </div>

          <div style={separatorStyle} />

          {/* View Options */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => setShowGrid(!showGrid)}
              style={{
                ...buttonStyle,
                backgroundColor: showGrid
                  ? currentTheme === "dark"
                    ? "#374151"
                    : "#e2e8f0"
                  : "transparent",
              }}
              title="Toggle Grid"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setShowLayers(!showLayers)}
              style={{
                ...buttonStyle,
                backgroundColor: showLayers
                  ? currentTheme === "dark"
                    ? "#374151"
                    : "#e2e8f0"
                  : "transparent",
              }}
              title="Toggle Layers Panel"
            >
              <Layers size={16} />
            </button>
            <button
              onClick={() => setShowProperties(!showProperties)}
              style={{
                ...buttonStyle,
                backgroundColor: showProperties
                  ? currentTheme === "dark"
                    ? "#374151"
                    : "#e2e8f0"
                  : "transparent",
              }}
              title="Toggle Properties Panel"
            >
              <Settings size={16} />
            </button>
          </div>

          <div style={{ flex: 1 }} />

          {/* Theme Selector */}
          <select
            value={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value)}
            style={{
              padding: "6px 12px",
              backgroundColor: currentTheme === "dark" ? "#374151" : "#ffffff",
              color: currentTheme === "dark" ? "#ffffff" : "#000000",
              border: `1px solid ${currentTheme === "dark" ? "#4b5563" : "#d1d5db"}`,
              borderRadius: "6px",
              fontSize: "12px",
            }}
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Sidebar - Layers */}
        {showLayers && (
          <div
            style={{
              width: "260px",
              backgroundColor: currentTheme === "dark" ? "#1f2937" : "#f8fafc",
              borderRight: `1px solid ${currentTheme === "dark" ? "#374151" : "#e2e8f0"}`,
              display: "flex",
              flexDirection: "column",
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
                          currentLayer === layer.id
                            ? currentTheme === "dark"
                              ? "#3b82f6"
                              : "#dbeafe"
                            : "transparent",
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

            {/* Add Items Panel */}
            <div
              style={{
                padding: "16px",
                borderTop: `1px solid ${currentTheme === "dark" ? "#374151" : "#e2e8f0"}`,
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Add Elements
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {[
                  { type: "text", label: "Text", icon: Type },
                  { type: "sticky", label: "Note", icon: StickyNote },
                  { type: "rectangle", label: "Rectangle", icon: Square },
                  { type: "circle", label: "Circle", icon: Circle },
                  { type: "triangle", label: "Triangle", icon: Triangle },
                  { type: "star", label: "Star", icon: Star },
                  { type: "arrow", label: "Arrow", icon: ArrowRight },
                  { type: "frame", label: "Frame", icon: Frame },
                  { type: "comment", label: "Comment", icon: MessageSquare },
                  { type: "image", label: "Image", icon: ImagePlus },
                ].map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => addCanvasItem(type)}
                    style={{
                      padding: "12px 8px",
                      backgroundColor:
                        currentTheme === "dark" ? "#374151" : "#ffffff",
                      border: `1px solid ${currentTheme === "dark" ? "#4b5563" : "#d1d5db"}`,
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "11px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        currentTheme === "dark" ? "#4b5563" : "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        currentTheme === "dark" ? "#374151" : "#ffffff";
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

        {/* Canvas Area */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div
            ref={canvasContainerRef}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
              cursor:
                tools.find((t) => t.id === currentTool)?.cursor || "default",
              backgroundImage: showGrid
                ? getGridPattern(theme.grid, zoomLevel)
                : undefined,
              backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
              backgroundSize: `${theme.grid.size * zoomLevel}px ${theme.grid.size * zoomLevel}px`,
            }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedItemIds([]);
              }
            }}
          >
            {/* Canvas Transform Container */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoomLevel})`,
                transformOrigin: "0 0",
              }}
            >
              {/* Render Canvas Items */}
              {canvasItems
                .filter((item) => {
                  const layer = layers.find((l) => l.id === item.layer);
                  return layer?.visible !== false;
                })
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map(renderCanvasItem)}
            </div>

            {/* Canvas Overlay Elements */}
            {selectedItemIds.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor:
                    currentTheme === "dark" ? "#1f2937" : "#ffffff",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  gap: "8px",
                  fontSize: "12px",
                  alignItems: "center",
                  border: `1px solid ${currentTheme === "dark" ? "#374151" : "#e2e8f0"}`,
                }}
              >
                <span>{selectedItemIds.length} items selected</span>
                <button
                  onClick={groupSelectedItems}
                  style={smallButtonStyle}
                  title="Group (Ctrl+G)"
                >
                  <Layers3 size={12} />
                </button>
                <button
                  onClick={ungroupSelectedItems}
                  style={smallButtonStyle}
                  title="Ungroup"
                >
                  <Layers size={12} />
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
        </div>

        {/* Right Sidebar - Properties */}
        {showProperties && (
          <div
            style={{
              width: "280px",
              backgroundColor: currentTheme === "dark" ? "#1f2937" : "#f8fafc",
              borderLeft: `1px solid ${currentTheme === "dark" ? "#374151" : "#e2e8f0"}`,
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

            {selectedItemIds.length === 0 && (
              <div
                style={{
                  color: currentTheme === "dark" ? "#9ca3af" : "#6b7280",
                  fontSize: "12px",
                }}
              >
                Select an element to edit its properties
              </div>
            )}

            {selectedItemIds.length === 1 &&
              (() => {
                const selectedItem = canvasItems.find(
                  (item) => item.id === selectedItemIds[0],
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
                    {/* Transform */}
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
                              updateItemProperty(
                                selectedItem.id,
                                "x",
                                parseFloat(e.target.value),
                              )
                            }
                            style={inputStyle}
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
                              updateItemProperty(
                                selectedItem.id,
                                "y",
                                parseFloat(e.target.value),
                              )
                            }
                            style={inputStyle}
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
                              updateItemProperty(
                                selectedItem.id,
                                "width",
                                parseFloat(e.target.value),
                              )
                            }
                            style={inputStyle}
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
                              updateItemProperty(
                                selectedItem.id,
                                "height",
                                parseFloat(e.target.value),
                              )
                            }
                            style={inputStyle}
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
                            type="number"
                            value={selectedItem.rotation || 0}
                            onChange={(e) =>
                              updateItemProperty(
                                selectedItem.id,
                                "rotation",
                                parseFloat(e.target.value),
                              )
                            }
                            style={inputStyle}
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
                            Opacity
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={selectedItem.opacity || 1}
                            onChange={(e) =>
                              updateItemProperty(
                                selectedItem.id,
                                "opacity",
                                parseFloat(e.target.value),
                              )
                            }
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Appearance */}
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
                            value={selectedItem.backgroundColor || "#6366f1"}
                            onChange={(e) =>
                              updateItemProperty(
                                selectedItem.id,
                                "backgroundColor",
                                e.target.value,
                              )
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
                          <>
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
                                  updateItemProperty(
                                    selectedItem.id,
                                    "textColor",
                                    e.target.value,
                                  )
                                }
                                style={{
                                  width: "100%",
                                  height: "32px",
                                  borderRadius: "4px",
                                  border: "none",
                                }}
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
                                Font Family
                              </label>
                              <select
                                value={selectedItem.fontFamily || "Inter"}
                                onChange={(e) =>
                                  updateItemProperty(
                                    selectedItem.id,
                                    "fontFamily",
                                    e.target.value,
                                  )
                                }
                                style={inputStyle}
                              >
                                {theme.fonts.map((font) => (
                                  <option key={font} value={font}>
                                    {font}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label
                                style={{
                                  fontSize: "11px",
                                  marginBottom: "4px",
                                  display: "block",
                                }}
                              >
                                Font Size
                              </label>
                              <input
                                type="number"
                                value={parseInt(selectedItem.fontSize || "16")}
                                onChange={(e) =>
                                  updateItemProperty(
                                    selectedItem.id,
                                    "fontSize",
                                    `${e.target.value}px`,
                                  )
                                }
                                style={inputStyle}
                              />
                            </div>

                            <div style={{ display: "flex", gap: "4px" }}>
                              <button
                                onClick={() =>
                                  updateItemProperty(
                                    selectedItem.id,
                                    "fontWeight",
                                    selectedItem.fontWeight === "bold"
                                      ? "normal"
                                      : "bold",
                                  )
                                }
                                style={{
                                  ...smallButtonStyle,
                                  backgroundColor:
                                    selectedItem.fontWeight === "bold"
                                      ? currentTheme === "dark"
                                        ? "#3b82f6"
                                        : "#dbeafe"
                                      : "transparent",
                                }}
                              >
                                <Bold size={12} />
                              </button>
                              <button
                                onClick={() =>
                                  updateItemProperty(
                                    selectedItem.id,
                                    "fontStyle",
                                    selectedItem.fontStyle === "italic"
                                      ? "normal"
                                      : "italic",
                                  )
                                }
                                style={{
                                  ...smallButtonStyle,
                                  backgroundColor:
                                    selectedItem.fontStyle === "italic"
                                      ? currentTheme === "dark"
                                        ? "#3b82f6"
                                        : "#dbeafe"
                                      : "transparent",
                                }}
                              >
                                <Italic size={12} />
                              </button>
                              <button
                                onClick={() =>
                                  updateItemProperty(
                                    selectedItem.id,
                                    "textDecoration",
                                    selectedItem.textDecoration === "underline"
                                      ? "none"
                                      : "underline",
                                  )
                                }
                                style={{
                                  ...smallButtonStyle,
                                  backgroundColor:
                                    selectedItem.textDecoration === "underline"
                                      ? currentTheme === "dark"
                                        ? "#3b82f6"
                                        : "#dbeafe"
                                      : "transparent",
                                }}
                              >
                                <Underline size={12} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        Actions
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button
                            onClick={() =>
                              updateItemProperty(
                                selectedItem.id,
                                "locked",
                                !selectedItem.locked,
                              )
                            }
                            style={{
                              ...smallButtonStyle,
                              backgroundColor: selectedItem.locked
                                ? currentTheme === "dark"
                                  ? "#ef4444"
                                  : "#fecaca"
                                : "transparent",
                            }}
                            title={selectedItem.locked ? "Unlock" : "Lock"}
                          >
                            {selectedItem.locked ? (
                              <Lock size={12} />
                            ) : (
                              <Unlock size={12} />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              updateItemProperty(
                                selectedItem.id,
                                "visible",
                                !selectedItem.visible,
                              )
                            }
                            style={{
                              ...smallButtonStyle,
                              backgroundColor: !selectedItem.visible
                                ? currentTheme === "dark"
                                  ? "#6b7280"
                                  : "#d1d5db"
                                : "transparent",
                            }}
                            title={selectedItem.visible ? "Hide" : "Show"}
                          >
                            {selectedItem.visible ? (
                              <Eye size={12} />
                            ) : (
                              <EyeOff size={12} />
                            )}
                          </button>
                          <button
                            onClick={() => {}}
                            style={smallButtonStyle}
                            title="Flip Horizontal"
                          >
                            <FlipHorizontal size={12} />
                          </button>
                          <button
                            onClick={() => {}}
                            style={smallButtonStyle}
                            title="Flip Vertical"
                          >
                            <FlipVertical size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
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
          backgroundColor: currentTheme === "dark" ? "#111827" : "#f1f5f9",
          borderTop: `1px solid ${currentTheme === "dark" ? "#374151" : "#e2e8f0"}`,
          fontSize: "11px",
          color: currentTheme === "dark" ? "#9ca3af" : "#64748b",
        }}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          <span>Items: {canvasItems.length}</span>
          <span>Selected: {selectedItemIds.length}</span>
          <span>Layer: {layers.find((l) => l.id === currentLayer)?.name}</span>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <span>Tool: {tools.find((t) => t.id === currentTool)?.name}</span>
          <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
          <span>Grid: {showGrid ? "On" : "Off"}</span>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate grid pattern
const getGridPattern = (
  grid: { size: number; color: string; style: "dots" | "lines" | "crosses" },
  zoom: number,
): string => {
  const size = grid.size * zoom;

  switch (grid.style) {
    case "dots":
      return `radial-gradient(circle, ${grid.color} 1px, transparent 1px)`;
    case "lines":
      return `linear-gradient(${grid.color} 1px, transparent 1px), linear-gradient(90deg, ${grid.color} 1px, transparent 1px)`;
    case "crosses":
      return `linear-gradient(${grid.color} 1px, transparent 1px), linear-gradient(90deg, ${grid.color} 1px, transparent 1px)`;
    default:
      return `radial-gradient(circle, ${grid.color} 1px, transparent 1px)`;
  }
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
  transition: "background-color 0.2s",
  color: "inherit",
};

const smallButtonStyle: React.CSSProperties = {
  padding: "6px",
  backgroundColor: "transparent",
  border: `1px solid currentColor`,
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

const inputStyle: React.CSSProperties = {
  padding: "6px 8px",
  backgroundColor: "transparent",
  border: "1px solid currentColor",
  borderRadius: "4px",
  fontSize: "12px",
  color: "inherit",
  width: "100%",
};

export default PremiumCanvas;
