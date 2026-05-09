import type { ReactNode } from "react";

type BreadcrumbProps = {
  children?: ReactNode;
};

export default function Breadcrumb({ children }: BreadcrumbProps) {
  return <div>{children ?? "Breadcrumb"}</div>;
}
