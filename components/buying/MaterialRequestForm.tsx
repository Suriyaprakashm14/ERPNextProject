"use client";

import { Alert, Button, Flex, Form, Input, InputNumber, Select, Typography } from "antd";
import { useEffect, useMemo } from "react";

import MasterDataEmptyHint, { MASTER_DATA_EMPTY_MESSAGE } from "./MasterDataEmptyHint";
import PurchaseItemsTable, { type PurchaseItemColumnSpec } from "./PurchaseItemsTable";
import {
  formatCompanyLabel,
  formatItemLabel,
  formatWarehouseLabel,
} from "./labelFormatters";
import type {
  BuyingDocument,
  BuyingMode,
  MaterialRequestFormValues,
} from "@/features/buying/buyingTypes";

const MATERIAL_REQUEST_TYPES = [
  "Purchase",
  "Material Transfer",
  "Material Issue",
  "Manufacture",
  "Customer Provided",
];

type MaterialRequestFormProps = {
  initialValues: MaterialRequestFormValues;
  mode: BuyingMode;
  saving: boolean;
  submitting: boolean;
  error: string | null;
  selectedDocument: BuyingDocument | null;
  masterLoading: boolean;
  companies: BuyingDocument[];
  warehouses: BuyingDocument[];
  items: BuyingDocument[];
  uoms: BuyingDocument[];
  onEdit: () => void;
  onSubmit: (values: MaterialRequestFormValues) => Promise<void>;
  onSubmitToErpNext?: () => Promise<void>;
  onCancel: () => void;
};

function filterSelectOption(input: string, option?: { label?: string }) {
  const label = (option?.label ?? "").toLowerCase();
  return label.includes(input.toLowerCase());
}

export const defaultMaterialRequestRow = () => ({
  itemCode: "",
  variant: "",
  qty: 1,
  uom: "",
});

export default function MaterialRequestForm({
  initialValues,
  mode,
  saving,
  submitting,
  error,
  selectedDocument,
  masterLoading,
  companies,
  warehouses,
  items,
  uoms,
  onEdit,
  onSubmit,
  onSubmitToErpNext,
  onCancel,
}: MaterialRequestFormProps) {
  const [form] = Form.useForm<MaterialRequestFormValues>();
  const isViewMode = mode === "view";
  const docName = selectedDocument?.name;
  const docNameStr = typeof docName === "string" ? docName : "";
  const statusStr = String(selectedDocument?.status ?? "").toLowerCase();
  const canSubmitToErp =
    (mode === "edit" || mode === "view") &&
    Boolean(docNameStr) &&
    (statusStr === "" || statusStr === "draft" || statusStr.includes("draft"));

  const itemByCode = useMemo(() => {
    const map = new Map<string, BuyingDocument>();
    for (const row of items) {
      const code = String(row.item_code ?? row.name ?? "");
      if (code) {
        map.set(code, row);
      }
    }
    return map;
  }, [items]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const companyOptionsEmpty = !masterLoading && companies.length === 0;
  const warehouseOptionsEmpty = !masterLoading && warehouses.length === 0;
  const itemOptionsEmpty = !masterLoading && items.length === 0;
  const uomOptionsEmpty = !masterLoading && uoms.length === 0;

  const itemColumns: PurchaseItemColumnSpec[] = [
    {
      title: "Item",
      key: "item",
      width: 260,
      render: (field) => (
        <Form.Item
          name={[field.name, "itemCode"]}
          rules={[{ required: true, message: "Select an item" }]}
          style={{ marginBottom: 0 }}
        >
          <Select
            showSearch
            allowClear
            loading={masterLoading}
            disabled={isViewMode}
            placeholder={itemOptionsEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Select item"}
            options={items.map((row) => ({
              value: String(row.item_code ?? row.name ?? ""),
              label: formatItemLabel(row),
            }))}
            filterOption={filterSelectOption}
            notFoundContent={itemOptionsEmpty ? <MasterDataEmptyHint /> : undefined}
            onChange={(value) => {
              const row = typeof value === "string" ? itemByCode.get(value) : undefined;
              const uom = row ? String(row.stock_uom ?? "") : "";
              form.setFieldValue(["items", field.name, "uom"], uom);
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Variant",
      key: "variant",
      width: 160,
      render: (field) => (
        <Form.Item name={[field.name, "variant"]} style={{ marginBottom: 0 }}>
          <Input disabled={isViewMode} placeholder="Optional" />
        </Form.Item>
      ),
    },
    {
      title: "Qty",
      key: "qty",
      width: 120,
      render: (field) => (
        <Form.Item
          name={[field.name, "qty"]}
          rules={[{ required: true, message: "Enter quantity" }]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber min={0} precision={3} style={{ width: "100%" }} disabled={isViewMode} />
        </Form.Item>
      ),
    },
    {
      title: "UOM",
      key: "uom",
      width: 140,
      render: (field) => (
        <Form.Item
          name={[field.name, "uom"]}
          rules={[{ required: true, message: "Select UOM" }]}
          style={{ marginBottom: 0 }}
        >
          <Select
            showSearch
            allowClear
            loading={masterLoading}
            disabled={isViewMode}
            placeholder={uomOptionsEmpty ? MASTER_DATA_EMPTY_MESSAGE : "UOM"}
            options={uoms.map((row) => ({
              value: String(row.name ?? ""),
              label: String(row.name ?? ""),
            }))}
            filterOption={filterSelectOption}
            notFoundContent={uomOptionsEmpty ? <MasterDataEmptyHint /> : undefined}
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <Form<MaterialRequestFormValues>
      form={form}
      layout="vertical"
      disabled={saving || submitting}
      initialValues={initialValues}
      onFinish={async (values) => {
        const cleanedItems = values.items.filter((row) =>
          typeof row.itemCode === "string" ? row.itemCode.trim() : false,
        );
        await onSubmit({ ...values, items: cleanedItems });
      }}
    >
      <Flex vertical gap={16}>
        {error ? (
          <Alert
            showIcon
            type="error"
            title={mode === "create" ? "Unable to create document" : "Unable to update document"}
            description={error}
          />
        ) : null}
        <div style={isViewMode ? { pointerEvents: "none", opacity: 0.9 } : undefined}>
          <Flex vertical gap={16}>
            <Form.Item
              name="materialRequestType"
              label="Material Request Type"
              rules={[{ required: true, message: "Select a type" }]}
            >
              <Select
                disabled={isViewMode}
                options={MATERIAL_REQUEST_TYPES.map((value) => ({ value, label: value }))}
              />
            </Form.Item>
            <Form.Item
              name="scheduleDate"
              label="Schedule Date"
              rules={[{ required: true, message: "Pick a schedule date" }]}
            >
              <Input type="date" disabled={isViewMode} />
            </Form.Item>
            <Form.Item
              name="company"
              label="Company"
              rules={[{ required: true, message: "Select company" }]}
            >
              <Select
                showSearch
                allowClear
                loading={masterLoading}
                disabled={isViewMode}
                placeholder={
                  companyOptionsEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Select company"
                }
                options={companies.map((row) => ({
                  value: String(row.name ?? ""),
                  label: formatCompanyLabel(row),
                }))}
                filterOption={filterSelectOption}
                notFoundContent={companyOptionsEmpty ? <MasterDataEmptyHint /> : undefined}
              />
            </Form.Item>
            <Form.Item
              name="setWarehouse"
              label="Set Warehouse"
              rules={[{ required: true, message: "Select warehouse" }]}
            >
              <Select
                showSearch
                allowClear
                loading={masterLoading}
                disabled={isViewMode}
                placeholder={
                  warehouseOptionsEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Select warehouse"
                }
                options={warehouses.map((row) => ({
                  value: String(row.name ?? ""),
                  label: formatWarehouseLabel(row),
                }))}
                filterOption={filterSelectOption}
                notFoundContent={warehouseOptionsEmpty ? <MasterDataEmptyHint /> : undefined}
              />
            </Form.Item>
            <Form.Item name="remarks" label="Remarks">
              <Input.TextArea rows={3} disabled={isViewMode} placeholder="Internal notes" />
            </Form.Item>
            <div>
              <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
                Items
              </Typography.Text>
              <PurchaseItemsTable
                name="items"
                loading={masterLoading}
                readOnly={isViewMode}
                emptyHint={<MasterDataEmptyHint />}
                buildDefaultRow={defaultMaterialRequestRow}
                columns={itemColumns}
              />
            </div>
          </Flex>
        </div>
        <Flex justify="flex-end" gap={12} wrap="wrap">
          <Button onClick={onCancel}>{isViewMode ? "Close" : "Cancel"}</Button>
          {canSubmitToErp && onSubmitToErpNext && docNameStr ? (
            <Button
              loading={submitting}
              onClick={() => {
                void onSubmitToErpNext();
              }}
            >
              Submit
            </Button>
          ) : null}
          {isViewMode ? (
            <Button type="primary" onClick={onEdit} style={{ pointerEvents: "auto" }}>
              Edit
            </Button>
          ) : (
            <Button type="primary" htmlType="submit" loading={saving}>
              {mode === "create" ? "Create" : "Save"}
            </Button>
          )}
        </Flex>
      </Flex>
    </Form>
  );
}
