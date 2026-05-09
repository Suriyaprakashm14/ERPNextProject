import type { ReactNode } from "react";

type AppModalProps = {
  children?: ReactNode;
};

export default function AppModal({ children }: AppModalProps) {
  return <div>{children ?? "AppModal"}</div>;
}
