import type { ReactNode } from "react";

type AppEmptyProps = {
  children?: ReactNode;
};

export default function AppEmpty({ children }: AppEmptyProps) {
  return <div>{children ?? "AppEmpty"}</div>;
}
