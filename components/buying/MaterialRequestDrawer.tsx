"use client";

import { Drawer } from "antd";

import MaterialRequestForm from "./MaterialRequestForm";
import { materialRequestValuesFromDoc } from "@/features/buying/buyingSlice";
import type { BuyingDocument } from "@/features/buying/buyingTypes";
import type { BuyingMode } from "@/features/buying/buyingTypes";
import type { MaterialRequestFormValues } from "@/features/buying/buyingTypes";

type MaterialRequestDrawerProps = {
  open: boolean;
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
  onClose: () => void;
  onEdit: () => void;
  onCreate: (values: MaterialRequestFormValues) => Promise<unknown>;
  onUpdate: (payload: { name: string; values: MaterialRequestFormValues }) => Promise<unknown>;
  onSubmitDocument: (name: string) => Promise<unknown>;
};

export default function MaterialRequestDrawer({
  open,
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
  onClose,
  onEdit,
  onCreate,
  onUpdate,
  onSubmitDocument,
}: MaterialRequestDrawerProps) {
  const title =
    mode === "create"
      ? "New Material Request"
      : mode === "edit"
        ? "Edit Material Request"
        : "Material Request";

  async function handleFinish(values: MaterialRequestFormValues) {
    const docName = selectedDocument?.name;
    if (mode === "edit" && typeof docName === "string") {
      await onUpdate({ name: docName, values });
      return;
    }
    await onCreate(values);
  }

  const docName = typeof selectedDocument?.name === "string" ? selectedDocument.name : "";

  return (
    <Drawer open={open} size={720} title={title} onClose={onClose} destroyOnHidden>
      <MaterialRequestForm
        initialValues={materialRequestValuesFromDoc(
          mode === "create" ? null : selectedDocument,
        )}
        mode={mode}
        saving={saving}
        submitting={submitting}
        error={error}
        selectedDocument={selectedDocument}
        masterLoading={masterLoading}
        companies={companies}
        warehouses={warehouses}
        items={items}
        uoms={uoms}
        onEdit={onEdit}
        onSubmit={handleFinish}
        onSubmitToErpNext={
          docName
            ? async () => {
                await onSubmitDocument(docName);
              }
            : undefined
        }
        onCancel={onClose}
      />
    </Drawer>
  );
}
