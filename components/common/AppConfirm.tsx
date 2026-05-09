import type { ReactNode } from "react";

type AppConfirmProps = {
  children?: ReactNode;
};

export default function AppConfirm({ children }: AppConfirmProps) {
  return <div>{children ?? "AppConfirm"}</div>;
}
