import type { ReactNode } from "react";

type PageHeaderProps = {
  children?: ReactNode;
};

export default function PageHeader({ children }: PageHeaderProps) {
  return <div>{children ?? "PageHeader"}</div>;
}
