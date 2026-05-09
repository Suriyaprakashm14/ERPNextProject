import type { ReactNode } from "react";

type CartPanelProps = {
  children?: ReactNode;
};

export default function CartPanel({ children }: CartPanelProps) {
  return <div>{children ?? "CartPanel"}</div>;
}
