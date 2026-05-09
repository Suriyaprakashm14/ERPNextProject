"use client";

import { Alert, Button, Flex, Form, Input, InputNumber, Select, Typography } from "antd";
import type { FormListFieldData } from "antd/es/form/FormList";
import { useEffect, useMemo } from "react";

import MasterDataEmptyHint, { MASTER_DATA_EMPTY_MESSAGE } from "./MasterDataEmptyHint";
import PurchaseItemsTable, { type PurchaseItemColumnSpec } from "./PurchaseItemsTable";
import {
  formatCompanyLabel,
  formatItemLabel,
  formatSupplierLabel,
  formatWarehouseLabel,
} from "./labelFormatters";
import type { BuyingDocument } from "@/features/buying/buyingTypes";
import type { BuyingMode } from "@/features/buying/buyingTypes";
import type { PurchaseReceiptFormValues } from "@/features/buying/buyingTypes";

type PurchaseReceiptFormProps = {
  initialValues: PurchaseReceiptFormValues;
  mode: BuyingMode;
  saving: boolean;
  submitting: boolean;
  error: string | null;
  selectedDocument: BuyingDocument | null;
  masterLoading: boolean;
  purchaseOrders: BuyingDocument[];
  suppliers: BuyingDocument[];
  companies: BuyingDocument[];
  warehouses: BuyingDocument[];
  items: BuyingDocument[];
  onEdit: () => void;
  onSubmit: (values: PurchaseReceiptFormValues) => Promise<void>;
  onSubmitToErpNext?: () => Promise<void>;
  onCancel: () => void;
};

function filterSelectOption(input: string, option?: { label?: string }) {
  const label = (option?.label ?? "").toLowerCase();
  return label.includes(input.toLowerCase());
}

function batchEnabled(row?: BuyingDocument) {
  const v = row?.has_batch_no;
  return v === true || v === 1 || v === "1";
}

function BatchField({
  field,
  disabled,
  itemsCatalog,
}: {
  field: FormListFieldData;
  disabled: boolean;
  itemsCatalog: BuyingDocument[];
}) {
  const form = Form.useFormInstance<PurchaseReceiptFormValues>();
  const code = Form.useWatch(["items", field.name, "itemCode"], form);

  const masterRow = useMemo(() => {
    return itemsCatalog.find(
      (entry) =>
        String(entry.item_code ?? entry.name ?? "") === String(code ?? "").trim(),
    );
  }, [code, itemsCatalog]);

  if (!batchEnabled(masterRow)) {
    return (
      <Typography.Text type="secondary" style={{ display: "block", paddingTop: 4 }}>
        —
      </Typography.Text>
    );
  }

  return (
    <Form.Item name={[field.name, "batch"]} style={{ marginBottom: 0 }}>
      <Input disabled={disabled} placeholder="Batch No" />
    </Form.Item>
  );
}

export const defaultPurchaseReceiptRow = () => ({
  itemCode: "",
  qtyReceived: 1,
  actualRate: 0,
  batch: "",
  warehouse: "",
});

export default function PurchaseReceiptForm({
  initialValues,
  mode,
  saving,
  submitting,
  error,
  selectedDocument,
  masterLoading,
  purchaseOrders,
  suppliers,
  companies,
  warehouses,
  items,
  onEdit,
  onSubmit,
  onSubmitToErpNext,
  onCancel,
}: PurchaseReceiptFormProps) {
  const [form] = Form.useForm<PurchaseReceiptFormValues>();
  const isViewMode = mode === "view";
  const docNameStr = typeof selectedDocument?.name === "string" ? selectedDocument.name : "";
  const statusStr = String(selectedDocument?.status ?? "").toLowerCase();
  const canSubmitToErp =
    (mode === "edit" || mode === "view") &&
    Boolean(docNameStr) &&
    (statusStr === "" ||
      statusStr === "draft" ||
      statusStr.includes("draft") ||
      statusStr.includes("to receive"));

  const company = Form.useWatch("company", form);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const filteredWarehouses = useMemo(() => {
    const c = typeof company === "string" ? company.trim() : "";
    if (!c) {
      return warehouses;
    }
    return warehouses.filter((row) => String(row.company ?? "") === c);
  }, [company, warehouses]);

  const supplierEmpty = !masterLoading && suppliers.length === 0;
  const companyOptEmpty = !masterLoading && companies.length === 0;
  const whEmpty = !masterLoading && filteredWarehouses.length === 0;
  const poEmpty = !masterLoading && purchaseOrders.length === 0;
  const itemOptsEmpty = !masterLoading && items.length === 0;

  const itemColumns: PurchaseItemColumnSpec[] = [
    {
      title: "Item",
      key: "item",
      width: 220,
      render: (field) => (
        <Form.Item
          name={[field.name, "itemCode"]}
          rules={[{ required: true, message: "Select item" }]}
          style={{ marginBottom: 0 }}
        >
          <Select
            showSearch
            allowClear
            loading={masterLoading}
            disabled={isViewMode}
            placeholder={itemOptsEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Item"}
            options={items.map((row) => ({
              value: String(row.item_code ?? row.name ?? ""),
              label: formatItemLabel(row),
            }))}
            filterOption={filterSelectOption}
            notFoundContent={itemOptsEmpty ? <MasterDataEmptyHint /> : undefined}
          />
        </Form.Item>
      ),
    },
    {
      title: "Qty Received",
      key: "qty",
      width: 120,
      render: (field) => (
        <Form.Item
          name={[field.name, "qtyReceived"]}
          rules={[{ required: true, message: "Qty required" }]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber min={0} precision={4} style={{ width: "100%" }} disabled={isViewMode} />
        </Form.Item>
      ),
    },
    {
      title: "Actual Rate",
      key: "rate",
      width: 120,
      render: (field) => (
        <Form.Item name={[field.name, "actualRate"]} style={{ marginBottom: 0 }}>
          <InputNumber min={0} precision={4} style={{ width: "100%" }} disabled={isViewMode} />
        </Form.Item>
      ),
    },
    {
      title: "Batch",
      key: "batch",
      width: 160,
      render: (field) => (
        <BatchField field={field} disabled={isViewMode} itemsCatalog={items} />
      ),
    },
    {
      title: "Warehouse",
      key: "wh",
      width: 200,
      render: (field) => (
        <Form.Item
          name={[field.name, "warehouse"]}
          rules={[{ required: true, message: "Warehouse required" }]}
          style={{ marginBottom: 0 }}
        >
          <Select
            showSearch
            allowClear
            loading={masterLoading}
            disabled={isViewMode}
            placeholder={whEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Warehouse"}
            options={filteredWarehouses.map((row) => ({
              value: String(row.name ?? ""),
              label: formatWarehouseLabel(row),
            }))}
            filterOption={filterSelectOption}
            notFoundContent={whEmpty ? <MasterDataEmptyHint /> : undefined}
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <Form<PurchaseReceiptFormValues>
      form={form}
      layout="vertical"
      disabled={saving || submitting}
      initialValues={initialValues}
      onFinish={async (values) => {
        const cleaned = values.items.filter((row) =>
          typeof row.itemCode === "string" ? row.itemCode.trim() : false,
        );
        await onSubmit({ ...values, items: cleaned });
      }}
    >
      <Flex vertical gap={16}>
        {error ? <Alert showIcon type="error" description={error} /> : null}
        <div style={isViewMode ? { pointerEvents: "none", opacity: 0.9 } : undefined}>
          <Flex vertical gap={16}>
            <Form.Item
              name="purchaseOrder"
              label="Purchase Order Reference"
              rules={[{ required: true, message: "Select purchase order" }]}
            >
              <Select
                showSearch
                allowClear
                disabled={isViewMode || masterLoading}
                placeholder={poEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Select purchase order"}
                options={purchaseOrders.map((row) => ({
                  value: String(row.name ?? ""),
                  label: String(row.name ?? ""),
                }))}
                filterOption={filterSelectOption}
                notFoundContent={poEmpty ? <MasterDataEmptyHint /> : undefined}
              />
            </Form.Item>
            <Form.Item
              name="supplier"
              label="Supplier"
              rules={[{ required: true, message: "Select supplier" }]}
            >
              <Select
                showSearch
                allowClear
                loading={masterLoading}
                disabled={isViewMode}
                placeholder={
                  supplierEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Select supplier"
                }
                options={suppliers.map((row) => ({
                  value: String(row.name ?? ""),
                  label: formatSupplierLabel(row),
                }))}
                filterOption={filterSelectOption}
                notFoundContent={supplierEmpty ? <MasterDataEmptyHint /> : undefined}
              />
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
                  companyOptEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Select company"
                }
                options={companies.map((row) => ({
                  value: String(row.name ?? ""),
                  label: formatCompanyLabel(row),
                }))}
                filterOption={filterSelectOption}
                notFoundContent={companyOptEmpty ? <MasterDataEmptyHint /> : undefined}
              />
            </Form.Item>
            <Form.Item
              name="postingDate"
              label="Posting Date"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input type="date" disabled={isViewMode} />
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
                  whEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Default warehouse context"
                }
                options={filteredWarehouses.map((row) => ({
                  value: String(row.name ?? ""),
                  label: formatWarehouseLabel(row),
                }))}
                filterOption={filterSelectOption}
                notFoundContent={whEmpty ? <MasterDataEmptyHint /> : undefined}
              />
            </Form.Item>
            <Typography.Text strong>Received lines</Typography.Text>
            <PurchaseItemsTable
              name="items"
              loading={masterLoading}
              readOnly={isViewMode}
              emptyHint={<MasterDataEmptyHint />}
              buildDefaultRow={defaultPurchaseReceiptRow}
              columns={itemColumns}
            />
          </Flex>
        </div>
        <Flex justify="flex-end" gap={12} wrap="wrap">
          <Button onClick={onCancel}>{isViewMode ? "Close" : "Cancel"}</Button>
          {canSubmitToErp && onSubmitToErpNext && docNameStr ? (
            <Button loading={submitting} onClick={() => void onSubmitToErpNext()}>
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
