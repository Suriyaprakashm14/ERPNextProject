export type BuyingModule =
  | "material-request"
  | "purchase-order"
  | "purchase-receipt"
  | "purchase-invoice";

export type BuyingMode = "create" | "edit" | "view";

export type BuyingDocument = Record<string, unknown>;

export type MaterialRequestItemFormRow = {
  itemCode: string;
  variant: string;
  qty: number;
  uom: string;
};

export type MaterialRequestFormValues = {
  materialRequestType: string;
  scheduleDate: string;
  company: string;
  setWarehouse: string;
  remarks: string;
  items: MaterialRequestItemFormRow[];
};

export type PurchaseOrderItemFormRow = {
  itemCode: string;
  qty: number;
  rate: number;
  warehouse: string;
  amount: number;
};

export type PurchaseOrderFormValues = {
  materialRequest: string;
  supplier: string;
  company: string;
  transactionDate: string;
  scheduleDate: string;
  taxesAndChargesTemplate: string;
  items: PurchaseOrderItemFormRow[];
};

export type PurchaseReceiptItemFormRow = {
  itemCode: string;
  qtyReceived: number;
  actualRate: number;
  batch: string;
  warehouse: string;
};

export type PurchaseReceiptFormValues = {
  purchaseOrder: string;
  supplier: string;
  company: string;
  postingDate: string;
  setWarehouse: string;
  items: PurchaseReceiptItemFormRow[];
};

export type PurchaseInvoiceItemFormRow = {
  itemCode: string;
  qty: number;
  rate: number;
  amount: number;
};

export type PurchaseInvoiceFormValues = {
  purchaseReceipt: string;
  supplier: string;
  company: string;
  billNo: string;
  billDate: string;
  taxesAndChargesTemplate: string;
  items: PurchaseInvoiceItemFormRow[];
};

export type MasterDataState = {
  items: BuyingDocument[];
  warehouses: BuyingDocument[];
  companies: BuyingDocument[];
  uoms: BuyingDocument[];
  suppliers: BuyingDocument[];
  taxTemplates: BuyingDocument[];
  priceLists: BuyingDocument[];
};

export type UpdateBuyingDocumentPayload = {
  name: string;
  values:
    | MaterialRequestFormValues
    | PurchaseOrderFormValues
    | PurchaseReceiptFormValues
    | PurchaseInvoiceFormValues;
};
