import type { ReactNode } from "react";

type AppDrawerProps = {
  children?: ReactNode;
};

export default function AppDrawer({ children }: AppDrawerProps) {
  return <div>{children ?? "AppDrawer"}</div>;
}
