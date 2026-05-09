import type { ReactNode } from "react";

type PaymentMethodTabsProps = {
  children?: ReactNode;
};

export default function PaymentMethodTabs({ children }: PaymentMethodTabsProps) {
  return <div>{children ?? "PaymentMethodTabs"}</div>;
}
