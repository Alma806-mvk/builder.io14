import React from "react";
import PremiumCanvasEnhancement from "./PremiumCanvasEnhancement";
import { CanvasItem, CanvasItemType } from "../../types";

interface CanvasWithPremiumFeaturesProps {
  // Props that would come from your existing canvas implementation
  canvasItems: CanvasItem[];
  selectedCanvasItemId: string | null;
  setSelectedCanvasItemId: React.Dispatch<React.SetStateAction<string | null>>;
  canvasOffset: { x: number; y: number };
  setCanvasOffset: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  onUpdateCanvasItem: (id: string, updates: Partial<CanvasItem>) => void;
  onAddCanvasItem: (type: CanvasItemType, props?: Partial<CanvasItem>) => void;
  onDeleteCanvasItem: (id: string) => void;
  children: React.ReactNode; // Your existing canvas content
}

const CanvasWithPremiumFeatures: React.FC<CanvasWithPremiumFeaturesProps> = ({
  canvasItems,
  selectedCanvasItemId,
  setSelectedCanvasItemId,
  canvasOffset,
  setCanvasOffset,
  zoomLevel,
  setZoomLevel,
  onUpdateCanvasItem,
  onAddCanvasItem,
  onDeleteCanvasItem,
  children,
}) => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Your existing canvas implementation */}
      {children}

      {/* Premium enhancement overlay */}
      <PremiumCanvasEnhancement
        canvasItems={canvasItems}
        selectedCanvasItemId={selectedCanvasItemId}
        setSelectedCanvasItemId={setSelectedCanvasItemId}
        canvasOffset={canvasOffset}
        setCanvasOffset={setCanvasOffset}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        onUpdateCanvasItem={onUpdateCanvasItem}
        onAddCanvasItem={onAddCanvasItem}
        onDeleteCanvasItem={onDeleteCanvasItem}
      />
    </div>
  );
};

export default CanvasWithPremiumFeatures;
