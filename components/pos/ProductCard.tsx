import type { ReactNode } from "react";

type ProductCardProps = {
  children?: ReactNode;
};

export default function ProductCard({ children }: ProductCardProps) {
  return <div>{children ?? "ProductCard"}</div>;
}
