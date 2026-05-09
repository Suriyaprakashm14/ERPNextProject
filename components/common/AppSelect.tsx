import type { ReactNode } from "react";

type AppSelectProps = {
  children?: ReactNode;
};

export default function AppSelect({ children }: AppSelectProps) {
  return <div>{children ?? "AppSelect"}</div>;
}
