/**
 * Maps a test status to display metadata (MUI color, chip label, row tint).
 * Centralized so the table, chips, and charts stay visually consistent.
 */
export const STATUS_META = {
  high: { label: "High", color: "error", rowBg: "rgba(198, 40, 40, 0.08)" },
  low: { label: "Low", color: "info", rowBg: "rgba(2, 119, 189, 0.08)" },
  normal: { label: "Normal", color: "success", rowBg: "transparent" },
  unknown: { label: "—", color: "default", rowBg: "transparent" },
};

export const getStatusMeta = (status) => STATUS_META[status] || STATUS_META.unknown;

export const isAbnormal = (status) => status === "high" || status === "low";
