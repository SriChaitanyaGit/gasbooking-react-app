import React from "react";

export function PaymentStatusText({ status = "" }) {
  const normalized = status.trim().toLowerCase();

  const colorMap = {
    pending: "#ffc107",       // yellow
    "in progress": "#007bff", // blue
    completed: "#28a745",     // green
    failed: "#dc3545",        // red
    default: "#6c757d"        // gray
  };

  const color = colorMap[normalized] || colorMap.default;

  return (
    <strong style={{ color }}>
      {status || "N/A"}
    </strong>
  );
}
