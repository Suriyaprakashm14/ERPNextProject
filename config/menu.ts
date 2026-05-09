import { ROUTES } from "./routes";

export type MenuItemConfig = {
  key: string;
  label: string;
  href: string;
  group: string;
};

export const menuItems: MenuItemConfig[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: ROUTES.dashboard,
    group: "Overview",
  },
  {
    key: "stock-items",
    label: "Stock Items",
    href: ROUTES.stockItems,
    group: "Stock",
  },
];
