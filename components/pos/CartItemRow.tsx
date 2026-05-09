import type { ReactNode } from "react";

type CartItemRowProps = {
  children?: ReactNode;
};

export default function CartItemRow({ children }: CartItemRowProps) {
  return <div>{children ?? "CartItemRow"}</div>;
}
