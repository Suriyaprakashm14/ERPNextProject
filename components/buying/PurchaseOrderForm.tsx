"use client";

import { Alert, Button, Flex, Form, Input, InputNumber, Select, Typography } from "antd";
import { useEffect, useMemo } from "react";

import MasterDataEmptyHint, { MASTER_DATA_EMPTY_MESSAGE } from "./MasterDataEmptyHint";
import PurchaseItemsTable, { type PurchaseItemColumnSpec } from "./PurchaseItemsTable";
import {
  formatCompanyLabel,
  formatItemLabel,
  formatSupplierLabel,
  formatTaxTemplateLabel,
  formatWarehouseLabel,
} from "./labelFormatters";
import type { BuyingDocument } from "@/features/buying/buyingTypes";
import type { BuyingMode } from "@/features/buying/buyingTypes";
import type { PurchaseOrderFormValues } from "@/features/buying/buyingTypes";

type PurchaseOrderFormProps = {
  initialValues: PurchaseOrderFormValues;
  mode: BuyingMode;
  saving: boolean;
  submitting: boolean;
  error: string | null;
  selectedDocument: BuyingDocument | null;
  masterLoading: boolean;
  materialRequests: BuyingDocument[];
  suppliers: BuyingDocument[];
  companies: BuyingDocument[];
  warehouses: BuyingDocument[];
  taxTemplates: BuyingDocument[];
  items: BuyingDocument[];
  onEdit: () => void;
  onSubmit: (values: PurchaseOrderFormValues) => Promise<void>;
  onSubmitToErpNext?: () => Promise<void>;
  onCancel: () => void;
};

function filterSelectOption(input: string, option?: { label?: string }) {
  const label = (option?.label ?? "").toLowerCase();
  return label.includes(input.toLowerCase());
}

function LineAmountPreview({ rowIndex }: { rowIndex: number }) {
  const form = Form.useFormInstance<PurchaseOrderFormValues>();
  const qty = Form.useWatch(["items", rowIndex, "qty"], form);
  const rate = Form.useWatch(["items", rowIndex, "rate"], form);
  const qn = typeof qty === "number" ? qty : Number(qty || 0);
  const rn = typeof rate === "number" ? rate : Number(rate || 0);
  const amount = Number.isFinite(qn) && Number.isFinite(rn) ? qn * rn : 0;
  return <Typography.Text>{amount.toFixed(2)}</Typography.Text>;
}

export const defaultPurchaseOrderRow = () => ({
  itemCode: "",
  qty: 1,
  rate: 0,
  warehouse: "",
  amount: 0,
});

export default function PurchaseOrderForm({
  initialValues,
  mode,
  saving,
  submitting,
  error,
  selectedDocument,
  masterLoading,
  materialRequests,
  suppliers,
  companies,
  warehouses,
  taxTemplates,
  items,
  onEdit,
  onSubmit,
  onSubmitToErpNext,
  onCancel,
}: PurchaseOrderFormProps) {
  const [form] = Form.useForm<PurchaseOrderFormValues>();
  const isViewMode = mode === "view";
  const docNameStr = typeof selectedDocument?.name === "string" ? selectedDocument.name : "";
  const statusStr = String(selectedDocument?.status ?? "").toLowerCase();
  const canSubmitToErp =
    (mode === "edit" || mode === "view") &&
    Boolean(docNameStr) &&
    (statusStr === "" || statusStr === "draft" || statusStr.includes("draft"));

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

  const filteredTaxTemplates = useMemo(() => {
    const c = typeof company === "string" ? company.trim() : "";
    if (!c) {
      return taxTemplates;
    }
    return taxTemplates.filter(
      (row) => !row.company || String(row.company ?? "") === c,
    );
  }, [company, taxTemplates]);

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

  const supplierEmpty = !masterLoading && suppliers.length === 0;
  const companyOptEmpty = !masterLoading && companies.length === 0;
  const whEmpty = !masterLoading && filteredWarehouses.length === 0;
  const mrEmpty = !masterLoading && materialRequests.length === 0;
  const taxEmpty = !masterLoading && filteredTaxTemplates.length === 0;
  const itemOptsEmpty = !masterLoading && items.length === 0;

  const itemColumns: PurchaseItemColumnSpec[] = [
    {
      title: "Item",
      key: "item",
      width: 240,
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
            placeholder={itemOptsEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Select item"}
            options={items.map((row) => ({
              value: String(row.item_code ?? row.name ?? ""),
              label: formatItemLabel(row),
            }))}
            filterOption={filterSelectOption}
            notFoundContent={itemOptsEmpty ? <MasterDataEmptyHint /> : undefined}
            onChange={(value) => {
              const master =
                typeof value === "string" ? itemByCode.get(value) : undefined;
              const warehouse = master
                ? String((master as { default_warehouse?: string }).default_warehouse ?? "")
                : "";
              if (warehouse) {
                form.setFieldValue(["items", field.name, "warehouse"], warehouse);
              }
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Qty",
      key: "qty",
      width: 110,
      render: (field) => (
        <Form.Item
          name={[field.name, "qty"]}
          rules={[{ required: true, message: "Qty required" }]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber min={0} precision={4} style={{ width: "100%" }} disabled={isViewMode} />
        </Form.Item>
      ),
    },
    {
      title: "Rate",
      key: "rate",
      width: 110,
      render: (field) => (
        <Form.Item name={[field.name, "rate"]} style={{ marginBottom: 0 }}>
          <InputNumber min={0} precision={4} style={{ width: "100%" }} disabled={isViewMode} />
        </Form.Item>
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
    {
      title: "Amount",
      key: "amount",
      width: 110,
      render: (field) => (
        <LineAmountPreview rowIndex={field.name as number} />
      ),
    },
  ];

  return (
    <Form<PurchaseOrderFormValues>
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
        {error ? (
          <Alert showIcon type="error" description={error} />
        ) : null}
        <div style={isViewMode ? { pointerEvents: "none", opacity: 0.9 } : undefined}>
          <Flex vertical gap={16}>
            <Form.Item name="materialRequest" label="Material Request Reference">
              <Select
                showSearch
                allowClear
                disabled={isViewMode || masterLoading}
                placeholder={
                  mrEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Select material request (optional)"
                }
                options={materialRequests.map((row) => ({
                  value: String(row.name ?? ""),
                  label: String(row.name ?? ""),
                }))}
                filterOption={filterSelectOption}
                notFoundContent={mrEmpty ? <MasterDataEmptyHint /> : undefined}
              />
            </Form.Item>
            <Form.Item
              name="supplier"
              label="Supplier"
              // TODO(supplier-master): Supplier CRUD will live elsewhere; dropdown is read-only from ERPNext.
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
              name="transactionDate"
              label="Transaction Date"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input type="date" disabled={isViewMode} />
            </Form.Item>
            <Form.Item
              name="scheduleDate"
              label="Schedule Date"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input type="date" disabled={isViewMode} />
            </Form.Item>
            <Form.Item name="taxesAndChargesTemplate" label="Tax Template">
              <Select
                showSearch
                allowClear
                loading={masterLoading}
                disabled={isViewMode}
                placeholder={taxEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Select tax template"}
                options={filteredTaxTemplates.map((row) => ({
                  value: String(row.name ?? ""),
                  label: formatTaxTemplateLabel(row),
                }))}
                filterOption={filterSelectOption}
                notFoundContent={taxEmpty ? <MasterDataEmptyHint /> : undefined}
              />
            </Form.Item>
            <Typography.Text strong>Items</Typography.Text>
            <PurchaseItemsTable
              name="items"
              loading={masterLoading}
              readOnly={isViewMode}
              emptyHint={<MasterDataEmptyHint />}
              buildDefaultRow={defaultPurchaseOrderRow}
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
