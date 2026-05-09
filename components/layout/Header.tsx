import type { ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return <div>{children ?? "Header"}</div>;
}
