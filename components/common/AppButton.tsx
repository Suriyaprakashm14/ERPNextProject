import type { ReactNode } from "react";

type AppButtonProps = {
  children?: ReactNode;
};

export default function AppButton({ children }: AppButtonProps) {
  return <div>{children ?? "AppButton"}</div>;
}
