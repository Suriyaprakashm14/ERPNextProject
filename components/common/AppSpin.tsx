import type { ReactNode } from "react";

type AppSpinProps = {
  children?: ReactNode;
};

export default function AppSpin({ children }: AppSpinProps) {
  return <div>{children ?? "AppSpin"}</div>;
}
