import type { ReactNode } from "react";

type StatusBadgeProps = {
  children?: ReactNode;
};

export default function StatusBadge({ children }: StatusBadgeProps) {
  return <div>{children ?? "StatusBadge"}</div>;
}
