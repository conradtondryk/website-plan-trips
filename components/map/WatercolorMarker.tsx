"use client";

import { DivIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Activity, ACTIVITY_ICONS } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface WatercolorMarkerProps {
  activity: Activity;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * Create a custom watercolor-styled marker icon
 */
function createMarkerIcon(
  type: Activity["type"],
  isSelected: boolean,
  isHiddenGem: boolean
): DivIcon {
  const icon = ACTIVITY_ICONS[type];
  const size = isSelected ? 48 : 40;
  const bgColor = isSelected ? "#FF6B6B" : "#FDF6E3";
  const borderColor = isSelected ? "#FFA07A" : "#FF6B6B";

  const html = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${bgColor};
      border: 3px solid ${borderColor};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 15px -3px rgba(255, 107, 107, 0.4);
      transition: all 0.2s ease;
    ">
      <span style="
        transform: rotate(45deg);
        font-size: ${isSelected ? 20 : 16}px;
      ">${icon}</span>
      ${
        isHiddenGem
          ? `<span style="
              position: absolute;
              top: -4px;
              right: -4px;
              transform: rotate(45deg);
              font-size: 14px;
            ">⭐</span>`
          : ""
      }
    </div>
  `;

  return new DivIcon({
    html,
    className: "watercolor-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

export function WatercolorMarker({
  activity,
  isSelected = false,
  onClick,
}: WatercolorMarkerProps) {
  const icon = createMarkerIcon(activity.type, isSelected, activity.isHiddenGem);

  return (
    <Marker
      position={[activity.coordinates.lat, activity.coordinates.lng]}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup className="watercolor-popup">
        <div className="p-2 min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{ACTIVITY_ICONS[activity.type]}</span>
            <span className="font-display text-lg text-ink-dark">
              {activity.name}
            </span>
            {activity.isHiddenGem && (
              <span className="text-watercolor-gold" title="Hidden Gem">
                ⭐
              </span>
            )}
          </div>
          <p className="text-sm text-ink-medium mb-2">{activity.description}</p>
          <div className="flex items-center gap-3 text-xs text-ink-light">
            <span>{formatTime(activity.time)}</span>
            <span>{activity.priceRange}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
