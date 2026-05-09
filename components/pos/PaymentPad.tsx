import type { ReactNode } from "react";

type PaymentPadProps = {
  children?: ReactNode;
};

export default function PaymentPad({ children }: PaymentPadProps) {
  return <div>{children ?? "PaymentPad"}</div>;
}
