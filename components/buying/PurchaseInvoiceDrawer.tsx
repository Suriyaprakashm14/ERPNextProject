"use client";

import { Drawer } from "antd";

import PurchaseInvoiceForm from "./PurchaseInvoiceForm";
import { purchaseInvoiceValuesFromDoc } from "@/features/buying/buyingSlice";
import type { BuyingDocument } from "@/features/buying/buyingTypes";
import type { BuyingMode } from "@/features/buying/buyingTypes";
import type { PurchaseInvoiceFormValues } from "@/features/buying/buyingTypes";

type PurchaseInvoiceDrawerProps = {
  open: boolean;
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
  onClose: () => void;
  onEdit: () => void;
  onCreate: (values: PurchaseInvoiceFormValues) => Promise<unknown>;
  onUpdate: (payload: { name: string; values: PurchaseInvoiceFormValues }) => Promise<unknown>;
  onSubmitDocument: (name: string) => Promise<unknown>;
};

export default function PurchaseInvoiceDrawer(props: PurchaseInvoiceDrawerProps) {
  const title =
    props.mode === "create"
      ? "New Purchase Invoice"
      : props.mode === "edit"
        ? "Edit Purchase Invoice"
        : "Purchase Invoice";

  async function handleFinish(values: PurchaseInvoiceFormValues) {
    const docName = props.selectedDocument?.name;
    if (props.mode === "edit" && typeof docName === "string") {
      await props.onUpdate({ name: docName, values });
      return;
    }
    await props.onCreate(values);
  }

  const docName = typeof props.selectedDocument?.name === "string" ? props.selectedDocument.name : "";

  return (
    <Drawer open={props.open} width={800} title={title} onClose={props.onClose} destroyOnHidden>
      <PurchaseInvoiceForm
        initialValues={purchaseInvoiceValuesFromDoc(
          props.mode === "create" ? null : props.selectedDocument,
        )}
        mode={props.mode}
        saving={props.saving}
        submitting={props.submitting}
        error={props.error}
        selectedDocument={props.selectedDocument}
        masterLoading={props.masterLoading}
        purchaseReceipts={props.purchaseReceipts}
        suppliers={props.suppliers}
        companies={props.companies}
        taxTemplates={props.taxTemplates}
        items={props.items}
        onEdit={props.onEdit}
        onSubmit={handleFinish}
        onSubmitToErpNext={
          docName
            ? async () => {
                await props.onSubmitDocument(docName);
              }
            : undefined
        }
        onCancel={props.onClose}
      />
    </Drawer>
  );
}
