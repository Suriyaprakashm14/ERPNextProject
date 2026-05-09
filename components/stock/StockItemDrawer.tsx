"use client";

import { Drawer } from "antd";

import StockItemForm, { defaultStockItemValues } from "./StockItemForm";
import type { StockItem, StockItemFormValues, StockMode } from "@/features/stock/stockTypes";

type StockItemDrawerProps = {
  open: boolean;
  mode: StockMode;
  saving: boolean;
  error: string | null;
  selectedItem: StockItem | null;
  onClose: () => void;
  onEdit: (item: StockItem) => void;
  onCreate: (values: StockItemFormValues) => Promise<unknown>;
  onUpdate: (payload: { name: string; values: StockItemFormValues }) => Promise<unknown>;
};

function getFormValuesFromItem(item: StockItem | null): StockItemFormValues {
  if (!item) {
    return defaultStockItemValues;
  }

  return {
    ...defaultStockItemValues,
    itemName: item.item_name,
    itemCode: item.item_code,
    itemGroup: item.item_group,
    brand: item.brand ?? "",
    stockUom: item.stock_uom,
    description: item.description ?? "",
    sellingPrice: item.selling_price ?? 0,
    maintainStock: item.maintain_stock,
    hasVariants: item.has_variants,
    enableBatchTracking: item.has_batch_no,
    disabled: item.disabled,
  };
}

export default function StockItemDrawer({
  open,
  mode,
  saving,
  error,
  selectedItem,
  onClose,
  onEdit,
  onCreate,
  onUpdate,
}: StockItemDrawerProps) {
  async function handleSubmit(values: StockItemFormValues) {
    if (mode === "edit" && selectedItem) {
      await onUpdate({
        name: selectedItem.name,
        values,
      });
      return;
    }

    await onCreate(values);
  }

  return (
    <Drawer
      open={open}
      size="large"
      title={
        mode === "create"
          ? "Add Stock Item"
          : mode === "edit"
            ? "Edit Stock Item"
            : "Stock Item Details"
      }
      onClose={onClose}
      destroyOnHidden
    >
      <StockItemForm
        initialValues={getFormValuesFromItem(selectedItem)}
        mode={mode}
        saving={saving}
        error={error}
        selectedItem={selectedItem}
        onEdit={onEdit}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Drawer>
  );
}
