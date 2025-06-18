import React, { useState, useRef, useEffect } from "react";
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
} from "./IconComponents";

interface ThumbnailElement {
  id: string;
  type: "text" | "image" | "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  imageUrl?: string;
  rotation?: number;
}

interface ThumbnailMakerProps {
  onGenerateWithAI?: (prompt: string) => void;
  isLoading?: boolean;
  generatedBackground?: string | null;
  onBackgroundGenerated?: (background: string | null) => void;
}

const ThumbnailMaker: React.FC<ThumbnailMakerProps> = ({
  onGenerateWithAI,
  isLoading = false,
  generatedBackground,
  onBackgroundGenerated,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<ThumbnailElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // YouTube thumbnail dimensions (16:9 aspect ratio)
  const CANVAS_WIDTH = 1280;
  const CANVAS_HEIGHT = 720;
  const DISPLAY_WIDTH = 640;
  const DISPLAY_HEIGHT = 360;

  // Thumbnail templates
  const templates = [
    {
      id: "gaming",
      name: "Gaming",
      elements: [
        {
          id: "title",
          type: "text" as const,
          x: 50,
          y: 100,
          width: 600,
          height: 100,
          content: "EPIC GAMEPLAY!",
          fontSize: 72,
          fontWeight: "900",
          color: "#ffffff",
        },
        {
          id: "subtitle",
          type: "text" as const,
          x: 50,
          y: 220,
          width: 400,
          height: 50,
          content: "You won't believe what happens...",
          fontSize: 32,
          fontWeight: "600",
          color: "#fbbf24",
        },
      ],
    },
    {
      id: "tutorial",
      name: "Tutorial",
      elements: [
        {
          id: "title",
          type: "text" as const,
          x: 50,
          y: 150,
          width: 700,
          height: 80,
          content: "How to Master This in 10 Minutes",
          fontSize: 56,
          fontWeight: "700",
          color: "#ffffff",
        },
        {
          id: "step",
          type: "text" as const,
          x: 50,
          y: 250,
          width: 200,
          height: 60,
          content: "STEP BY STEP",
          fontSize: 28,
          fontWeight: "600",
          color: "#10b981",
        },
      ],
    },
  ];

  const addTextElement = () => {
    const newElement: ThumbnailElement = {
      id: `text-${Date.now()}`,
      type: "text",
      x: 100,
      y: 100,
      width: 300,
      height: 60,
      content: "Your Text Here",
      fontSize: 48,
      fontWeight: "700",
      color: "#ffffff",
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setElements(template.elements);
      setSelectedElement(null);
    }
  };

  const generateBackground = () => {
    if (onGenerateWithAI && aiPrompt.trim()) {
      onGenerateWithAI(
        `Create a YouTube thumbnail background: ${aiPrompt}. High quality, vibrant, attention-grabbing, 16:9 aspect ratio, professional YouTube thumbnail style`,
      );
    }
  };

  const updateElement = (id: string, updates: Partial<ThumbnailElement>) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    );
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    setSelectedElement(null);
  };

  const exportThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create download link
    const link = document.createElement("a");
    link.download = `youtube-thumbnail-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = backgroundImage ? "transparent" : "#1e293b";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background image if exists
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawElements();
      };
      img.src = backgroundImage;
    } else {
      drawElements();
    }

    function drawElements() {
      // Draw all elements
      elements.forEach((element) => {
        if (element.type === "text" && element.content) {
          ctx.font = `${element.fontWeight || "700"} ${element.fontSize || 48}px 'Inter', sans-serif`;
          ctx.fillStyle = element.color || "#ffffff";
          ctx.textAlign = "left";
          ctx.textBaseline = "top";

          // Add text stroke for better visibility
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 3;
          ctx.strokeText(element.content, element.x, element.y);
          ctx.fillText(element.content, element.x, element.y);
        }
      });

      // Draw selection indicator
      if (selectedElement) {
        const element = elements.find((el) => el.id === selectedElement);
        if (element) {
          ctx.strokeStyle = "#06b6d4";
          ctx.lineWidth = 3;
          ctx.setLineDash([10, 5]);
          ctx.strokeRect(
            element.x - 5,
            element.y - 5,
            element.width + 10,
            element.height + 10,
          );
          ctx.setLineDash([]);
        }
      }
    }
  }, [elements, selectedElement, backgroundImage]);

  // Handle generated background from AI
  useEffect(() => {
    if (generatedBackground) {
      setBackgroundImage(generatedBackground);
    }
  }, [generatedBackground]);

  const selectedEl = selectedElement
    ? elements.find((el) => el.id === selectedElement)
    : null;

  return (
    <div className="flex-grow bg-slate-800/70 backdrop-blur-sm p-6 rounded-xl shadow-2xl flex flex-col space-y-6">
      <h2 className="text-2xl font-semibold text-sky-400 mb-1 flex items-center">
        <PhotoIcon className="w-7 h-7 mr-3 text-sky-400" />
        YouTube Thumbnail Maker
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        {/* Left Panel - Tools & Templates */}
        <div className="space-y-6">
          {/* Templates */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Quick Templates
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => loadTemplate(template.id)}
                  className="p-3 bg-slate-600 hover:bg-slate-500 rounded-lg text-left text-white text-sm transition-colors"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* AI Background Generator */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2" />
              AI Background
            </h3>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe your thumbnail background (e.g., 'Epic space battle with explosions')"
              className="w-full p-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 text-sm mb-3"
              rows={3}
            />
            <button
              onClick={generateBackground}
              disabled={isLoading || !aiPrompt.trim()}
              className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500 hover:from-emerald-600 hover:via-sky-600 hover:to-purple-600 text-white font-semibold rounded-lg disabled:opacity-60 flex items-center justify-center space-x-2"
            >
              <WandIcon className="h-4 w-4" />
              <span>{isLoading ? "Generating..." : "Generate Background"}</span>
            </button>
          </div>

          {/* Tools */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">
              Add Elements
            </h3>
            <div className="space-y-2">
              <button
                onClick={addTextElement}
                className="w-full p-3 bg-sky-600 hover:bg-sky-500 rounded-lg text-white text-sm flex items-center justify-center space-x-2"
              >
                <TypeToolIcon className="h-4 w-4" />
                <span>Add Text</span>
              </button>
            </div>
          </div>

          {/* Element Properties */}
          {selectedEl && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">
                  Edit Element
                </h3>
                <button
                  onClick={() => deleteElement(selectedEl.id)}
                  className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              {selectedEl.type === "text" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Text
                    </label>
                    <input
                      type="text"
                      value={selectedEl.content || ""}
                      onChange={(e) =>
                        updateElement(selectedEl.id, {
                          content: e.target.value,
                        })
                      }
                      className="w-full p-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Font Size
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="120"
                      value={selectedEl.fontSize || 48}
                      onChange={(e) =>
                        updateElement(selectedEl.id, {
                          fontSize: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-slate-400">
                      {selectedEl.fontSize || 48}px
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Color
                    </label>
                    <input
                      type="color"
                      value={selectedEl.color || "#ffffff"}
                      onChange={(e) =>
                        updateElement(selectedEl.id, { color: e.target.value })
                      }
                      className="w-full h-10 bg-slate-600 border border-slate-500 rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center Panel - Canvas */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-slate-700/50 rounded-lg p-4 flex-grow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Thumbnail Preview
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={exportThumbnail}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm flex items-center space-x-2"
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="flex-grow flex items-center justify-center bg-slate-800 rounded-lg">
              <div
                className="relative"
                style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT }}
              >
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  style={{
                    width: DISPLAY_WIDTH,
                    height: DISPLAY_HEIGHT,
                    border: "2px solid #475569",
                    borderRadius: "8px",
                    cursor: "crosshair",
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x =
                      ((e.clientX - rect.left) / DISPLAY_WIDTH) * CANVAS_WIDTH;
                    const y =
                      ((e.clientY - rect.top) / DISPLAY_HEIGHT) * CANVAS_HEIGHT;

                    // Find clicked element
                    const clickedElement = elements.find(
                      (el) =>
                        x >= el.x &&
                        x <= el.x + el.width &&
                        y >= el.y &&
                        y <= el.y + el.height,
                    );

                    setSelectedElement(clickedElement?.id || null);
                  }}
                />

                {/* Overlay info */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  1280x720 • YouTube Thumbnail
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailMaker;
