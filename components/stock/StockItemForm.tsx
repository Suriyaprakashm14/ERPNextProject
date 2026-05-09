"use client";

import { Alert, Button, Flex, Form } from "antd";
import { useEffect } from "react";

import BarcodeSection from "./BarcodeSection";
import BasicInfoSection from "./BasicInfoSection";
import BatchSection from "./BatchSection";
import PricingSection from "./PricingSection";
import StockSettingsSection from "./StockSettingsSection";
import TextileAttributesSection from "./TextileAttributesSection";
import VariantSection from "./VariantSection";
import type { StockItem, StockItemFormValues, StockMode } from "@/features/stock/stockTypes";

type StockItemFormProps = {
  initialValues: StockItemFormValues;
  mode: StockMode;
  saving: boolean;
  error: string | null;
  selectedItem: StockItem | null;
  onEdit: (item: StockItem) => void;
  onSubmit: (values: StockItemFormValues) => Promise<unknown>;
  onCancel: () => void;
};

export const defaultStockItemValues: StockItemFormValues = {
  itemName: "",
  itemCode: "",
  itemGroup: "",
  brand: "",
  stockUom: "Nos",
  description: "",
  category: "",
  subcategory: "",
  fabricType: "",
  gender: "",
  season: "",
  pattern: "",
  fitType: "",
  sleeveType: "",
  hasVariants: false,
  colors: [],
  sizes: [],
  styles: [],
  buyingPrice: undefined,
  mrp: undefined,
  sellingPrice: 0,
  minimumSellingPrice: undefined,
  profitMargin: undefined,
  taxTemplate: "",
  autoGenerateBarcode: false,
  barcodePerVariant: false,
  manualBarcode: "",
  enableBatchTracking: true,
  enableExpiry: false,
  autoCreateBatch: true,
  maintainStock: true,
  defaultWarehouse: "",
  reorderLevel: undefined,
  safetyStock: undefined,
  allowNegativeStock: false,
  disabled: false,
};

export default function StockItemForm({
  initialValues,
  mode,
  saving,
  error,
  selectedItem,
  onEdit,
  onSubmit,
  onCancel,
}: StockItemFormProps) {
  const [form] = Form.useForm<StockItemFormValues>();
  const isViewMode = mode === "view";

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <Form<StockItemFormValues>
      form={form}
      layout="vertical"
      disabled={saving}
      initialValues={initialValues}
      onFinish={(values) => {
        void onSubmit(values);
      }}
    >
      <Flex vertical gap={16}>
        {error ? (
          <Alert
            showIcon
            type="error"
            title={mode === "create" ? "Unable to create item" : "Unable to update item"}
            description={error}
          />
        ) : null}
        <div style={isViewMode ? { pointerEvents: "none", opacity: 0.88 } : undefined}>
          <Flex vertical gap={16}>
            <BasicInfoSection />
            <TextileAttributesSection />
            <VariantSection />
            <PricingSection />
            <BarcodeSection />
            <BatchSection />
            <StockSettingsSection />
          </Flex>
        </div>
        <Flex justify="flex-end" gap={12}>
          <Button onClick={onCancel}>{isViewMode ? "Close" : "Cancel"}</Button>
          {isViewMode ? (
            <Button
              type="primary"
              onClick={() => {
                if (selectedItem) {
                  onEdit(selectedItem);
                }
              }}
            >
              Edit Item
            </Button>
          ) : (
            <Button type="primary" htmlType="submit" loading={saving}>
              {mode === "create" ? "Create Item" : "Update Item"}
            </Button>
          )}
        </Flex>
      </Flex>
    </Form>
  );
}
