"use client";

import { useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Activity, DayPlan, Coordinates } from "@/lib/types";
import { MapProvider, getWatercolorTileUrl, MAP_ATTRIBUTION } from "./MapProvider";

// Dynamic imports for Leaflet components (no SSR)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const WatercolorMarker = dynamic(
  () => import("./WatercolorMarker").then((mod) => mod.WatercolorMarker),
  { ssr: false }
);

interface TripMapProps {
  dayPlan: DayPlan;
  centerCoordinates: Coordinates;
  selectedActivityId?: string | null;
  onActivityClick?: (activityId: string) => void;
  className?: string;
}

export function TripMap({
  dayPlan,
  centerCoordinates,
  selectedActivityId,
  onActivityClick,
  className,
}: TripMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Calculate route coordinates
  const routeCoordinates = useMemo(() => {
    return dayPlan.activities.map((activity) => [
      activity.coordinates.lat,
      activity.coordinates.lng,
    ] as [number, number]);
  }, [dayPlan.activities]);

  // Calculate bounds to fit all markers
  const bounds = useMemo(() => {
    if (dayPlan.activities.length === 0) return null;

    const lats = dayPlan.activities.map((a) => a.coordinates.lat);
    const lngs = dayPlan.activities.map((a) => a.coordinates.lng);

    return [
      [Math.min(...lats) - 0.01, Math.min(...lngs) - 0.01],
      [Math.max(...lats) + 0.01, Math.max(...lngs) + 0.01],
    ] as [[number, number], [number, number]];
  }, [dayPlan.activities]);

  // Pan to selected activity
  useEffect(() => {
    if (selectedActivityId && mapRef.current) {
      const activity = dayPlan.activities.find((a) => a.id === selectedActivityId);
      if (activity) {
        mapRef.current.flyTo(
          [activity.coordinates.lat, activity.coordinates.lng],
          15,
          { duration: 0.5 }
        );
      }
    }
  }, [selectedActivityId, dayPlan.activities]);

  // Fit bounds when day changes
  useEffect(() => {
    if (bounds && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds]);

  return (
    <MapProvider>
      <div className={cn("relative rounded-xl overflow-hidden", className)}>
        {/* Leaflet CSS is imported globally */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />

        <MapContainer
          center={[centerCoordinates.lat, centerCoordinates.lng]}
          zoom={13}
          className="w-full h-full min-h-[300px] md:min-h-[400px]"
          ref={mapRef}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          {/* Watercolor Tile Layer */}
          <TileLayer
            url={getWatercolorTileUrl()}
            attribution={MAP_ATTRIBUTION}
            maxZoom={18}
          />

          {/* Route Line */}
          {routeCoordinates.length > 1 && (
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color: "#FF6B6B",
                weight: 4,
                opacity: 0.8,
                dashArray: "10, 6",
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          )}

          {/* Activity Markers */}
          {dayPlan.activities.map((activity) => (
            <WatercolorMarker
              key={activity.id}
              activity={activity}
              isSelected={activity.id === selectedActivityId}
              onClick={() => onActivityClick?.(activity.id)}
            />
          ))}
        </MapContainer>

        {/* Decorative overlay gradient at edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to bottom, rgba(253, 246, 227, 0.3) 0%, transparent 10%),
              linear-gradient(to top, rgba(253, 246, 227, 0.3) 0%, transparent 10%),
              linear-gradient(to right, rgba(253, 246, 227, 0.3) 0%, transparent 5%),
              linear-gradient(to left, rgba(253, 246, 227, 0.3) 0%, transparent 5%)
            `,
          }}
        />
      </div>
    </MapProvider>
  );
}
