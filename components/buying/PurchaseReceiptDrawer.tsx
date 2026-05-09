"use client";

import { Drawer } from "antd";

import PurchaseReceiptForm from "./PurchaseReceiptForm";
import { purchaseReceiptValuesFromDoc } from "@/features/buying/buyingSlice";
import type { BuyingDocument } from "@/features/buying/buyingTypes";
import type { BuyingMode } from "@/features/buying/buyingTypes";
import type { PurchaseReceiptFormValues } from "@/features/buying/buyingTypes";

type PurchaseReceiptDrawerProps = {
  open: boolean;
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
  onClose: () => void;
  onEdit: () => void;
  onCreate: (values: PurchaseReceiptFormValues) => Promise<unknown>;
  onUpdate: (payload: { name: string; values: PurchaseReceiptFormValues }) => Promise<unknown>;
  onSubmitDocument: (name: string) => Promise<unknown>;
};

export default function PurchaseReceiptDrawer(props: PurchaseReceiptDrawerProps) {
  const title =
    props.mode === "create"
      ? "New Purchase Receipt"
      : props.mode === "edit"
        ? "Edit Purchase Receipt"
        : "Purchase Receipt";

  async function handleFinish(values: PurchaseReceiptFormValues) {
    const docName = props.selectedDocument?.name;
    if (props.mode === "edit" && typeof docName === "string") {
      await props.onUpdate({ name: docName, values });
      return;
    }
    await props.onCreate(values);
  }

  const docName = typeof props.selectedDocument?.name === "string" ? props.selectedDocument.name : "";

  return (
    <Drawer open={props.open} width={880} title={title} onClose={props.onClose} destroyOnHidden>
      <PurchaseReceiptForm
        initialValues={purchaseReceiptValuesFromDoc(
          props.mode === "create" ? null : props.selectedDocument,
        )}
        mode={props.mode}
        saving={props.saving}
        submitting={props.submitting}
        error={props.error}
        selectedDocument={props.selectedDocument}
        masterLoading={props.masterLoading}
        purchaseOrders={props.purchaseOrders}
        suppliers={props.suppliers}
        companies={props.companies}
        warehouses={props.warehouses}
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
