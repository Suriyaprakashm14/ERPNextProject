import type { ThemeConfig } from "antd";

const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#9f4f2d",
    colorInfo: "#9f4f2d",
    colorSuccess: "#1f7a45",
    colorWarning: "#d48806",
    colorError: "#b42318",
    colorBgBase: "#f5f1e8",
    colorBgLayout: "#f5f1e8",
    colorBgContainer: "#ffffff",
    colorBorderSecondary: "#e7d9c8",
    colorText: "#1f1a17",
    colorTextSecondary: "#65574f",
    borderRadius: 18,
    borderRadiusLG: 24,
    fontFamily: "Arial, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 14,
      controlHeight: 44,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 0,
    },
    Input: {
      borderRadius: 14,
      controlHeight: 46,
    },
    Layout: {
      bodyBg: "#f5f1e8",
      headerBg: "transparent",
    },
  },
};

export default antdTheme;
