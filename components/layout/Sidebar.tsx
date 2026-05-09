"use client";

import {
  AppstoreOutlined,
  DashboardOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { Menu, Typography } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { menuItems } from "@/config/menu";

type SidebarProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

function getIcon(key: string) {
  if (key === "dashboard") {
    return <DashboardOutlined />;
  }

  if (key.startsWith("stock")) {
    return <InboxOutlined />;
  }

  return <AppstoreOutlined />;
}

export default function Sidebar({
  collapsed = false,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const groupedItems = menuItems.reduce<Record<string, typeof menuItems>>(
    (accumulator, item) => {
      const groupItems = accumulator[item.group] ?? [];
      groupItems.push(item);
      accumulator[item.group] = groupItems;
      return accumulator;
    },
    {},
  );

  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        padding: collapsed ? "20px 12px" : "24px 16px",
        background:
          "linear-gradient(180deg, #1f130c 0%, #3d2417 52%, #7b4f32 100%)",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Typography.Text
          style={{
            display: "block",
            color: "rgba(255, 244, 229, 0.72)",
            textTransform: "uppercase",
            letterSpacing: 1.8,
            fontSize: 11,
            marginBottom: 8,
          }}
        >
          Textile ERP
        </Typography.Text>
        <Typography.Title
          level={4}
          style={{
            color: "#fff6ee",
            margin: 0,
            fontSize: collapsed ? 18 : 22,
            lineHeight: 1.15,
          }}
        >
          {collapsed ? "TS" : "Textile Suite"}
        </Typography.Title>
      </div>

      <div style={{ flex: 1 }}>
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group} style={{ marginBottom: 18 }}>
            {!collapsed ? (
              <Typography.Text
                style={{
                  display: "block",
                  color: "rgba(255, 244, 229, 0.56)",
                  textTransform: "uppercase",
                  letterSpacing: 1.4,
                  fontSize: 11,
                  paddingInline: 12,
                  marginBottom: 8,
                }}
              >
                {group}
              </Typography.Text>
            ) : null}
            <Menu
              mode="inline"
              theme="dark"
              selectedKeys={items
                .filter(
                  (item) =>
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`),
                )
                .map((item) => item.key)}
              style={{
                background: "transparent",
                borderInlineEnd: "none",
                color: "rgba(255, 244, 229, 0.84)",
              }}
              inlineIndent={collapsed ? 12 : 20}
              selectable
              items={items.map((item) => ({
                key: item.key,
                icon: getIcon(item.key),
                label: (
                  <Link href={item.href} onClick={onNavigate}>
                    {item.label}
                  </Link>
                ),
                style: {
                  marginBottom: 6,
                  borderRadius: 999,
                },
              }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
