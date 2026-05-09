"use client";

import { Drawer } from "antd";

import PurchaseOrderForm from "./PurchaseOrderForm";
import { purchaseOrderValuesFromDoc } from "@/features/buying/buyingSlice";
import type { BuyingDocument } from "@/features/buying/buyingTypes";
import type { BuyingMode } from "@/features/buying/buyingTypes";
import type { PurchaseOrderFormValues } from "@/features/buying/buyingTypes";

type PurchaseOrderDrawerProps = {
  open: boolean;
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
  onClose: () => void;
  onEdit: () => void;
  onCreate: (values: PurchaseOrderFormValues) => Promise<unknown>;
  onUpdate: (payload: { name: string; values: PurchaseOrderFormValues }) => Promise<unknown>;
  onSubmitDocument: (name: string) => Promise<unknown>;
};

export default function PurchaseOrderDrawer(props: PurchaseOrderDrawerProps) {
  const title =
    props.mode === "create"
      ? "New Purchase Order"
      : props.mode === "edit"
        ? "Edit Purchase Order"
        : "Purchase Order";

  async function handleFinish(values: PurchaseOrderFormValues) {
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
      <PurchaseOrderForm
        initialValues={purchaseOrderValuesFromDoc(
          props.mode === "create" ? null : props.selectedDocument,
        )}
        mode={props.mode}
        saving={props.saving}
        submitting={props.submitting}
        error={props.error}
        selectedDocument={props.selectedDocument}
        masterLoading={props.masterLoading}
        materialRequests={props.materialRequests}
        suppliers={props.suppliers}
        companies={props.companies}
        warehouses={props.warehouses}
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
