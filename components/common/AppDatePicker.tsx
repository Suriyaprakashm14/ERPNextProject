import type { ReactNode } from "react";

type AppDatePickerProps = {
  children?: ReactNode;
};

export default function AppDatePicker({ children }: AppDatePickerProps) {
  return <div>{children ?? "AppDatePicker"}</div>;
}
