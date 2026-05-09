import type { ReactNode } from "react";

type BarcodeInputProps = {
  children?: ReactNode;
};

export default function BarcodeInput({ children }: BarcodeInputProps) {
  return <div>{children ?? "BarcodeInput"}</div>;
}
