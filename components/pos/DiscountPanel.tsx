import type { ReactNode } from "react";

type DiscountPanelProps = {
  children?: ReactNode;
};

export default function DiscountPanel({ children }: DiscountPanelProps) {
  return <div>{children ?? "DiscountPanel"}</div>;
}
