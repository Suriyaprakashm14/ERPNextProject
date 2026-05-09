import type { ReactNode } from "react";

type PosShellProps = {
  children?: ReactNode;
};

export default function PosShell({ children }: PosShellProps) {
  return <div>{children ?? "PosShell"}</div>;
}
