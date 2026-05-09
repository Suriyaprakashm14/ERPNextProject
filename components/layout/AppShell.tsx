"use client";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Card, Drawer, Flex, Grid, Layout, Tag, Typography } from "antd";
import type { ReactNode } from "react";
import { useState } from "react";

import Sidebar from "./Sidebar";
import SignOutButton from "@/components/auth/SignOutButton";

type AppShellProps = {
  children: ReactNode;
  user: {
    fullName: string;
    email: string;
  };
};

export default function AppShell({ children, user }: AppShellProps) {
  const screens = Grid.useBreakpoint();
  const isDesktop = Boolean(screens.lg);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh", background: "#f6efe8" }}>
      {isDesktop ? (
        <Layout.Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={260}
          collapsedWidth={88}
          style={{
            borderInlineEnd: "1px solid rgba(255, 255, 255, 0.08)",
            overflow: "hidden",
          }}
        >
          <Sidebar collapsed={collapsed} />
        </Layout.Sider>
      ) : (
        <Drawer
          open={mobileOpen}
          placement="left"
          size="default"
          title={null}
          closable={false}
          styles={{ body: { padding: 0 } }}
          onClose={() => {
            setMobileOpen(false);
          }}
        >
          <Sidebar
            onNavigate={() => {
              setMobileOpen(false);
            }}
          />
        </Drawer>
      )}

      <Layout
        style={{
          background:
            "radial-gradient(circle at top right, rgba(222, 179, 126, 0.18), transparent 28%), #f6efe8",
        }}
      >
        <Layout.Header
          style={{
            background: "transparent",
            padding: 24,
            height: "auto",
            lineHeight: "normal",
          }}
        >
          <Card
            variant="borderless"
            style={{
              boxShadow: "0 18px 50px rgba(63, 39, 26, 0.12)",
            }}
          >
            <Flex justify="space-between" align="center" gap={16} wrap="wrap">
              <Flex align="center" gap={12} wrap="wrap">
                <Button
                  type="text"
                  icon={
                    isDesktop ? (
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    ) : (
                      <MenuUnfoldOutlined />
                    )
                  }
                  onClick={() => {
                    if (isDesktop) {
                      setCollapsed((current) => !current);
                      return;
                    }

                    setMobileOpen(true);
                  }}
                />
                <div>
                  <Tag
                    color="orange"
                    style={{ marginInlineEnd: 0, marginBottom: 12 }}
                  >
                    Signed in
                  </Tag>
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    {user.fullName}
                  </Typography.Title>
                </div>
              </Flex>

              <Flex align="center" gap={12} wrap="wrap">
                <span style={{ color: "rgba(0, 0, 0, 0.65)" }}>{user.email}</span>
                <SignOutButton />
              </Flex>
            </Flex>
          </Card>
        </Layout.Header>

        <Layout.Content style={{ padding: "0 24px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>{children}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
