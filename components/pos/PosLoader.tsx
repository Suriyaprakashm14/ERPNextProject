import type { ReactNode } from "react";

type PosLoaderProps = {
  children?: ReactNode;
};

export default function PosLoader({ children }: PosLoaderProps) {
  return <div>{children ?? "PosLoader"}</div>;
}
