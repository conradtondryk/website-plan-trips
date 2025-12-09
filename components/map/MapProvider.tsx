"use client";

import { useEffect, useState, ReactNode } from "react";

interface MapProviderProps {
  children: ReactNode;
}

/**
 * MapProvider component that handles dynamic loading of Leaflet
 * This abstraction allows for easy hotswapping of map implementations
 *
 * See possiblechanges.md for alternative map providers
 */
export function MapProvider({ children }: MapProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-paper-cream animate-pulse rounded-xl flex items-center justify-center">
        <span className="text-ink-light">Loading map...</span>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Get the Stadia Maps Stamen Watercolor tile URL
 * Note: Requires STADIA_MAPS_API_KEY for production
 */
export function getWatercolorTileUrl(): string {
  const apiKey = process.env.NEXT_PUBLIC_STADIA_MAPS_API_KEY;

  if (apiKey) {
    return `https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg?api_key=${apiKey}`;
  }

  // Fallback for development (limited usage)
  return "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg";
}

/**
 * Map tile attribution (required by Stadia Maps/Stamen)
 */
export const MAP_ATTRIBUTION = '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>';
