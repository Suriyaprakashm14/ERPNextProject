import type { ReactNode } from "react";

type ProductSearchProps = {
  children?: ReactNode;
};

export default function ProductSearch({ children }: ProductSearchProps) {
  return <div>{children ?? "ProductSearch"}</div>;
}
