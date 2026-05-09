import type { ReactNode } from "react";

type CustomerSelectorProps = {
  children?: ReactNode;
};

export default function CustomerSelector({ children }: CustomerSelectorProps) {
  return <div>{children ?? "CustomerSelector"}</div>;
}
