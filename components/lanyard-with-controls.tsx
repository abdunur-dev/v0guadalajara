"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Lanyard from "@/components/ui/lanyard";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CardTemplate, { type CardTemplateRef } from "@/components/card-template";
import { Download } from "lucide-react";

const MAX_CHARACTERS = 20;

interface LanyardWithControlsProps {
  position?: [number, number, number];
  containerClassName?: string;
  defaultName?: string;
}

export default function LanyardWithControls({
  position = [0, 0, 20],
  containerClassName,
  defaultName = "",
}: LanyardWithControlsProps) {
  const [inputValue, setInputValue] = useState(defaultName);
  const [appliedName, setAppliedName] = useState(defaultName);
  const [cardTextureUrl, setCardTextureUrl] = useState<string | undefined>(undefined);
  const [textureKey, setTextureKey] = useState(0);
  const cardTemplateRef = useRef<CardTemplateRef>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exportBgImage, setExportBgImage] = useState<HTMLImageElement | null>(null);

  // Preload background image for export
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setExportBgImage(img);
    img.src = "/export-bg.webp";
  }, []);

  const characterCount = inputValue.length;
  const isAtLimit = characterCount >= MAX_CHARACTERS;
  const isNearLimit = characterCount >= MAX_CHARACTERS - 5;
  const hasChanges = inputValue !== appliedName;

  const handleTextureReady = useCallback((dataUrl: string) => {
    setCardTextureUrl(dataUrl);
    setTextureKey((prev) => prev + 1);
  }, []);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Crop settings - adjust these to change the export area
    const cropScale = 0.6; // Crop to 60% of the canvas (centered) - closer view
    const cropWidth = canvas.width * cropScale;
    const cropHeight = canvas.height * cropScale;
    const cropX = (canvas.width - cropWidth) / 2;
    const cropY = (canvas.height - cropHeight) / 2;

    // Output resolution multiplier for higher quality export
    const outputScale = 2; // 2x resolution for sharper image
    const outputWidth = cropWidth * outputScale;
    const outputHeight = cropHeight * outputScale;

    // Create a new canvas for the final image
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = outputWidth;
    exportCanvas.height = outputHeight;
    const ctx = exportCanvas.getContext("2d");
    
    if (!ctx) return;

    // Enable high-quality image scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw background image first (cover the entire canvas)
    if (exportBgImage) {
      const bgAspect = exportBgImage.width / exportBgImage.height;
      const canvasAspect = outputWidth / outputHeight;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (bgAspect > canvasAspect) {
        // Background is wider - fit height, crop width
        drawHeight = outputHeight;
        drawWidth = outputHeight * bgAspect;
        drawX = (outputWidth - drawWidth) / 2;
        drawY = 0;
      } else {
        // Background is taller - fit width, crop height
        drawWidth = outputWidth;
        drawHeight = outputWidth / bgAspect;
        drawX = 0;
        drawY = (outputHeight - drawHeight) / 2;
      }
      
      ctx.drawImage(exportBgImage, drawX, drawY, drawWidth, drawHeight);
    }

    // Draw the cropped lanyard on top (scaled up)
    ctx.drawImage(
      canvas,
      cropX, cropY, cropWidth, cropHeight, // Source rectangle
      0, 0, outputWidth, outputHeight // Destination rectangle (scaled up)
    );

    const dataUrl = exportCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `lanyard-${appliedName || "card"}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleApplyName = async () => {
    setAppliedName(inputValue);
    // Capture the card template as a texture
    await cardTemplateRef.current?.captureTexture();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARACTERS) {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && hasChanges) {
      handleApplyName();
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hidden card template for texture generation */}
      <CardTemplate
        ref={cardTemplateRef}
        userName={inputValue}
        onTextureReady={handleTextureReady}
      />
      <Lanyard
        key={textureKey}
        position={position}
        containerClassName={containerClassName}
        cardTextureUrl={cardTextureUrl}
        canvasRef={canvasRef}
      />
      <div className="px-6 pb-8 lg:absolute lg:bottom-8 lg:right-6 lg:w-auto lg:px-0">
        <div className="mx-auto max-w-md lg:mx-0 lg:ml-auto">
          <label
            htmlFor="userName"
            className="mb-2 block text-sm font-medium text-muted-foreground"
          >
            Personalize your card
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="userName"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter your name"
                maxLength={MAX_CHARACTERS}
                className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 pr-16 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              />
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs transition-colors ${
                  isAtLimit
                    ? "text-destructive"
                    : isNearLimit
                      ? "text-amber-500"
                      : "text-muted-foreground"
                }`}
              >
                {characterCount}/{MAX_CHARACTERS}
              </span>
            </div>
            <Button
              onClick={handleApplyName}
              disabled={!hasChanges}
              size="default"
              className="shrink-0"
            >
              Apply
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export as PNG</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {isAtLimit && (
            <p className="mt-1.5 text-xs text-destructive">
              Character limit reached
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
