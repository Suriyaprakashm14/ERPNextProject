import type { ReactNode } from "react";

type ItemSelectorProps = {
  children?: ReactNode;
};

export default function ItemSelector({ children }: ItemSelectorProps) {
  return <div>{children ?? "ItemSelector"}</div>;
}
