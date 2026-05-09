import type { ReactNode } from "react";

type BillSummaryProps = {
  children?: ReactNode;
};

export default function BillSummary({ children }: BillSummaryProps) {
  return <div>{children ?? "BillSummary"}</div>;
}
