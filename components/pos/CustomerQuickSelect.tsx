import type { ReactNode } from "react";

type CustomerQuickSelectProps = {
  children?: ReactNode;
};

export default function CustomerQuickSelect({ children }: CustomerQuickSelectProps) {
  return <div>{children ?? "CustomerQuickSelect"}</div>;
}
