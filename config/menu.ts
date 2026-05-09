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
  {
    key: "buying-material-requests",
    label: "Material Requests",
    href: ROUTES.buyingMaterialRequests,
    group: "Buying",
  },
  {
    key: "buying-purchase-orders",
    label: "Purchase Orders",
    href: ROUTES.buyingPurchaseOrders,
    group: "Buying",
  },
  {
    key: "buying-purchase-receipts",
    label: "Purchase Receipts",
    href: ROUTES.buyingPurchaseReceipts,
    group: "Buying",
  },
  {
    key: "buying-purchase-invoices",
    label: "Purchase Invoices",
    href: ROUTES.buyingPurchaseInvoices,
    group: "Buying",
  },
];
