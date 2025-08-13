import React from "react";

export function BookingStatusText({ status = "" }) {
  const normalized = status.trim().toLowerCase();

  const colorMap = {
    hold: "#ffc107",
    "in progress": "#17a2b8",
    completed: "#28a745",
    cancelled: "#dc3545",
    canceled: "#dc3545",
    default: "#6c757d"
  };

  const color = colorMap[normalized] || colorMap.default;

  return (
    <strong style={{ color }}>
      {status || "N/A"}
    </strong>
  );
}
