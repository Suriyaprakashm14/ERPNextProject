import type { ReactNode } from "react";

type AppInputProps = {
  children?: ReactNode;
};

export default function AppInput({ children }: AppInputProps) {
  return <div>{children ?? "AppInput"}</div>;
}
