import type { ReactNode } from "react";

type ProductGridProps = {
  children?: ReactNode;
};

export default function ProductGrid({ children }: ProductGridProps) {
  return <div>{children ?? "ProductGrid"}</div>;
}
