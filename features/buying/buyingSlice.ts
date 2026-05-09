import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  BuyingDocument,
  BuyingMode,
  BuyingModule,
  MaterialRequestFormValues,
  MasterDataState,
  PurchaseInvoiceFormValues,
  PurchaseOrderFormValues,
  PurchaseReceiptFormValues,
  UpdateBuyingDocumentPayload,
} from "./buyingTypes";
import {
  createMaterialRequestRequest,
  createPurchaseInvoiceRequest,
  createPurchaseOrderRequest,
  createPurchaseReceiptRequest,
  getCompaniesRequest,
  getItemsRequest,
  getMaterialRequestRequest,
  getMaterialRequestsRequest,
  getPriceListsRequest,
  getPurchaseInvoiceRequest,
  getPurchaseInvoicesRequest,
  getPurchaseOrderRequest,
  getPurchaseOrdersRequest,
  getPurchaseReceiptRequest,
  getPurchaseReceiptsRequest,
  getSuppliersRequest,
  getTaxTemplatesRequest,
  getUomsRequest,
  getWarehousesRequest,
  submitMaterialRequestRequest,
  submitPurchaseInvoiceRequest,
  submitPurchaseOrderRequest,
  submitPurchaseReceiptRequest,
  updateMaterialRequestRequest,
  updatePurchaseInvoiceRequest,
  updatePurchaseOrderRequest,
  updatePurchaseReceiptRequest,
} from "@/lib/api";

export type BuyingState = {
  materialRequests: BuyingDocument[];
  purchaseOrders: BuyingDocument[];
  purchaseReceipts: BuyingDocument[];
  purchaseInvoices: BuyingDocument[];

  selectedDocument: BuyingDocument | null;

  drawerOpen: boolean;

  currentModule: BuyingModule;

  mode: BuyingMode;

  loading: boolean;
  saving: boolean;
  submitting: boolean;

  error: string | null;

  search: string;

  masterData: MasterDataState;
  masterLoading: boolean;
};

const initialMasterData: MasterDataState = {
  items: [],
  warehouses: [],
  companies: [],
  uoms: [],
  suppliers: [],
  taxTemplates: [],
  priceLists: [],
};

const initialState: BuyingState = {
  materialRequests: [],
  purchaseOrders: [],
  purchaseReceipts: [],
  purchaseInvoices: [],
  selectedDocument: null,
  drawerOpen: false,
  currentModule: "material-request",
  mode: "create",
  loading: false,
  saving: false,
  submitting: false,
  error: null,
  search: "",
  masterData: initialMasterData,
  masterLoading: false,
};

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const responseData = error.response.data as
      | { message?: string; error?: string; exc?: string }
      | undefined;

    return (
      responseData?.error ??
      responseData?.message ??
      "Unable to complete the buying request."
    );
  }

  return error instanceof Error ? error.message : "Unable to complete the buying request.";
}

function toDocArray(value: unknown) {
  if (Array.isArray(value)) {
    return value as BuyingDocument[];
  }
  return [];
}

function toOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

export function buildMaterialRequestResourcePayload(values: MaterialRequestFormValues) {
  return {
    material_request_type: values.materialRequestType,
    transaction_date: values.scheduleDate || todayISODate(),
    schedule_date: values.scheduleDate,
    company: values.company,
    set_warehouse: values.setWarehouse,
    description: values.remarks,
    items: values.items.map((row) => ({
      item_code: row.itemCode,
      item_variant: row.variant || undefined,
      qty: row.qty,
      stock_uom: row.uom,
      uom: row.uom,
    })),
  };
}

export function buildPurchaseOrderResourcePayload(values: PurchaseOrderFormValues) {
  const mr = values.materialRequest.trim();
  return {
    supplier: values.supplier,
    company: values.company,
    transaction_date: values.transactionDate,
    schedule_date: values.scheduleDate,
    taxes_and_charges: values.taxesAndChargesTemplate,
    items: values.items.map((row) => ({
      item_code: row.itemCode,
      qty: row.qty,
      rate: row.rate,
      warehouse: row.warehouse,
      amount: row.amount > 0 ? row.amount : row.qty * row.rate,
      ...(mr ? { material_request: mr } : {}),
    })),
  };
}

export function buildPurchaseReceiptResourcePayload(values: PurchaseReceiptFormValues) {
  return {
    supplier: values.supplier,
    company: values.company,
    posting_date: values.postingDate,
    set_warehouse: values.setWarehouse,
    purchase_order: values.purchaseOrder,
    items: values.items.map((row) => ({
      item_code: row.itemCode,
      qty: row.qtyReceived,
      valuation_rate: row.actualRate,
      batch_no: row.batch.trim() ? row.batch : undefined,
      warehouse: row.warehouse,
    })),
  };
}

export function buildPurchaseInvoiceResourcePayload(values: PurchaseInvoiceFormValues) {
  const pr = values.purchaseReceipt.trim();
  return {
    supplier: values.supplier,
    company: values.company,
    bill_no: values.billNo,
    bill_date: values.billDate,
    posting_date: values.billDate,
    taxes_and_charges: values.taxesAndChargesTemplate,
    items: values.items.map((row) => ({
      item_code: row.itemCode,
      qty: row.qty,
      rate: row.rate,
      amount: row.amount > 0 ? row.amount : row.qty * row.rate,
      ...(pr ? { purchase_receipt: pr } : {}),
    })),
  };
}

export function materialRequestValuesFromDoc(
  doc: BuyingDocument | null,
): MaterialRequestFormValues {
  if (!doc) {
    return {
      materialRequestType: "Purchase",
      scheduleDate: todayISODate(),
      company: "",
      setWarehouse: "",
      remarks: "",
      items: [{ itemCode: "", variant: "", qty: 1, uom: "" }],
    };
  }

  const itemsRaw = toDocArray(doc.items);
  return {
    materialRequestType: toOptionalString(doc.material_request_type) || "Purchase",
    scheduleDate: toOptionalString(doc.schedule_date) || toOptionalString(doc.transaction_date),
    company: toOptionalString(doc.company),
    setWarehouse: toOptionalString(doc.set_warehouse),
    remarks: toOptionalString(doc.description) || toOptionalString(doc.remarks),
    items:
      itemsRaw.length > 0
        ? itemsRaw.map((row) => ({
            itemCode: toOptionalString(row.item_code),
            variant: toOptionalString(row.item_variant),
            qty: toNumber(row.qty),
            uom: toOptionalString(row.stock_uom) || toOptionalString(row.uom),
          }))
        : [{ itemCode: "", variant: "", qty: 1, uom: "" }],
  };
}

export function purchaseOrderValuesFromDoc(doc: BuyingDocument | null): PurchaseOrderFormValues {
  if (!doc) {
    return {
      materialRequest: "",
      supplier: "",
      company: "",
      transactionDate: todayISODate(),
      scheduleDate: todayISODate(),
      taxesAndChargesTemplate: "",
      items: [{ itemCode: "", qty: 1, rate: 0, warehouse: "", amount: 0 }],
    };
  }

  const itemsRaw = toDocArray(doc.items);
  const firstMr =
    itemsRaw.length > 0 ? toOptionalString(itemsRaw[0].material_request) : "";
  return {
    materialRequest: firstMr,
    supplier: toOptionalString(doc.supplier),
    company: toOptionalString(doc.company),
    transactionDate: toOptionalString(doc.transaction_date),
    scheduleDate: toOptionalString(doc.schedule_date),
    taxesAndChargesTemplate: toOptionalString(doc.taxes_and_charges),
    items:
      itemsRaw.length > 0
        ? itemsRaw.map((row) => ({
            itemCode: toOptionalString(row.item_code),
            qty: toNumber(row.qty),
            rate: toNumber(row.rate),
            warehouse: toOptionalString(row.warehouse),
            amount: toNumber(row.amount),
          }))
        : [{ itemCode: "", qty: 1, rate: 0, warehouse: "", amount: 0 }],
  };
}

export function purchaseReceiptValuesFromDoc(
  doc: BuyingDocument | null,
): PurchaseReceiptFormValues {
  if (!doc) {
    return {
      purchaseOrder: "",
      supplier: "",
      company: "",
      postingDate: todayISODate(),
      setWarehouse: "",
      items: [{ itemCode: "", qtyReceived: 1, actualRate: 0, batch: "", warehouse: "" }],
    };
  }

  const itemsRaw = toDocArray(doc.items);
  return {
    purchaseOrder: toOptionalString(doc.purchase_order),
    supplier: toOptionalString(doc.supplier),
    company: toOptionalString(doc.company),
    postingDate: toOptionalString(doc.posting_date),
    setWarehouse: toOptionalString(doc.set_warehouse),
    items:
      itemsRaw.length > 0
        ? itemsRaw.map((row) => ({
            itemCode: toOptionalString(row.item_code),
            qtyReceived: toNumber(row.qty),
            actualRate: toNumber(row.valuation_rate) || toNumber(row.rate),
            batch: toOptionalString(row.batch_no),
            warehouse: toOptionalString(row.warehouse),
          }))
        : [{ itemCode: "", qtyReceived: 1, actualRate: 0, batch: "", warehouse: "" }],
  };
}

export function purchaseInvoiceValuesFromDoc(
  doc: BuyingDocument | null,
): PurchaseInvoiceFormValues {
  if (!doc) {
    return {
      purchaseReceipt: "",
      supplier: "",
      company: "",
      billNo: "",
      billDate: todayISODate(),
      taxesAndChargesTemplate: "",
      items: [{ itemCode: "", qty: 1, rate: 0, amount: 0 }],
    };
  }

  const itemsRaw = toDocArray(doc.items);
  const firstPr =
    itemsRaw.length > 0 ? toOptionalString(itemsRaw[0].purchase_receipt) : "";
  return {
    purchaseReceipt: firstPr,
    supplier: toOptionalString(doc.supplier),
    company: toOptionalString(doc.company),
    billNo: toOptionalString(doc.bill_no),
    billDate: toOptionalString(doc.bill_date),
    taxesAndChargesTemplate: toOptionalString(doc.taxes_and_charges),
    items:
      itemsRaw.length > 0
        ? itemsRaw.map((row) => ({
            itemCode: toOptionalString(row.item_code),
            qty: toNumber(row.qty),
            rate: toNumber(row.rate),
            amount: toNumber(row.amount),
          }))
        : [{ itemCode: "", qty: 1, rate: 0, amount: 0 }],
  };
}

export const fetchBuyingMasterData = createAsyncThunk<
  MasterDataState,
  void,
  { rejectValue: string }
>("buying/fetchBuyingMasterData", async (_, { rejectWithValue }) => {
  try {
    const [
      items,
      warehouses,
      companies,
      uoms,
      suppliers,
      taxTemplates,
      priceLists,
    ] = await Promise.all([
      getItemsRequest(),
      getWarehousesRequest(),
      getCompaniesRequest(),
      getUomsRequest(),
      getSuppliersRequest(),
      getTaxTemplatesRequest(),
      getPriceListsRequest(),
    ]);

    return {
      items: items as BuyingDocument[],
      warehouses: warehouses as BuyingDocument[],
      companies: companies as BuyingDocument[],
      uoms: uoms as BuyingDocument[],
      suppliers: suppliers as BuyingDocument[],
      taxTemplates: taxTemplates as BuyingDocument[],
      priceLists: priceLists as BuyingDocument[],
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchBuyingDocument = createAsyncThunk<
  BuyingDocument,
  { name: string; mode: BuyingMode },
  { rejectValue: string; state: { buying: BuyingState } }
>("buying/fetchBuyingDocument", async ({ name }, { getState, rejectWithValue }) => {
  const mod = getState().buying.currentModule;
  try {
    switch (mod) {
      case "material-request":
        return (await getMaterialRequestRequest(name)) as BuyingDocument;
      case "purchase-order":
        return (await getPurchaseOrderRequest(name)) as BuyingDocument;
      case "purchase-receipt":
        return (await getPurchaseReceiptRequest(name)) as BuyingDocument;
      case "purchase-invoice":
        return (await getPurchaseInvoiceRequest(name)) as BuyingDocument;
      default:
        return rejectWithValue("Unknown buying module.");
    }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchMaterialRequests = createAsyncThunk<
  BuyingDocument[],
  void,
  { rejectValue: string }
>("buying/fetchMaterialRequests", async (_, { rejectWithValue }) => {
  try {
    return (await getMaterialRequestsRequest()) as BuyingDocument[];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createMaterialRequest = createAsyncThunk<
  BuyingDocument,
  MaterialRequestFormValues,
  { rejectValue: string }
>("buying/createMaterialRequest", async (values, { rejectWithValue }) => {
  try {
    return (await createMaterialRequestRequest(
      buildMaterialRequestResourcePayload(values),
    )) as BuyingDocument;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateMaterialRequest = createAsyncThunk<
  BuyingDocument,
  UpdateBuyingDocumentPayload,
  { rejectValue: string }
>("buying/updateMaterialRequest", async ({ name, values }, { rejectWithValue }) => {
  try {
    return (await updateMaterialRequestRequest(
      name,
      buildMaterialRequestResourcePayload(values as MaterialRequestFormValues),
    )) as BuyingDocument;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const submitMaterialRequest = createAsyncThunk<
  unknown,
  string,
  { rejectValue: string }
>("buying/submitMaterialRequest", async (name, { rejectWithValue }) => {
  try {
    return await submitMaterialRequestRequest(name);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchPurchaseOrders = createAsyncThunk<
  BuyingDocument[],
  void,
  { rejectValue: string }
>("buying/fetchPurchaseOrders", async (_, { rejectWithValue }) => {
  try {
    return (await getPurchaseOrdersRequest()) as BuyingDocument[];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createPurchaseOrder = createAsyncThunk<
  BuyingDocument,
  PurchaseOrderFormValues,
  { rejectValue: string }
>("buying/createPurchaseOrder", async (values, { rejectWithValue }) => {
  try {
    return (await createPurchaseOrderRequest(
      buildPurchaseOrderResourcePayload(values),
    )) as BuyingDocument;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updatePurchaseOrder = createAsyncThunk<
  BuyingDocument,
  UpdateBuyingDocumentPayload,
  { rejectValue: string }
>("buying/updatePurchaseOrder", async ({ name, values }, { rejectWithValue }) => {
  try {
    return (await updatePurchaseOrderRequest(
      name,
      buildPurchaseOrderResourcePayload(values as PurchaseOrderFormValues),
    )) as BuyingDocument;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const submitPurchaseOrder = createAsyncThunk<
  unknown,
  string,
  { rejectValue: string }
>("buying/submitPurchaseOrder", async (name, { rejectWithValue }) => {
  try {
    return await submitPurchaseOrderRequest(name);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchPurchaseReceipts = createAsyncThunk<
  BuyingDocument[],
  void,
  { rejectValue: string }
>("buying/fetchPurchaseReceipts", async (_, { rejectWithValue }) => {
  try {
    return (await getPurchaseReceiptsRequest()) as BuyingDocument[];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createPurchaseReceipt = createAsyncThunk<
  BuyingDocument,
  PurchaseReceiptFormValues,
  { rejectValue: string }
>("buying/createPurchaseReceipt", async (values, { rejectWithValue }) => {
  try {
    return (await createPurchaseReceiptRequest(
      buildPurchaseReceiptResourcePayload(values),
    )) as BuyingDocument;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updatePurchaseReceipt = createAsyncThunk<
  BuyingDocument,
  UpdateBuyingDocumentPayload,
  { rejectValue: string }
>("buying/updatePurchaseReceipt", async ({ name, values }, { rejectWithValue }) => {
  try {
    return (await updatePurchaseReceiptRequest(
      name,
      buildPurchaseReceiptResourcePayload(values as PurchaseReceiptFormValues),
    )) as BuyingDocument;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const submitPurchaseReceipt = createAsyncThunk<
  unknown,
  string,
  { rejectValue: string }
>("buying/submitPurchaseReceipt", async (name, { rejectWithValue }) => {
  try {
    return await submitPurchaseReceiptRequest(name);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchPurchaseInvoices = createAsyncThunk<
  BuyingDocument[],
  void,
  { rejectValue: string }
>("buying/fetchPurchaseInvoices", async (_, { rejectWithValue }) => {
  try {
    return (await getPurchaseInvoicesRequest()) as BuyingDocument[];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createPurchaseInvoice = createAsyncThunk<
  BuyingDocument,
  PurchaseInvoiceFormValues,
  { rejectValue: string }
>("buying/createPurchaseInvoice", async (values, { rejectWithValue }) => {
  try {
    return (await createPurchaseInvoiceRequest(
      buildPurchaseInvoiceResourcePayload(values),
    )) as BuyingDocument;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updatePurchaseInvoice = createAsyncThunk<
  BuyingDocument,
  UpdateBuyingDocumentPayload,
  { rejectValue: string }
>("buying/updatePurchaseInvoice", async ({ name, values }, { rejectWithValue }) => {
  try {
    return (await updatePurchaseInvoiceRequest(
      name,
      buildPurchaseInvoiceResourcePayload(values as PurchaseInvoiceFormValues),
    )) as BuyingDocument;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const submitPurchaseInvoice = createAsyncThunk<
  unknown,
  string,
  { rejectValue: string }
>("buying/submitPurchaseInvoice", async (name, { rejectWithValue }) => {
  try {
    return await submitPurchaseInvoiceRequest(name);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

function upsertDoc(list: BuyingDocument[], doc: BuyingDocument) {
  const name = toOptionalString(doc.name);
  if (!name) {
    return [doc, ...list];
  }
  const index = list.findIndex((row) => toOptionalString(row.name) === name);
  if (index === -1) {
    return [doc, ...list];
  }
  const next = [...list];
  next[index] = { ...next[index], ...doc };
  return next;
}

const buyingSlice = createSlice({
  name: "buying",
  initialState,
  reducers: {
    openCreateDrawer(state) {
      state.drawerOpen = true;
      state.mode = "create";
      state.selectedDocument = null;
      state.error = null;
    },
    openEditDrawer(state, action: PayloadAction<BuyingDocument>) {
      state.drawerOpen = true;
      state.mode = "edit";
      state.selectedDocument = action.payload;
      state.error = null;
    },
    openViewDrawer(state, action: PayloadAction<BuyingDocument>) {
      state.drawerOpen = true;
      state.mode = "view";
      state.selectedDocument = action.payload;
      state.error = null;
    },
    closeDrawer(state) {
      state.drawerOpen = false;
      state.selectedDocument = null;
      state.error = null;
    },
    setCurrentModule(state, action: PayloadAction<BuyingModule>) {
      state.currentModule = action.payload;
      state.search = "";
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuyingMasterData.pending, (state) => {
        state.masterLoading = true;
        state.error = null;
      })
      .addCase(fetchBuyingMasterData.fulfilled, (state, action) => {
        state.masterLoading = false;
        state.masterData = action.payload;
      })
      .addCase(fetchBuyingMasterData.rejected, (state, action) => {
        state.masterLoading = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to load master data.";
      })
      .addCase(fetchBuyingDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuyingDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDocument = action.payload;
        state.drawerOpen = true;
        state.mode = action.meta.arg.mode;
      })
      .addCase(fetchBuyingDocument.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to load the document.";
      })
      .addCase(fetchMaterialRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterialRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.materialRequests = action.payload;
      })
      .addCase(fetchMaterialRequests.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to load material requests.";
      })
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders = action.payload;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to load purchase orders.";
      })
      .addCase(fetchPurchaseReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseReceipts = action.payload;
      })
      .addCase(fetchPurchaseReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to load purchase receipts.";
      })
      .addCase(fetchPurchaseInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseInvoices = action.payload;
      })
      .addCase(fetchPurchaseInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to load purchase invoices.";
      })
      .addCase(createMaterialRequest.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createMaterialRequest.fulfilled, (state, action) => {
        state.saving = false;
        state.materialRequests = upsertDoc(state.materialRequests, action.payload);
        state.drawerOpen = false;
        state.selectedDocument = action.payload;
      })
      .addCase(createMaterialRequest.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to create material request.";
      })
      .addCase(updateMaterialRequest.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateMaterialRequest.fulfilled, (state, action) => {
        state.saving = false;
        state.materialRequests = upsertDoc(state.materialRequests, action.payload);
        state.drawerOpen = false;
        state.selectedDocument = action.payload;
      })
      .addCase(updateMaterialRequest.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to update material request.";
      })
      .addCase(createPurchaseOrder.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.saving = false;
        state.purchaseOrders = upsertDoc(state.purchaseOrders, action.payload);
        state.drawerOpen = false;
        state.selectedDocument = action.payload;
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to create purchase order.";
      })
      .addCase(updatePurchaseOrder.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        state.saving = false;
        state.purchaseOrders = upsertDoc(state.purchaseOrders, action.payload);
        state.drawerOpen = false;
        state.selectedDocument = action.payload;
      })
      .addCase(updatePurchaseOrder.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to update purchase order.";
      })
      .addCase(createPurchaseReceipt.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createPurchaseReceipt.fulfilled, (state, action) => {
        state.saving = false;
        state.purchaseReceipts = upsertDoc(state.purchaseReceipts, action.payload);
        state.drawerOpen = false;
        state.selectedDocument = action.payload;
      })
      .addCase(createPurchaseReceipt.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to create purchase receipt.";
      })
      .addCase(updatePurchaseReceipt.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updatePurchaseReceipt.fulfilled, (state, action) => {
        state.saving = false;
        state.purchaseReceipts = upsertDoc(state.purchaseReceipts, action.payload);
        state.drawerOpen = false;
        state.selectedDocument = action.payload;
      })
      .addCase(updatePurchaseReceipt.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to update purchase receipt.";
      })
      .addCase(createPurchaseInvoice.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createPurchaseInvoice.fulfilled, (state, action) => {
        state.saving = false;
        state.purchaseInvoices = upsertDoc(state.purchaseInvoices, action.payload);
        state.drawerOpen = false;
        state.selectedDocument = action.payload;
      })
      .addCase(createPurchaseInvoice.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to create purchase invoice.";
      })
      .addCase(updatePurchaseInvoice.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updatePurchaseInvoice.fulfilled, (state, action) => {
        state.saving = false;
        state.purchaseInvoices = upsertDoc(state.purchaseInvoices, action.payload);
        state.drawerOpen = false;
        state.selectedDocument = action.payload;
      })
      .addCase(updatePurchaseInvoice.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to update purchase invoice.";
      })
      .addCase(submitMaterialRequest.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitMaterialRequest.fulfilled, (state) => {
        state.submitting = false;
        state.drawerOpen = false;
        state.selectedDocument = null;
      })
      .addCase(submitMaterialRequest.rejected, (state, action) => {
        state.submitting = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to submit material request.";
      })
      .addCase(submitPurchaseOrder.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitPurchaseOrder.fulfilled, (state) => {
        state.submitting = false;
        state.drawerOpen = false;
        state.selectedDocument = null;
      })
      .addCase(submitPurchaseOrder.rejected, (state, action) => {
        state.submitting = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to submit purchase order.";
      })
      .addCase(submitPurchaseReceipt.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitPurchaseReceipt.fulfilled, (state) => {
        state.submitting = false;
        state.drawerOpen = false;
        state.selectedDocument = null;
      })
      .addCase(submitPurchaseReceipt.rejected, (state, action) => {
        state.submitting = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to submit purchase receipt.";
      })
      .addCase(submitPurchaseInvoice.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitPurchaseInvoice.fulfilled, (state) => {
        state.submitting = false;
        state.drawerOpen = false;
        state.selectedDocument = null;
      })
      .addCase(submitPurchaseInvoice.rejected, (state, action) => {
        state.submitting = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to submit purchase invoice.";
      });
  },
});

export const {
  openCreateDrawer,
  openEditDrawer,
  openViewDrawer,
  closeDrawer,
  setCurrentModule,
  setSearch,
  clearError,
} = buyingSlice.actions;

export default buyingSlice.reducer;
