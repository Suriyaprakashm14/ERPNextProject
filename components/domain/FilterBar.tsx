import type { ReactNode } from "react";

type FilterBarProps = {
  children?: ReactNode;
};

export default function FilterBar({ children }: FilterBarProps) {
  return <div>{children ?? "FilterBar"}</div>;
}
