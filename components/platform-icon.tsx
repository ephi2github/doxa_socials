"use client";

import { useState } from "react";
import { PLATFORMS } from "@/lib/platforms";

interface PlatformIconProps {
  id: string;
  size?: number;
  className?: string;
}

export default function PlatformIcon({ id, size = 20, className }: PlatformIconProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const platform = PLATFORMS.find((p) => p.id === id);
  if (!platform) return null;

  if (platform.svg) {
    return (
      <div 
        className={className}
        style={{ width: size, height: size, color: `#${platform.color.replace('#', '')}` }}
        dangerouslySetInnerHTML={{ __html: platform.svg }}
      />
    );
  }

  if (!platform.icon || imageFailed) {
    const fallback = platform.name
      .replace(/[^A-Za-z0-9]/g, "")
      .slice(0, 2)
      .toUpperCase() || "?";

    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          color: `#${platform.color.replace('#', '')}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: Math.max(10, Math.round(size * 0.52)),
          fontWeight: 800,
          lineHeight: 1,
        }}
        aria-label={platform.name}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img 
      src={`https://cdn.simpleicons.org/${platform.icon}/${platform.color.replace('#', '')}`} 
      alt={platform.name}
      className={className}
      style={{ width: size, height: size }}
      onError={() => setImageFailed(true)}
    />
  );
}
