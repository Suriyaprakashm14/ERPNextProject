import type { ReactNode } from "react";

type AppFormProps = {
  children?: ReactNode;
};

export default function AppForm({ children }: AppFormProps) {
  return <div>{children ?? "AppForm"}</div>;
}
