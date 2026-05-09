import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "antd/dist/reset.css";
import "./globals.css";

import AntdProvider from "@/components/providers/AntdProvider";
import { StoreProvider } from "@/store/provider";

export const metadata: Metadata = {
  title: "Textile ERP Frontend",
  description: "ERPNext textile business frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <AntdRegistry>
            <AntdProvider>{children}</AntdProvider>
          </AntdRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}
