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
} from "./labelFormatters";
import type { BuyingDocument } from "@/features/buying/buyingTypes";
import type { BuyingMode } from "@/features/buying/buyingTypes";
import type { PurchaseInvoiceFormValues } from "@/features/buying/buyingTypes";

type PurchaseInvoiceFormProps = {
  initialValues: PurchaseInvoiceFormValues;
  mode: BuyingMode;
  saving: boolean;
  submitting: boolean;
  error: string | null;
  selectedDocument: BuyingDocument | null;
  masterLoading: boolean;
  purchaseReceipts: BuyingDocument[];
  suppliers: BuyingDocument[];
  companies: BuyingDocument[];
  taxTemplates: BuyingDocument[];
  items: BuyingDocument[];
  onEdit: () => void;
  onSubmit: (values: PurchaseInvoiceFormValues) => Promise<void>;
  onSubmitToErpNext?: () => Promise<void>;
  onCancel: () => void;
};

function filterSelectOption(input: string, option?: { label?: string }) {
  const label = (option?.label ?? "").toLowerCase();
  return label.includes(input.toLowerCase());
}

function LineInvoiceAmountPreview({ rowIndex }: { rowIndex: number }) {
  const form = Form.useFormInstance<PurchaseInvoiceFormValues>();
  const qty = Form.useWatch(["items", rowIndex, "qty"], form);
  const rate = Form.useWatch(["items", rowIndex, "rate"], form);
  const qn = typeof qty === "number" ? qty : Number(qty || 0);
  const rn = typeof rate === "number" ? rate : Number(rate || 0);
  const amount = Number.isFinite(qn) && Number.isFinite(rn) ? qn * rn : 0;
  return <Typography.Text>{amount.toFixed(2)}</Typography.Text>;
}

export const defaultPurchaseInvoiceRow = () => ({
  itemCode: "",
  qty: 1,
  rate: 0,
  amount: 0,
});

export default function PurchaseInvoiceForm({
  initialValues,
  mode,
  saving,
  submitting,
  error,
  selectedDocument,
  masterLoading,
  purchaseReceipts,
  suppliers,
  companies,
  taxTemplates,
  items,
  onEdit,
  onSubmit,
  onSubmitToErpNext,
  onCancel,
}: PurchaseInvoiceFormProps) {
  const [form] = Form.useForm<PurchaseInvoiceFormValues>();
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

  const filteredTaxTemplates = useMemo(() => {
    const c = typeof company === "string" ? company.trim() : "";
    if (!c) {
      return taxTemplates;
    }
    return taxTemplates.filter(
      (row) => !row.company || String(row.company ?? "") === c,
    );
  }, [company, taxTemplates]);

  const supplierEmpty = !masterLoading && suppliers.length === 0;
  const companyOptEmpty = !masterLoading && companies.length === 0;
  const prEmpty = !masterLoading && purchaseReceipts.length === 0;
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
      title: "Amount",
      key: "amount",
      width: 110,
      render: (field) => (
        <LineInvoiceAmountPreview rowIndex={field.name as number} />
      ),
    },
  ];

  return (
    <Form<PurchaseInvoiceFormValues>
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
              name="purchaseReceipt"
              label="Purchase Receipt Reference"
              rules={[{ required: true, message: "Select receipt" }]}
            >
              <Select
                showSearch
                allowClear
                disabled={isViewMode || masterLoading}
                placeholder={
                  prEmpty ? MASTER_DATA_EMPTY_MESSAGE : "Select purchase receipt"
                }
                options={purchaseReceipts.map((row) => ({
                  value: String(row.name ?? ""),
                  label: String(row.name ?? ""),
                }))}
                filterOption={filterSelectOption}
                notFoundContent={prEmpty ? <MasterDataEmptyHint /> : undefined}
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
            <Form.Item name="billNo" label="Bill No" rules={[{ required: true }]}>
              <Input disabled={isViewMode} placeholder="Vendor bill reference" />
            </Form.Item>
            <Form.Item name="billDate" label="Bill Date" rules={[{ required: true }]}>
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
              buildDefaultRow={defaultPurchaseInvoiceRow}
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
