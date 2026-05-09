"use client";

import type { PropsWithChildren } from "react";

import { App, ConfigProvider } from "antd";

import antdTheme from "@/config/antd-theme";

export default function AntdProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      theme={antdTheme}
      componentSize="large"
      input={{ autoComplete: "off" }}
      form={{ requiredMark: false }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
