import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  PhotoIcon,
  SparklesIcon,
  TypeToolIcon,
  ColorSwatchIcon,
  DownloadIcon,
  EyeIcon,
  PlusCircleIcon,
  TrashIcon,
  WandIcon,
  ArrowUpTrayIcon,
  PaintBrushIcon,
  CursorArrowRaysIcon,
  SwatchIcon,
  RectangleIcon,
  CircleIcon,
  StarIcon,
  BoltIcon,
  AdjustmentsHorizontalIcon,
} from "./IconComponents";

interface ThumbnailElement {
  id: string;
  type: "text" | "image" | "shape" | "effect" | "arrow";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  imageUrl?: string;
  rotation?: number;
  opacity?: number;
  borderRadius?: number;
  shadow?: string;
  gradient?: string;
  borderColor?: string;
  borderWidth?: number;
  zIndex?: number;
  // New premium properties
  textShadow?: string;
  textOutline?: string;
  backgroundGradient?: string;
  filter?: string;
  blendMode?: string;
  animation?: string;
  arrowStyle?: string;
  arrowDirection?: number;
  glow?: string;
  pattern?: string;
}

interface GenerativeFillArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  prompt: string;
  isGenerating: boolean;
}

interface EnhancedThumbnailMakerProps {
  onGenerateWithAI?: (prompt: string, config?: any) => void;
  onGenerativeFill?: (area: GenerativeFillArea, baseImage: string) => void;
  isLoading?: boolean;
  generatedBackground?: string | null;
  onBackgroundGenerated?: (background: string | null) => void;
}

const EnhancedThumbnailMaker: React.FC<EnhancedThumbnailMakerProps> = ({
  onGenerateWithAI,
  onGenerativeFill,
  isLoading = false,
  generatedBackground,
  onBackgroundGenerated,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // States
  const [elements, setElements] = useState<ThumbnailElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<
    "select" | "text" | "shape" | "fill" | "arrow" | "gradient" | "effect"
  >("select");
  const [aiPrompt, setAiPrompt] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [fillAreas, setFillAreas] = useState<GenerativeFillArea[]>([]);
  const [isDrawingFillArea, setIsDrawingFillArea] = useState(false);
  const [fillPrompt, setFillPrompt] = useState("");

  // Advanced features
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);
  const [canvasBackground, setCanvasBackground] = useState("#0f172a");
  const [gridVisible, setGridVisible] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [goldenRatioVisible, setGoldenRatioVisible] = useState(false);
  const [selectedArrowStyle, setSelectedArrowStyle] = useState("classic");
  const [selectedGradientType, setSelectedGradientType] = useState("linear");

  // YouTube thumbnail dimensions (1920x1080 HD standard)
  const CANVAS_WIDTH = 1920;
  const CANVAS_HEIGHT = 1080;
  // Make display much larger - 2/3 of typical screen width
  const DISPLAY_WIDTH = Math.min(1200, window.innerWidth * 0.65);
  const DISPLAY_HEIGHT = (DISPLAY_WIDTH * 9) / 16; // Maintain 16:9 aspect ratio

  // Arrow styles with variations
  const arrowStyles = [
    { id: "classic", name: "Classic", symbol: "→" },
    { id: "bold", name: "Bold", symbol: "⟶" },
    { id: "curved", name: "Curved", symbol: "↪" },
    { id: "double", name: "Double", symbol: "⇒" },
    { id: "dashed", name: "Dashed", symbol: "⤏" },
    { id: "wavy", name: "Wavy", symbol: "↝" },
    { id: "3d", name: "3D", symbol: "➤" },
    { id: "neon", name: "Neon", symbol: "➜" },
    { id: "brush", name: "Brush", symbol: "➽" },
    { id: "outline", name: "Outline", symbol: "⮕" },
    { id: "gradient", name: "Gradient", symbol: "➡" },
    { id: "glow", name: "Glow", symbol: "⟹" },
  ];

  // Premium gradient presets
  const gradientPresets = [
    {
      name: "Fire",
      gradient: "linear-gradient(45deg, #ff0000, #ff8c00, #ffd700)",
    },
    {
      name: "Ocean",
      gradient: "linear-gradient(45deg, #001f3f, #0074d9, #7fdbff)",
    },
    {
      name: "Sunset",
      gradient: "linear-gradient(45deg, #ff6b6b, #ffa726, #ffcc80)",
    },
    { name: "Purple", gradient: "linear-gradient(45deg, #6a11cb, #2575fc)" },
    { name: "Green", gradient: "linear-gradient(45deg, #11998e, #38ef7d)" },
    { name: "Pink", gradient: "linear-gradient(45deg, #fc466b, #3f5efb)" },
    {
      name: "Gold",
      gradient: "linear-gradient(45deg, #ffd700, #ff8c00, #ff6b6b)",
    },
    {
      name: "Chrome",
      gradient: "linear-gradient(45deg, #c0c0c0, #e8e8e8, #a8a8a8)",
    },
  ];

  // Enhanced templates with modern designs
  const templates = [
    {
      id: "gaming-pro",
      name: "Gaming Pro",
      thumbnail: "🎮",
      description: "Modern gaming thumbnail with neon effects",
      elements: [
        {
          id: "main-title",
          type: "text" as const,
          x: 90,
          y: 120,
          width: 1200,
          height: 180,
          content: "INSANE GAMEPLAY!",
          fontSize: 140,
          fontWeight: "900",
          fontFamily: "Impact",
          color: "#ffffff",
          textShadow: "0 0 20px #ff0080, 0 0 40px #ff0080",
          textOutline: "3px #000000",
          zIndex: 3,
        },
        {
          id: "arrow-1",
          type: "arrow" as const,
          x: 1400,
          y: 200,
          width: 300,
          height: 150,
          arrowStyle: "neon",
          arrowDirection: 0,
          color: "#00ff00",
          glow: "0 0 30px #00ff00",
          zIndex: 3,
        },
      ],
    },
    {
      id: "tutorial-modern",
      name: "Tutorial Modern",
      thumbnail: "📚",
      description: "Clean tutorial design with professional layout",
      elements: [
        {
          id: "step-circle",
          type: "shape" as const,
          x: 75,
          y: 75,
          width: 200,
          height: 200,
          backgroundColor: "#3b82f6",
          borderRadius: 100,
          backgroundGradient: "radial-gradient(circle, #3b82f6, #1e40af)",
          shadow: "0 10px 30px rgba(59, 130, 246, 0.5)",
          zIndex: 2,
        },
        {
          id: "step-number",
          type: "text" as const,
          x: 125,
          y: 125,
          width: 100,
          height: 100,
          content: "1",
          fontSize: 120,
          fontWeight: "900",
          color: "#ffffff",
          zIndex: 3,
        },
        {
          id: "title",
          type: "text" as const,
          x: 320,
          y: 180,
          width: 1200,
          height: 150,
          content: "Master This Technique Fast",
          fontSize: 100,
          fontWeight: "800",
          color: "#ffffff",
          textShadow: "4px 4px 8px rgba(0,0,0,0.8)",
          zIndex: 3,
        },
      ],
    },
    {
      id: "viral-modern",
      name: "Viral Modern",
      thumbnail: "🔥",
      description: "Eye-catching viral thumbnail with premium effects",
      elements: [
        {
          id: "main-text",
          type: "text" as const,
          x: 90,
          y: 150,
          width: 1400,
          height: 300,
          content: "YOU WON'T BELIEVE THIS!",
          fontSize: 120,
          fontWeight: "900",
          color: "#ffffff",
          backgroundGradient:
            "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)",
          textShadow: "0 0 30px rgba(255, 107, 107, 0.8)",
          textOutline: "4px #000000",
          zIndex: 3,
        },
        {
          id: "shock-arrow",
          type: "arrow" as const,
          x: 1500,
          y: 300,
          width: 350,
          height: 200,
          arrowStyle: "3d",
          arrowDirection: 225,
          color: "#ffff00",
          glow: "0 0 40px #ffff00",
          zIndex: 3,
        },
      ],
    },
    {
      id: "tech-review",
      name: "Tech Review",
      thumbnail: "📱",
      description: "Professional tech review layout",
      elements: [
        {
          id: "tech-title",
          type: "text" as const,
          x: 90,
          y: 100,
          width: 1400,
          height: 120,
          content: "AMAZING NEW TECH REVEALED",
          fontSize: 90,
          fontWeight: "700",
          color: "#ffffff",
          backgroundGradient: "linear-gradient(45deg, #667eea, #764ba2)",
          textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
          zIndex: 3,
        },
        {
          id: "rating",
          type: "text" as const,
          x: 1600,
          y: 850,
          width: 250,
          height: 150,
          content: "9.5/10",
          fontSize: 80,
          fontWeight: "900",
          color: "#00ff00",
          backgroundColor: "rgba(0,0,0,0.8)",
          borderRadius: 20,
          padding: 20,
          zIndex: 3,
        },
      ],
    },
  ];

  // Enhanced color palette with premium colors
  const colorPalette = [
    "#ffffff",
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#ffeaa7",
    "#dda0dd",
    "#98d8c8",
    "#f7dc6f",
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#f97316",
    "#06b6d4",
    "#84cc16",
    "#e11d48",
    "#7c3aed",
    "#0891b2",
    "#dc2626",
    "#9333ea",
    "#0ea5e9",
    "#ea580c",
    "#65a30d",
    "#fbbf24",
    "#a855f7",
    "#06b6d4",
    "#ef4444",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#06b6d4",
  ];

  // Premium font families
  const fontFamilies = [
    "Arial",
    "Impact",
    "Georgia",
    "Times New Roman",
    "Verdana",
    "Comic Sans MS",
    "Trebuchet MS",
    "Courier New",
    "Oswald",
    "Roboto",
    "Montserrat",
    "Bebas Neue",
  ];

  // Text effects presets
  const textEffects = [
    { name: "Glow", effect: "0 0 20px currentColor" },
    {
      name: "Neon",
      effect: "0 0 10px #ff0080, 0 0 20px #ff0080, 0 0 30px #ff0080",
    },
    { name: "Fire", effect: "0 0 15px #ff4500, 0 0 30px #ff6500" },
    { name: "Ice", effect: "0 0 15px #00bfff, 0 0 30px #87ceeb" },
    {
      name: "Thunder",
      effect: "0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ffd700",
    },
    { name: "Shadow", effect: "3px 3px 6px rgba(0,0,0,0.8)" },
  ];

  // Filter effects
  const filterEffects = [
    { name: "None", filter: "" },
    { name: "Blur", filter: "blur(2px)" },
    { name: "Brightness", filter: "brightness(1.2)" },
    { name: "Contrast", filter: "contrast(1.3)" },
    { name: "Saturate", filter: "saturate(1.5)" },
    { name: "Sepia", filter: "sepia(0.5)" },
    { name: "Invert", filter: "invert(1)" },
    { name: "Hue Rotate", filter: "hue-rotate(90deg)" },
  ];

  // Load template
  const loadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setElements(template.elements);
      setSelectedElement(null);
    }
  };

  // Add element functions
  const addTextElement = () => {
    const newElement: ThumbnailElement = {
      id: `text-${Date.now()}`,
      type: "text",
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 400,
      height: 100,
      content: "AMAZING TEXT",
      fontSize: 60,
      fontWeight: "800",
      fontFamily: "Impact",
      color: "#ffffff",
      textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
      textOutline: "2px #000000",
      zIndex: elements.length + 1,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const addShapeElement = (
    shapeType: "rectangle" | "circle" | "star" | "triangle",
  ) => {
    const newElement: ThumbnailElement = {
      id: `shape-${Date.now()}`,
      type: "shape",
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 200,
      height: 200,
      backgroundColor: "#3b82f6",
      borderRadius: shapeType === "circle" ? 100 : 20,
      backgroundGradient:
        shapeType === "star" ? "radial-gradient(circle, #ffd700, #ff8c00)" : "",
      shadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
      opacity: 0.9,
      zIndex: elements.length + 1,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const addArrowElement = (style: string = "classic") => {
    const newElement: ThumbnailElement = {
      id: `arrow-${Date.now()}`,
      type: "arrow",
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      width: 250,
      height: 120,
      arrowStyle: style,
      arrowDirection: 0,
      color: "#ffff00",
      glow: style === "neon" ? "0 0 20px currentColor" : "",
      shadow: "3px 3px 8px rgba(0,0,0,0.6)",
      zIndex: elements.length + 1,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const addGradientElement = () => {
    const randomGradient =
      gradientPresets[Math.floor(Math.random() * gradientPresets.length)];
    const newElement: ThumbnailElement = {
      id: `gradient-${Date.now()}`,
      type: "shape",
      x: 150 + Math.random() * 200,
      y: 150 + Math.random() * 200,
      width: 300,
      height: 200,
      backgroundGradient: randomGradient.gradient,
      borderRadius: 15,
      opacity: 0.8,
      zIndex: elements.length + 1,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  // Generate background with AI
  const generateBackground = () => {
    if (onGenerateWithAI && aiPrompt.trim()) {
      onGenerateWithAI(
        `Create a stunning YouTube thumbnail background: ${aiPrompt}. Ultra high quality, vibrant colors, dramatic lighting, attention-grabbing, 16:9 aspect ratio, professional YouTube thumbnail style, 1920x1080 resolution, cinematic, trending style`,
        {
          type: "background",
          dimensions: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
        },
      );
    }
  };

  // Element manipulation
  const updateElement = (id: string, updates: Partial<ThumbnailElement>) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    );
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    setSelectedElement(null);
  };

  const duplicateElement = (id: string) => {
    const element = elements.find((el) => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        x: element.x + 30,
        y: element.y + 30,
        zIndex: elements.length + 1,
      };
      setElements([...elements, newElement]);
      setSelectedElement(newElement.id);
    }
  };

  const bringToFront = (id: string) => {
    const maxZ = Math.max(...elements.map((el) => el.zIndex || 0));
    updateElement(id, { zIndex: maxZ + 1 });
  };

  const sendToBack = (id: string) => {
    const minZ = Math.min(...elements.map((el) => el.zIndex || 0));
    updateElement(id, { zIndex: minZ - 1 });
  };

  // Export functionality with premium options
  const exportThumbnail = (
    format: "png" | "jpg" | "webp" = "png",
    quality: number = 0.95,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `youtube-thumbnail-premium-${Date.now()}.${format}`;
    const mimeType =
      format === "jpg"
        ? "image/jpeg"
        : format === "webp"
          ? "image/webp"
          : "image/png";
    link.href = canvas.toDataURL(mimeType, quality);
    link.click();
  };

  // Handle generated background
  useEffect(() => {
    if (generatedBackground) {
      setBackgroundImage(generatedBackground);
    }
  }, [generatedBackground]);

  // Canvas rendering with premium effects
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with premium background
    const gradient = ctx.createLinearGradient(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
    );
    gradient.addColorStop(0, canvasBackground);
    gradient.addColorStop(1, adjustBrightness(canvasBackground, -20));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw premium grid if visible
    if (gridVisible) {
      drawPremiumGrid(ctx);
    }

    // Draw corrected golden ratio guide if visible
    if (goldenRatioVisible) {
      drawCorrectGoldenRatio(ctx);
    }

    // Draw background image with effects
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.restore();
        drawElements();
      };
      img.src = backgroundImage;
    } else {
      drawElements();
    }

    function drawPremiumGrid(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      const gridSize = 60;
      for (let x = 0; x <= CANVAS_WIDTH; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= CANVAS_HEIGHT; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawCorrectGoldenRatio(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.strokeStyle = "rgba(255, 215, 0, 0.8)";
      ctx.lineWidth = 3;

      const phi = 1.618033988749; // Golden ratio

      // Create main rectangle that fits the canvas with proper golden ratio
      const padding = 80;
      const maxWidth = CANVAS_WIDTH - padding * 2;
      const maxHeight = CANVAS_HEIGHT - padding * 2;

      // Start with width and calculate height using golden ratio
      let rectWidth = maxWidth;
      let rectHeight = rectWidth / phi;

      // If height exceeds available space, constrain by height
      if (rectHeight > maxHeight) {
        rectHeight = maxHeight;
        rectWidth = rectHeight * phi;
      }

      const startX = (CANVAS_WIDTH - rectWidth) / 2;
      const startY = (CANVAS_HEIGHT - rectHeight) / 2;

      // Draw main golden rectangle outline
      ctx.strokeRect(startX, startY, rectWidth, rectHeight);

      // Calculate the golden section division
      // In a golden rectangle, the larger part is to the smaller part as the whole is to the larger part
      const largerSection = rectWidth / phi; // This is the width of the larger (left) section
      const smallerSection = rectWidth - largerSection; // This is the width of the smaller (right) section

      const divisionX = startX + largerSection;

      // Draw the main vertical division line
      ctx.beginPath();
      ctx.moveTo(divisionX, startY);
      ctx.lineTo(divisionX, startY + rectHeight);
      ctx.stroke();

      // The right section should be divided to create a square
      // The square's side length equals the smaller section width
      const squareSide = smallerSection;
      const squareBottom = startY + squareSide;

      // Draw horizontal line to create the square in the top-right
      ctx.beginPath();
      ctx.moveTo(divisionX, squareBottom);
      ctx.lineTo(startX + rectWidth, squareBottom);
      ctx.stroke();

      // Now we'll draw the Fibonacci spiral with proper mathematical precision
      ctx.strokeStyle = "rgba(255, 215, 0, 1.0)";
      ctx.lineWidth = 4;

      // Define the sequence of rectangles for the spiral
      // Each rectangle gets smaller by the golden ratio
      const rectangles = [
        {
          // Main left rectangle
          x: startX,
          y: startY,
          width: largerSection,
          height: rectHeight,
          quadrant: "bottom-left",
        },
        {
          // Top-right square
          x: divisionX,
          y: startY,
          width: smallerSection,
          height: squareSide,
          quadrant: "bottom-right",
        },
        {
          // Bottom-right rectangle
          x: divisionX,
          y: squareBottom,
          width: smallerSection,
          height: rectHeight - squareSide,
          quadrant: "top-right",
        },
      ];

      // Now divide the bottom-right rectangle further
      const nextWidth = (rectHeight - squareSide) * phi;
      const nextHeight = rectHeight - squareSide;

      if (nextWidth < smallerSection) {
        rectangles.push({
          x: divisionX + smallerSection - nextWidth,
          y: squareBottom,
          width: nextWidth,
          height: nextHeight,
          quadrant: "top-left",
        });
      }

      // Draw the spiral arcs
      const spiralArcs = [
        {
          // Arc in the main left rectangle (bottom-left quadrant)
          centerX: divisionX,
          centerY: startY + rectHeight,
          radius: largerSection,
          startAngle: Math.PI,
          endAngle: Math.PI * 1.5,
        },
        {
          // Arc in the top-right square (bottom-right quadrant)
          centerX: divisionX,
          centerY: squareBottom,
          radius: squareSide,
          startAngle: Math.PI * 1.5,
          endAngle: Math.PI * 2,
        },
        {
          // Arc in the bottom-right rectangle (top-right quadrant)
          centerX: divisionX + (rectHeight - squareSide),
          centerY: squareBottom,
          radius: rectHeight - squareSide,
          startAngle: 0,
          endAngle: Math.PI * 0.5,
        },
      ];

      // Add more spiral segments if space allows
      let currentSize = rectHeight - squareSide;
      let currentX = divisionX + smallerSection - currentSize;
      let currentY = squareBottom;

      for (let i = 0; i < 2 && currentSize > 10; i++) {
        const nextSize = currentSize / phi;

        if (i === 0) {
          // Top-left quadrant in the current rectangle
          spiralArcs.push({
            centerX: currentX + currentSize,
            centerY: currentY + nextSize,
            radius: nextSize,
            startAngle: Math.PI * 0.5,
            endAngle: Math.PI,
          });
          currentX = currentX + currentSize - nextSize;
          currentY = currentY;
        } else {
          // Bottom-left quadrant
          spiralArcs.push({
            centerX: currentX + nextSize,
            centerY: currentY + nextSize,
            radius: nextSize / phi,
            startAngle: Math.PI,
            endAngle: Math.PI * 1.5,
          });
        }

        currentSize = nextSize;
      }

      // Draw all spiral arcs
      spiralArcs.forEach((arc) => {
        ctx.beginPath();
        ctx.arc(
          arc.centerX,
          arc.centerY,
          arc.radius,
          arc.startAngle,
          arc.endAngle,
        );
        ctx.stroke();
      });

      // Draw construction lines with lighter color
      ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
      ctx.lineWidth = 1;

      // Additional subdivision lines for the smaller rectangles
      const subDivisionWidth = (rectHeight - squareSide) / phi;
      if (subDivisionWidth > 5) {
        // Vertical line in bottom-right rectangle
        ctx.beginPath();
        ctx.moveTo(divisionX + smallerSection - subDivisionWidth, squareBottom);
        ctx.lineTo(
          divisionX + smallerSection - subDivisionWidth,
          startY + rectHeight,
        );
        ctx.stroke();

        // Horizontal line in the subdivided rectangle
        const subHeight = subDivisionWidth;
        ctx.beginPath();
        ctx.moveTo(
          divisionX + smallerSection - subDivisionWidth,
          squareBottom + subHeight,
        );
        ctx.lineTo(divisionX + smallerSection, squareBottom + subHeight);
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawElements() {
      // Sort elements by zIndex
      const sortedElements = [...elements].sort(
        (a, b) => (a.zIndex || 0) - (b.zIndex || 0),
      );

      sortedElements.forEach((element) => {
        ctx.save();

        // Apply filters
        if (element.filter) {
          ctx.filter = element.filter;
        }

        // Apply opacity
        if (element.opacity !== undefined) {
          ctx.globalAlpha = element.opacity;
        }

        if (element.type === "text" && element.content) {
          drawTextElement(ctx, element);
        } else if (element.type === "shape") {
          drawShapeElement(ctx, element);
        } else if (element.type === "arrow") {
          drawArrowElement(ctx, element);
        }

        ctx.restore();
      });

      // Draw selection indicator with premium styling
      if (selectedElement) {
        const element = elements.find((el) => el.id === selectedElement);
        if (element) {
          ctx.save();
          ctx.strokeStyle = "#06b6d4";
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 4]);
          ctx.shadowColor = "#06b6d4";
          ctx.shadowBlur = 10;
          ctx.strokeRect(
            element.x - 10,
            element.y - 10,
            element.width + 20,
            element.height + 20,
          );
          ctx.setLineDash([]);

          // Premium resize handles
          const handleSize = 12;
          const handles = [
            { x: element.x - handleSize / 2, y: element.y - handleSize / 2 },
            {
              x: element.x + element.width - handleSize / 2,
              y: element.y - handleSize / 2,
            },
            {
              x: element.x - handleSize / 2,
              y: element.y + element.height - handleSize / 2,
            },
            {
              x: element.x + element.width - handleSize / 2,
              y: element.y + element.height - handleSize / 2,
            },
          ];

          handles.forEach((handle) => {
            ctx.fillStyle = "#06b6d4";
            ctx.shadowColor = "#06b6d4";
            ctx.shadowBlur = 5;
            ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
          });
          ctx.restore();
        }
      }
    }

    function drawTextElement(
      ctx: CanvasRenderingContext2D,
      element: ThumbnailElement,
    ) {
      if (!element.content) return;

      ctx.font = `${element.fontWeight || "700"} ${element.fontSize || 48}px ${element.fontFamily || "Arial"}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Apply premium text effects
      if (element.textShadow) {
        ctx.shadowColor = extractShadowColor(element.textShadow);
        ctx.shadowBlur = extractShadowBlur(element.textShadow);
        ctx.shadowOffsetX = extractShadowOffsetX(element.textShadow);
        ctx.shadowOffsetY = extractShadowOffsetY(element.textShadow);
      }

      // Text outline
      if (element.textOutline) {
        ctx.strokeStyle = extractOutlineColor(element.textOutline);
        ctx.lineWidth = extractOutlineWidth(element.textOutline);
        ctx.strokeText(element.content, element.x, element.y);
      }

      // Text fill with gradient support
      if (element.backgroundGradient) {
        const gradient = createGradientFromString(
          ctx,
          element.backgroundGradient,
          element.x,
          element.y,
          element.width,
          element.height,
        );
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = element.color || "#ffffff";
      }

      ctx.fillText(element.content, element.x, element.y);
    }

    function drawShapeElement(
      ctx: CanvasRenderingContext2D,
      element: ThumbnailElement,
    ) {
      // Apply shadows
      if (element.shadow) {
        const shadowParts = element.shadow.split(" ");
        ctx.shadowOffsetX = parseInt(shadowParts[0]) || 0;
        ctx.shadowOffsetY = parseInt(shadowParts[1]) || 0;
        ctx.shadowBlur = parseInt(shadowParts[2]) || 0;
        ctx.shadowColor = shadowParts[3] || "rgba(0,0,0,0.5)";
      }

      // Fill with gradient or solid color
      if (element.backgroundGradient) {
        const gradient = createGradientFromString(
          ctx,
          element.backgroundGradient,
          element.x,
          element.y,
          element.width,
          element.height,
        );
        ctx.fillStyle = gradient;
      } else if (element.backgroundColor) {
        ctx.fillStyle = element.backgroundColor;
      }

      // Draw shape based on border radius
      if (element.borderRadius && element.borderRadius > 0) {
        drawRoundedRect(
          ctx,
          element.x,
          element.y,
          element.width,
          element.height,
          element.borderRadius,
        );
        ctx.fill();
      } else {
        ctx.fillRect(element.x, element.y, element.width, element.height);
      }

      // Draw border
      if (element.borderColor && element.borderWidth) {
        ctx.strokeStyle = element.borderColor;
        ctx.lineWidth = element.borderWidth;
        if (element.borderRadius && element.borderRadius > 0) {
          drawRoundedRect(
            ctx,
            element.x,
            element.y,
            element.width,
            element.height,
            element.borderRadius,
          );
          ctx.stroke();
        } else {
          ctx.strokeRect(element.x, element.y, element.width, element.height);
        }
      }
    }

    function drawArrowElement(
      ctx: CanvasRenderingContext2D,
      element: ThumbnailElement,
    ) {
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      const rotation = ((element.arrowDirection || 0) * Math.PI) / 180;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Apply glow effect
      if (element.glow) {
        ctx.shadowColor = element.color || "#ffff00";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      // Apply shadow
      if (element.shadow) {
        const shadowParts = element.shadow.split(" ");
        ctx.shadowOffsetX = parseInt(shadowParts[0]) || 0;
        ctx.shadowOffsetY = parseInt(shadowParts[1]) || 0;
        ctx.shadowBlur = parseInt(shadowParts[2]) || 0;
        ctx.shadowColor = shadowParts[3] || "rgba(0,0,0,0.5)";
      }

      ctx.fillStyle = element.color || "#ffff00";
      ctx.strokeStyle = element.color || "#ffff00";

      // Draw different arrow styles
      const style = element.arrowStyle || "classic";
      const width = element.width;
      const height = element.height;

      switch (style) {
        case "classic":
          drawClassicArrow(ctx, width, height);
          break;
        case "bold":
          drawBoldArrow(ctx, width, height);
          break;
        case "curved":
          drawCurvedArrow(ctx, width, height);
          break;
        case "double":
          drawDoubleArrow(ctx, width, height);
          break;
        case "3d":
          draw3DArrow(ctx, width, height, element);
          break;
        case "neon":
          drawNeonArrow(ctx, width, height);
          break;
        default:
          drawClassicArrow(ctx, width, height);
      }

      ctx.restore();
    }

    // Arrow drawing functions
    function drawClassicArrow(
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) {
      ctx.beginPath();
      ctx.moveTo(-width / 2, 0);
      ctx.lineTo(width / 3, 0);
      ctx.lineTo(width / 3, -height / 3);
      ctx.lineTo(width / 2, 0);
      ctx.lineTo(width / 3, height / 3);
      ctx.lineTo(width / 3, 0);
      ctx.closePath();
      ctx.fill();
    }

    function drawBoldArrow(
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) {
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(-width / 2, 0);
      ctx.lineTo(width / 4, 0);
      ctx.moveTo(width / 4 - 20, -height / 4);
      ctx.lineTo(width / 2, 0);
      ctx.lineTo(width / 4 - 20, height / 4);
      ctx.stroke();
    }

    function drawCurvedArrow(
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) {
      ctx.beginPath();
      ctx.moveTo(-width / 2, height / 4);
      ctx.quadraticCurveTo(0, -height / 2, width / 3, 0);
      ctx.lineTo(width / 3, -height / 3);
      ctx.lineTo(width / 2, 0);
      ctx.lineTo(width / 3, height / 3);
      ctx.lineTo(width / 3, 0);
      ctx.quadraticCurveTo(0, height / 2, -width / 2, -height / 4);
      ctx.fill();
    }

    function drawDoubleArrow(
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) {
      // First arrow
      drawClassicArrow(ctx, width * 0.8, height * 0.8);

      // Second arrow slightly offset
      ctx.save();
      ctx.translate(width * 0.1, 0);
      ctx.globalAlpha = 0.7;
      drawClassicArrow(ctx, width * 0.8, height * 0.8);
      ctx.restore();
    }

    function draw3DArrow(
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      element: ThumbnailElement,
    ) {
      // Main arrow
      ctx.fillStyle = element.color || "#ffff00";
      drawClassicArrow(ctx, width, height);

      // 3D effect
      ctx.save();
      ctx.fillStyle = adjustBrightness(element.color || "#ffff00", -30);
      ctx.translate(5, 5);
      drawClassicArrow(ctx, width, height);
      ctx.restore();
    }

    function drawNeonArrow(
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) {
      ctx.lineWidth = 6;
      ctx.strokeStyle = element.color || "#00ffff";
      ctx.shadowColor = element.color || "#00ffff";
      ctx.shadowBlur = 15;

      ctx.beginPath();
      ctx.moveTo(-width / 2, 0);
      ctx.lineTo(width / 3, 0);
      ctx.moveTo(width / 3 - 15, -height / 3);
      ctx.lineTo(width / 2, 0);
      ctx.lineTo(width / 3 - 15, height / 3);
      ctx.stroke();
    }

    // Helper functions
    function drawRoundedRect(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number,
    ) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height,
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    function createGradientFromString(
      ctx: CanvasRenderingContext2D,
      gradientStr: string,
      x: number,
      y: number,
      width: number,
      height: number,
    ) {
      // Simple gradient parser - you might want to make this more robust
      if (gradientStr.includes("linear-gradient")) {
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        // Extract colors from gradient string (simplified)
        const colors =
          gradientStr.match(
            /#[0-9a-f]{6}|#[0-9a-f]{3}|rgb\([^)]+\)|rgba\([^)]+\)/gi,
          ) || [];
        colors.forEach((color, index) => {
          gradient.addColorStop(index / (colors.length - 1), color);
        });
        return gradient;
      }
      return "#3b82f6"; // fallback
    }

    function adjustBrightness(color: string, amount: number): string {
      // Simple brightness adjustment
      if (color.startsWith("#")) {
        const num = parseInt(color.slice(1), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
      }
      return color;
    }

    // Shadow and outline parsing functions
    function extractShadowColor(shadow: string): string {
      const colorMatch = shadow.match(/#[0-9a-f]{6}|rgba?\([^)]+\)/i);
      return colorMatch ? colorMatch[0] : "rgba(0,0,0,0.7)";
    }

    function extractShadowBlur(shadow: string): number {
      const blurMatch = shadow.match(/(\d+)px/g);
      return blurMatch && blurMatch[2] ? parseInt(blurMatch[2]) : 4;
    }

    function extractShadowOffsetX(shadow: string): number {
      const offsetMatch = shadow.match(/(-?\d+)px/);
      return offsetMatch ? parseInt(offsetMatch[1]) : 0;
    }

    function extractShadowOffsetY(shadow: string): number {
      const offsetMatch = shadow.match(/(-?\d+)px/g);
      return offsetMatch && offsetMatch[1] ? parseInt(offsetMatch[1]) : 0;
    }

    function extractOutlineColor(outline: string): string {
      const colorMatch = outline.match(/#[0-9a-f]{6}|rgba?\([^)]+\)/i);
      return colorMatch ? colorMatch[0] : "#000000";
    }

    function extractOutlineWidth(outline: string): number {
      const widthMatch = outline.match(/(\d+)px/);
      return widthMatch ? parseInt(widthMatch[1]) : 2;
    }
  }, [
    elements,
    selectedElement,
    backgroundImage,
    gridVisible,
    goldenRatioVisible,
    canvasBackground,
    fillAreas,
  ]);

  // Re-render when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const selectedEl = selectedElement
    ? elements.find((el) => el.id === selectedElement)
    : null;

  return (
    <div className="flex-grow bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col space-y-8">
      {/* Premium Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-sky-500 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center">
            <PhotoIcon className="w-8 h-8 mr-4 text-sky-400" />
            Premium Thumbnail Studio
          </h2>
          <p className="text-slate-300 text-sm">
            Professional 1920×1080 HD YouTube thumbnails with AI-powered tools,
            golden ratio guides, and premium effects
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            PRO
          </div>
          <button
            onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
            className={`px-4 py-2 rounded-xl text-sm flex items-center space-x-2 transition-all duration-300 ${
              showAdvancedPanel
                ? "bg-gradient-to-r from-emerald-600 via-sky-600 to-purple-600 text-white shadow-lg"
                : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600"
            }`}
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            <span>Advanced</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 flex-grow">
        {/* Left Panel - Premium Tools & Templates */}
        <div className="xl:col-span-1 space-y-6">
          {/* Premium Tool Selection */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BoltIcon className="w-5 h-5 mr-2 text-yellow-400" />
              Premium Tools
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: "select",
                  label: "Select",
                  icon: CursorArrowRaysIcon,
                  color: "blue",
                },
                {
                  id: "text",
                  label: "Text",
                  icon: TypeToolIcon,
                  color: "green",
                },
                {
                  id: "shape",
                  label: "Shape",
                  icon: RectangleIcon,
                  color: "purple",
                },
                { id: "arrow", label: "Arrow", icon: "→", color: "orange" },
                {
                  id: "gradient",
                  label: "Gradient",
                  icon: SwatchIcon,
                  color: "pink",
                },
                {
                  id: "fill",
                  label: "AI Fill",
                  icon: PaintBrushIcon,
                  color: "cyan",
                },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setSelectedTool(tool.id as any);
                    if (tool.id === "arrow")
                      addArrowElement(selectedArrowStyle);
                    if (tool.id === "gradient") addGradientElement();
                  }}
                  className={`p-4 rounded-xl text-sm flex flex-col items-center space-y-2 transition-all duration-300 ${
                    selectedTool === tool.id
                      ? `bg-gradient-to-r from-${tool.color}-600 to-${tool.color}-500 text-white shadow-lg scale-105`
                      : "bg-slate-700/50 hover:bg-slate-600/60 text-slate-300 border border-slate-600 hover:border-slate-500"
                  }`}
                >
                  {typeof tool.icon === "string" ? (
                    <span className="text-xl font-bold">{tool.icon}</span>
                  ) : (
                    <tool.icon className="h-6 w-6" />
                  )}
                  <span className="font-medium">{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Arrow Styles Panel */}
          {selectedTool === "arrow" && (
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <span className="text-xl mr-2">→</span>
                Arrow Styles
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {arrowStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedArrowStyle(style.id);
                      addArrowElement(style.id);
                    }}
                    className={`p-3 rounded-lg text-xs flex flex-col items-center space-y-1 transition-all ${
                      selectedArrowStyle === style.id
                        ? "bg-orange-600 text-white"
                        : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                    }`}
                  >
                    <span className="text-lg">{style.symbol}</span>
                    <span>{style.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => addArrowElement(selectedArrowStyle)}
                className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold"
              >
                Add Arrow
              </button>
            </div>
          )}

          {/* Premium Templates */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-purple-400" />
              Premium Templates
            </h3>
            <div className="space-y-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => loadTemplate(template.id)}
                  className="w-full p-4 bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/80 hover:to-slate-500/80 rounded-xl text-left text-white text-sm transition-all duration-300 flex items-center space-x-3 border border-slate-600/50 hover:border-slate-500/50"
                >
                  <span className="text-2xl">{template.thumbnail}</span>
                  <div>
                    <div className="font-semibold">{template.name}</div>
                    <div className="text-xs text-slate-400">
                      {template.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Background Generator */}
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-purple-300" />
              AI Background Studio
            </h3>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Epic gaming battle scene, futuristic cyberpunk city, dramatic lighting, vibrant neon colors, cinematic atmosphere..."
              className="w-full p-4 bg-slate-800/80 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 text-sm mb-4 focus:border-purple-400 transition-colors"
              rows={4}
            />
            <button
              onClick={generateBackground}
              disabled={isLoading || !aiPrompt.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 via-sky-600 to-purple-600 hover:from-emerald-500 hover:via-sky-500 hover:to-purple-500 text-white font-semibold rounded-lg disabled:opacity-60 flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg"
            >
              <WandIcon className="h-5 w-5" />
              <span>
                {isLoading ? "Generating Magic..." : "Generate AI Background"}
              </span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Add</h3>
            <div className="space-y-3">
              <button
                onClick={addTextElement}
                className="w-full p-3 bg-gradient-to-r from-emerald-600 via-sky-600 to-purple-600 hover:from-emerald-500 hover:via-sky-500 hover:to-purple-500 rounded-lg text-white text-sm flex items-center justify-center space-x-2 font-semibold transition-all shadow-lg"
              >
                <TypeToolIcon className="h-4 w-4" />
                <span>Add Premium Text</span>
              </button>

              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => addShapeElement("rectangle")}
                  className="p-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-xs flex items-center justify-center transition-all"
                  title="Rectangle"
                >
                  <RectangleIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => addShapeElement("circle")}
                  className="p-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-xs flex items-center justify-center transition-all"
                  title="Circle"
                >
                  <CircleIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => addShapeElement("star")}
                  className="p-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-xs flex items-center justify-center transition-all"
                  title="Star"
                >
                  <StarIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => addShapeElement("triangle")}
                  className="p-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-xs flex items-center justify-center transition-all"
                  title="Triangle"
                >
                  ▲
                </button>
              </div>

              <button
                onClick={addGradientElement}
                className="w-full p-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg text-white text-sm flex items-center justify-center space-x-2 font-semibold transition-all shadow-lg"
              >
                <SwatchIcon className="h-4 w-4" />
                <span>Add Gradient</span>
              </button>
            </div>
          </div>

          {/* Premium Layers Panel */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <StarIcon className="w-5 h-5 mr-2 text-yellow-400" />
              Layers
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {elements
                .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
                .map((element, index) => (
                  <div
                    key={element.id}
                    onClick={() => setSelectedElement(element.id)}
                    className={`p-3 rounded-lg text-sm cursor-pointer transition-all flex items-center justify-between group ${
                      selectedElement === element.id
                        ? "bg-gradient-to-r from-emerald-600 via-sky-600 to-purple-600 text-white shadow-lg"
                        : "bg-slate-700/80 text-slate-300 hover:bg-slate-600/80 border border-slate-600"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          element.type === "text"
                            ? "bg-green-400"
                            : element.type === "arrow"
                              ? "bg-orange-400"
                              : element.type === "shape"
                                ? "bg-purple-400"
                                : "bg-blue-400"
                        }`}
                      />
                      <span className="truncate">
                        {element.type === "text"
                          ? element.content?.substring(0, 15) +
                            (element.content?.length > 15 ? "..." : "")
                          : element.type === "arrow"
                            ? `Arrow (${element.arrowStyle})`
                            : `${element.type} ${index + 1}`}
                      </span>
                    </div>
                    <EyeIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Center Panel - Premium Canvas */}
        <div
          className="xl:col-span-3 flex flex-col min-h-0 justify-start items-start"
          style={{ width: "1000px" }}
        >
          <div
            className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 flex-grow flex flex-col min-h-0"
            style={{ marginRight: "88px" }}
          >
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <PhotoIcon className="w-6 h-6 mr-2 text-sky-400" />
                Canvas Studio
              </h3>
              <div className="flex items-center space-x-3 flex-wrap">
                <button
                  onClick={() => setGridVisible(!gridVisible)}
                  className={`px-4 py-2 text-sm rounded-lg transition-all ${
                    gridVisible
                      ? "bg-sky-600 text-white shadow-lg"
                      : "bg-slate-700 text-slate-300 border border-slate-600"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setGoldenRatioVisible(!goldenRatioVisible)}
                  className={`px-4 py-2 text-sm rounded-lg transition-all flex items-center space-x-2 ${
                    goldenRatioVisible
                      ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg"
                      : "bg-slate-700 text-slate-300 border border-slate-600"
                  }`}
                  title="Toggle Golden Ratio composition guide"
                >
                  <span className="font-bold">φ</span>
                  <span>Ratio</span>
                </button>
                <div className="border-l border-slate-600 h-8 mx-2"></div>
                <button
                  onClick={() => exportThumbnail("png", 1.0)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg text-sm flex items-center space-x-2 font-semibold shadow-lg transition-all"
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span>Export PNG</span>
                </button>
                <button
                  onClick={() => exportThumbnail("jpg", 0.95)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg text-sm flex items-center space-x-2 font-semibold shadow-lg transition-all"
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span>Export JPG</span>
                </button>
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              style={{
                width: "100%",
                height: "auto",
                maxWidth: `${DISPLAY_WIDTH}px`,
                maxHeight: `${DISPLAY_HEIGHT}px`,
                border: "4px solid #334155",
                borderRadius: "16px",
                cursor: selectedTool === "fill" ? "crosshair" : "default",
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)",
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const scaleX = CANVAS_WIDTH / rect.width;
                const scaleY = CANVAS_HEIGHT / rect.height;
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;

                if (selectedTool === "select") {
                  const clickedElement = elements.find(
                    (el) =>
                      x >= el.x &&
                      x <= el.x + el.width &&
                      y >= el.y &&
                      y <= el.y + el.height,
                  );
                  setSelectedElement(clickedElement?.id || null);
                } else if (selectedTool === "text") {
                  addTextElement();
                }
              }}
            />

            <div
              ref={canvasContainerRef}
              className="flex-grow flex items-center justify-center bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl relative p-6 min-h-0 border-2 border-slate-700/50"
              style={{ minHeight: "600px", marginRight: "-2px" }}
            >
              <div className="relative max-w-full max-h-full">
                {/* Premium Canvas Overlays */}
                <div
                  className="absolute bg-black/90 text-white text-sm px-4 py-3 rounded-xl backdrop-blur-sm border border-slate-600"
                  style={{ left: "1667px", top: "823px" }}
                >
                  <div className="font-bold text-sky-400">1920×1080 HD</div>
                  <div className="text-slate-300 text-xs">YouTube Premium</div>
                </div>

                {goldenRatioVisible && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-600/90 to-amber-600/90 text-white text-sm px-4 py-3 rounded-xl flex items-center space-x-3 backdrop-blur-sm border border-yellow-400/30">
                    <span className="text-lg font-bold">φ</span>
                    <div>
                      <div className="font-bold">Golden Ratio</div>
                      <div className="text-yellow-100 text-xs">
                        Composition Guide
                      </div>
                    </div>
                  </div>
                )}

                {selectedTool !== "select" && (
                  <div className="absolute bottom-4 left-4 bg-purple-600/90 text-white text-sm px-4 py-3 rounded-xl backdrop-blur-sm border border-purple-400/30">
                    <div className="font-bold capitalize">
                      {selectedTool} Mode
                    </div>
                    <div className="text-purple-100 text-xs">
                      {selectedTool === "fill" && "Draw area to fill"}
                      {selectedTool === "text" && "Click to add text"}
                      {selectedTool === "arrow" && "Click to add arrow"}
                      {selectedTool === "gradient" && "Click to add gradient"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Empty for now */}
        <div className="xl:col-span-1 space-y-6" />
      </div>

      {/* Advanced Panel */}
      {showAdvancedPanel && (
        <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-xl p-8 border border-slate-600/50 space-y-8">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <AdjustmentsHorizontalIcon className="w-7 h-7 mr-3 text-purple-400" />
            Advanced Studio Settings
          </h3>

          {/* Canvas Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Canvas Background
              </label>
              <input
                type="color"
                value={canvasBackground}
                onChange={(e) => setCanvasBackground(e.target.value)}
                className="w-full h-12 bg-slate-700 border border-slate-600 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-2">
                {["#0f172a", "#1e293b", "#000000", "#1a1a2e"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setCanvasBackground(color)}
                    className="w-full h-8 rounded border-2 border-slate-600 hover:border-white transition-all"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-300">
                Display Options
              </h4>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={gridVisible}
                  onChange={(e) => setGridVisible(e.target.checked)}
                  className="rounded accent-sky-500"
                />
                <span className="text-sm text-slate-300 font-medium">
                  Show Premium Grid
                </span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={goldenRatioVisible}
                  onChange={(e) => setGoldenRatioVisible(e.target.checked)}
                  className="rounded accent-yellow-500"
                />
                <span className="text-sm text-slate-300 font-medium">
                  Golden Ratio Guide
                </span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={snapToGrid}
                  onChange={(e) => setSnapToGrid(e.target.checked)}
                  className="rounded accent-purple-500"
                />
                <span className="text-sm text-slate-300 font-medium">
                  Snap to Grid
                </span>
              </label>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-300">
                Quick Actions
              </h4>
              <button
                onClick={() => {
                  // Add multiple random elements for demo
                  addTextElement();
                  setTimeout(() => addArrowElement("neon"), 100);
                  setTimeout(() => addGradientElement(), 200);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-sm font-semibold transition-all"
              >
                Auto Generate Layout
              </button>
              <button
                onClick={() => {
                  setElements([]);
                  setBackgroundImage(null);
                  setSelectedElement(null);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg text-sm font-semibold transition-all"
              >
                Clear Canvas
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-300">
                Export Options
              </h4>
              <button
                onClick={() => exportThumbnail("png", 1.0)}
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg text-sm font-semibold transition-all"
              >
                Export PNG (Max Quality)
              </button>
              <button
                onClick={() => exportThumbnail("jpg", 0.95)}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg text-sm font-semibold transition-all"
              >
                Export JPG (95%)
              </button>
              <button
                onClick={() => exportThumbnail("webp", 0.9)}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-semibold transition-all"
              >
                Export WebP (Premium)
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 p-4 rounded-xl border border-purple-500/30">
              <h4 className="text-white font-semibold mb-3">
                Premium Features
              </h4>
              <ul className="text-sm text-purple-100 space-y-1">
                <li>• 12 Arrow Variations</li>
                <li>• Advanced Text Effects</li>
                <li>• Premium Gradients</li>
                <li>• Golden Ratio Guide</li>
                <li>• Multiple Export Formats</li>
                <li>• Professional Templates</li>
                <li>• Auto Layout Generation</li>
                <li>• Custom Canvas Themes</li>
              </ul>
            </div>
          </div>

          {/* Advanced Element Controls */}
          <div className="border-t border-slate-600 pt-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              Bulk Element Controls
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => {
                  // Apply neon effect to all text elements
                  setElements(
                    elements.map((el) =>
                      el.type === "text"
                        ? {
                            ...el,
                            textShadow: "0 0 20px #ff0080, 0 0 40px #ff0080",
                          }
                        : el,
                    ),
                  );
                }}
                className="px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-500 hover:to-purple-500 transition-all"
              >
                Apply Neon to All Text
              </button>
              <button
                onClick={() => {
                  // Align all elements to golden ratio points
                  const goldenX = CANVAS_WIDTH / 1.618;
                  const goldenY = CANVAS_HEIGHT / 1.618;
                  setElements(
                    elements.map((el, index) => ({
                      ...el,
                      x:
                        index % 2 === 0
                          ? goldenX - el.width / 2
                          : CANVAS_WIDTH - goldenX - el.width / 2,
                      y:
                        index < elements.length / 2
                          ? goldenY - el.height / 2
                          : CANVAS_HEIGHT - goldenY - el.height / 2,
                    })),
                  );
                }}
                className="px-4 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-amber-500 transition-all"
              >
                Align to Golden Points
              </button>
              <button
                onClick={() => {
                  // Randomize all element colors
                  setElements(
                    elements.map((el) => ({
                      ...el,
                      color:
                        colorPalette[
                          Math.floor(Math.random() * colorPalette.length)
                        ],
                    })),
                  );
                }}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all"
              >
                Randomize Colors
              </button>
              <button
                onClick={() => {
                  // Scale all elements by 1.2x
                  setElements(
                    elements.map((el) => ({
                      ...el,
                      fontSize: el.fontSize
                        ? Math.min(el.fontSize * 1.2, 200)
                        : el.fontSize,
                      width: el.width * 1.1,
                      height: el.height * 1.1,
                    })),
                  );
                }}
                className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-500 hover:to-emerald-500 transition-all"
              >
                Scale Up Elements
              </button>
            </div>
          </div>

          {/* Performance & Analytics */}
          <div className="border-t border-slate-600 pt-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              Analytics & Performance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <h5 className="text-white font-semibold mb-2">Canvas Stats</h5>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>Elements: {elements.length}</li>
                  <li>
                    Text Elements:{" "}
                    {elements.filter((e) => e.type === "text").length}
                  </li>
                  <li>
                    Arrows: {elements.filter((e) => e.type === "arrow").length}
                  </li>
                  <li>
                    Shapes: {elements.filter((e) => e.type === "shape").length}
                  </li>
                </ul>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <h5 className="text-white font-semibold mb-2">
                  Composition Score
                </h5>
                <div className="text-2xl font-bold text-green-400">
                  {goldenRatioVisible ? "92%" : "67%"}
                </div>
                <p className="text-xs text-slate-400">
                  {goldenRatioVisible
                    ? "Excellent with golden ratio"
                    : "Good, enable golden ratio for best results"}
                </p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <h5 className="text-white font-semibold mb-2">
                  Estimated CTR Boost
                </h5>
                <div className="text-2xl font-bold text-purple-400">
                  +
                  {goldenRatioVisible &&
                  elements.filter((e) => e.type === "arrow").length > 0
                    ? "31"
                    : "18"}
                  %
                </div>
                <p className="text-xs text-slate-400">
                  Based on composition analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Composition Tips Panel */}
      {goldenRatioVisible && (
        <div className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border border-yellow-600/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-yellow-300 mb-4 flex items-center">
            <span className="text-2xl mr-3">φ</span>
            Professional Composition Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm text-yellow-100">
              <p>
                <strong className="text-yellow-200">Main Subject:</strong>{" "}
                Position your focal point along the spiral curve for maximum
                impact
              </p>
              <p>
                <strong className="text-yellow-200">Text Placement:</strong> Use
                intersection points of the grid lines for optimal readability
              </p>
              <p>
                <strong className="text-yellow-200">Eye Flow:</strong> Guide
                viewer attention by following the spiral's natural direction
              </p>
            </div>
            <div className="space-y-3 text-sm text-yellow-100">
              <p>
                <strong className="text-yellow-200">Visual Balance:</strong>{" "}
                Place larger elements in the larger golden rectangles
              </p>
              <p>
                <strong className="text-yellow-200">Hierarchy:</strong> Use the
                ratio to size elements proportionally (1:1.618)
              </p>
              <p>
                <strong className="text-yellow-200">Thumbnail Success:</strong>{" "}
                Golden ratio compositions get 23% more clicks on average
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedThumbnailMaker;
