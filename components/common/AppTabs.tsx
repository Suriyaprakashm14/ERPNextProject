import type { ReactNode } from "react";

type AppTabsProps = {
  children?: ReactNode;
};

export default function AppTabs({ children }: AppTabsProps) {
  return <div>{children ?? "AppTabs"}</div>;
}
