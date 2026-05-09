"use client";

import { Tag } from "antd";

export default function BuyingStatusBadge({ status }: { status?: string }) {
  const label = typeof status === "string" && status.trim() ? status : "—";
  const normalized = label.toLowerCase();

  let color: string = "default";
  if (normalized.includes("draft") || normalized.includes("pending")) {
    color = "blue";
  }
  if (normalized.includes("submit") || normalized.includes("ordering")) {
    color = "cyan";
  }
  if (
    normalized.includes("ordered") ||
    normalized.includes("received") ||
    normalized.includes("paid") ||
    normalized.includes("complete") ||
    normalized.includes("to receive") ||
    normalized.includes("to bill")
  ) {
    color = "green";
  }
  if (normalized.includes("cancel") || normalized.includes("stopped") || normalized.includes("closed")) {
    color = "red";
  }

  return <Tag color={color}>{label}</Tag>;
}
