import type { ReactNode } from "react";

type AppTagProps = {
  children?: ReactNode;
};

export default function AppTag({ children }: AppTagProps) {
  return <div>{children ?? "AppTag"}</div>;
}
