import type { ReactNode } from "react";

type WarehouseSelectorProps = {
  children?: ReactNode;
};

export default function WarehouseSelector({ children }: WarehouseSelectorProps) {
  return <div>{children ?? "WarehouseSelector"}</div>;
}
