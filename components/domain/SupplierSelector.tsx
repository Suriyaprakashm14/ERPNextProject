import type { ReactNode } from "react";

type SupplierSelectorProps = {
  children?: ReactNode;
};

export default function SupplierSelector({ children }: SupplierSelectorProps) {
  return <div>{children ?? "SupplierSelector"}</div>;
}
