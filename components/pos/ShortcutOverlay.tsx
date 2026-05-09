import type { ReactNode } from "react";

type ShortcutOverlayProps = {
  children?: ReactNode;
};

export default function ShortcutOverlay({ children }: ShortcutOverlayProps) {
  return <div>{children ?? "ShortcutOverlay"}</div>;
}
