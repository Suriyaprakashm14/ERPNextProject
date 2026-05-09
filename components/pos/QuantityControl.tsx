import type { ReactNode } from "react";

type QuantityControlProps = {
  children?: ReactNode;
};

export default function QuantityControl({ children }: QuantityControlProps) {
  return <div>{children ?? "QuantityControl"}</div>;
}
