import type { ReactNode } from "react";

type MoneyTextProps = {
  children?: ReactNode;
};

export default function MoneyText({ children }: MoneyTextProps) {
  return <div>{children ?? "MoneyText"}</div>;
}
