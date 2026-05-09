import type { ReactNode } from "react";

type PosTopBarProps = {
  children?: ReactNode;
};

export default function PosTopBar({ children }: PosTopBarProps) {
  return <div>{children ?? "PosTopBar"}</div>;
}
