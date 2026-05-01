"use client";

import { PLATFORMS } from "@/lib/platforms";

interface PlatformIconProps {
  id: string;
  size?: number;
  className?: string;
}

export default function PlatformIcon({ id, size = 20, className }: PlatformIconProps) {
  const platform = PLATFORMS.find((p) => p.id === id);
  if (!platform) return null;

  if (platform.svg) {
    return (
      <div 
        className={className}
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: platform.svg }}
      />
    );
  }

  if (!platform.icon) return null;

  return (
    <img 
      src={`https://cdn.simpleicons.org/${platform.icon}/${platform.color.replace('#', '')}`} 
      alt={platform.name}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
