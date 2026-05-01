"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRPreviewProps {
  value: string;
  size?: number;
}

export default function QRPreview({ value, size = 200 }: QRPreviewProps) {
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
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-4 rounded-3xl shadow-xl">
        <canvas ref={canvasRef} />
      </div>
      <button 
        onClick={download}
        className="text-xs font-bold uppercase tracking-wider text-muted hover:text-primary transition-colors"
      >
        Download PNG
      </button>
    </div>
  );
}
