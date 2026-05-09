import type { ReactNode } from "react";

type PaymentModeSelectorProps = {
  children?: ReactNode;
};

export default function PaymentModeSelector({ children }: PaymentModeSelectorProps) {
  return <div>{children ?? "PaymentModeSelector"}</div>;
}
