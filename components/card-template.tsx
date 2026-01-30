"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";

interface CardTemplateProps {
  userName: string;
  onTextureReady: (dataUrl: string) => void;
}

export interface CardTemplateRef {
  captureTexture: () => Promise<void>;
}

const CardTemplate = forwardRef<CardTemplateRef, CardTemplateProps>(
  ({ userName, onTextureReady }, ref) => {
    const templateRef = useRef<HTMLDivElement>(null);

    const captureTexture = async () => {
      if (!templateRef.current) return;

      const canvas = await html2canvas(templateRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const dataUrl = canvas.toDataURL("image/png");
      onTextureReady(dataUrl);
    };

    useImperativeHandle(ref, () => ({
      captureTexture,
    }));

    return (
      <div
        ref={templateRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          pointerEvents: "none",
          width: "512px",
          height: "512px",
        }}
      >
        {/* Card design - black square with centered icon and name at bottom */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "32px",
            backgroundColor: "#000000",
            fontFamily: '"Geist Mono", monospace',
          }}
        >
          {/* Top spacer */}
          <div />

          {/* Center - V0 Icon */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.svg"
              alt="V0 Icon"
              style={{ width: "128px", height: "128px" }}
              crossOrigin="anonymous"
            />
          </div>

          {/* Bottom - User Name */}
          <div style={{ width: "100%", textAlign: "center" }}>
            <span
              style={{
                color: "#ffffff",
                fontSize: "24px",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: '"Geist Mono", monospace',
              }}
            >
              {userName || "YOUR NAME"}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

CardTemplate.displayName = "CardTemplate";

export default CardTemplate;
