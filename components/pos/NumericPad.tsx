import type { ReactNode } from "react";

type NumericPadProps = {
  children?: ReactNode;
};

export default function NumericPad({ children }: NumericPadProps) {
  return <div>{children ?? "NumericPad"}</div>;
}
