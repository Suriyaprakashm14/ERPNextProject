import type { ReactNode } from "react";

type AppTableProps = {
  children?: ReactNode;
};

export default function AppTable({ children }: AppTableProps) {
  return <div>{children ?? "AppTable"}</div>;
}
