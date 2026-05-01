"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRPreviewProps {
  value: string;
  size?: number;
  showDownload?: boolean;
}

export default function QRPreview({ value, size = 200, showDownload = true }: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 0,
        color: {
          dark: "#19003a",
          light: "#ffffff",
        },
      });
    }
  }, [value, size]);

  const download = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "doxa-qr.png";
    link.href = url;
    link.click();
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full max-w-[184px] rounded-[28px] bg-white p-3 shadow-xl sm:max-w-[232px] sm:rounded-3xl sm:p-4">
        <canvas ref={canvasRef} className="h-auto w-full max-w-full" />
      </div>
      {showDownload ? (
        <button 
          onClick={download}
          className="text-xs font-bold uppercase tracking-wider text-muted hover:text-primary transition-colors"
        >
          Download PNG
        </button>
      ) : null}
    </div>
  );
}
