import axios from "axios";

import type {
  CreateItemPricePayload,
  StockItem,
  StockItemListItem,
  StockItemResourcePayload,
} from "@/features/stock/stockTypes";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

type ErpNextListResponse<T> = {
  data: T[];
};

type ErpNextDocumentResponse<T> = {
  data: T;
};

export async function getStockItemsRequest() {
  const response = await api.get<ErpNextListResponse<StockItemListItem>>(
    "/api/resource/Item",
    {
      params: {
        fields: JSON.stringify([
          "name",
          "item_name",
          "item_code",
          "item_group",
          "brand",
          "stock_uom",
          "is_stock_item",
          "has_variants",
          "has_batch_no",
          "disabled",
        ]),
      },
    },
  );

  return response.data.data;
}

export async function createStockItemRequest(payload: StockItemResourcePayload) {
  const response = await api.post<ErpNextDocumentResponse<Partial<StockItem>>>(
    "/api/resource/Item",
    payload,
  );

  return response.data.data;
}

export async function updateStockItemRequest(
  name: string,
  payload: StockItemResourcePayload,
) {
  const response = await api.put<ErpNextDocumentResponse<Partial<StockItem>>>(
    `/api/resource/Item/${encodeURIComponent(name)}`,
    payload,
  );

  return response.data.data;
}

export async function createItemPriceRequest(payload: CreateItemPricePayload) {
  const response = await api.post<ErpNextDocumentResponse<Record<string, unknown>>>(
    "/api/resource/Item%20Price",
    payload,
  );

  return response.data.data;
}

export async function getItemPricesRequest(itemCode: string) {
  const response = await api.get<ErpNextListResponse<Record<string, unknown>>>(
    "/api/resource/Item%20Price",
    {
      params: {
        fields: JSON.stringify([
          "name",
          "item_code",
          "price_list",
          "price_list_rate",
          "currency",
        ]),
        filters: JSON.stringify([["item_code", "=", itemCode]]),
      },
    },
  );

  return response.data.data;
}

type ErpNextListEnvelope<T> = {
  data: T[];
};

type ErpNextDocEnvelope<T> = {
  data: T;
};

function resourceDocTypePath(doctype: string) {
  return `/api/resource/${encodeURIComponent(doctype)}`;
}

export async function getMaterialRequestsRequest() {
  const response = await api.get<ErpNextListEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Material Request"),
    {
      params: {
        fields: JSON.stringify([
          "name",
          "transaction_date",
          "material_request_type",
          "status",
          "schedule_date",
        ]),
      },
    },
  );

  return response.data.data;
}

export async function getMaterialRequestRequest(name: string) {
  const response = await api.get<ErpNextDocEnvelope<Record<string, unknown>>>(
    `${resourceDocTypePath("Material Request")}/${encodeURIComponent(name)}`,
  );

  return response.data.data;
}

export async function createMaterialRequestRequest(payload: Record<string, unknown>) {
  const response = await api.post<ErpNextDocEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Material Request"),
    payload,
  );

  return response.data.data;
}

export async function updateMaterialRequestRequest(
  name: string,
  payload: Record<string, unknown>,
) {
  const response = await api.put<ErpNextDocEnvelope<Record<string, unknown>>>(
    `${resourceDocTypePath("Material Request")}/${encodeURIComponent(name)}`,
    payload,
  );

  return response.data.data;
}

export async function getPurchaseOrdersRequest() {
  const response = await api.get<ErpNextListEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Purchase Order"),
    {
      params: {
        fields: JSON.stringify(["name", "transaction_date", "status", "schedule_date"]),
      },
    },
  );

  return response.data.data;
}

export async function getPurchaseOrderRequest(name: string) {
  const response = await api.get<ErpNextDocEnvelope<Record<string, unknown>>>(
    `${resourceDocTypePath("Purchase Order")}/${encodeURIComponent(name)}`,
  );

  return response.data.data;
}

export async function createPurchaseOrderRequest(payload: Record<string, unknown>) {
  const response = await api.post<ErpNextDocEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Purchase Order"),
    payload,
  );

  return response.data.data;
}

export async function updatePurchaseOrderRequest(
  name: string,
  payload: Record<string, unknown>,
) {
  const response = await api.put<ErpNextDocEnvelope<Record<string, unknown>>>(
    `${resourceDocTypePath("Purchase Order")}/${encodeURIComponent(name)}`,
    payload,
  );

  return response.data.data;
}

export async function getPurchaseReceiptsRequest() {
  const response = await api.get<ErpNextListEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Purchase Receipt"),
    {
      params: {
        fields: JSON.stringify(["name", "posting_date", "status"]),
      },
    },
  );

  return response.data.data;
}

export async function getPurchaseReceiptRequest(name: string) {
  const response = await api.get<ErpNextDocEnvelope<Record<string, unknown>>>(
    `${resourceDocTypePath("Purchase Receipt")}/${encodeURIComponent(name)}`,
  );

  return response.data.data;
}

export async function createPurchaseReceiptRequest(payload: Record<string, unknown>) {
  const response = await api.post<ErpNextDocEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Purchase Receipt"),
    payload,
  );

  return response.data.data;
}

export async function updatePurchaseReceiptRequest(
  name: string,
  payload: Record<string, unknown>,
) {
  const response = await api.put<ErpNextDocEnvelope<Record<string, unknown>>>(
    `${resourceDocTypePath("Purchase Receipt")}/${encodeURIComponent(name)}`,
    payload,
  );

  return response.data.data;
}

export async function getPurchaseInvoicesRequest() {
  const response = await api.get<ErpNextListEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Purchase Invoice"),
    {
      params: {
        fields: JSON.stringify(["name", "posting_date", "status", "bill_no", "bill_date"]),
      },
    },
  );

  return response.data.data;
}

export async function getPurchaseInvoiceRequest(name: string) {
  const response = await api.get<ErpNextDocEnvelope<Record<string, unknown>>>(
    `${resourceDocTypePath("Purchase Invoice")}/${encodeURIComponent(name)}`,
  );

  return response.data.data;
}

export async function createPurchaseInvoiceRequest(payload: Record<string, unknown>) {
  const response = await api.post<ErpNextDocEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Purchase Invoice"),
    payload,
  );

  return response.data.data;
}

export async function updatePurchaseInvoiceRequest(
  name: string,
  payload: Record<string, unknown>,
) {
  const response = await api.put<ErpNextDocEnvelope<Record<string, unknown>>>(
    `${resourceDocTypePath("Purchase Invoice")}/${encodeURIComponent(name)}`,
    payload,
  );

  return response.data.data;
}

export async function submitDocumentRequest(doctype: string, name: string) {
  const response = await api.post(`/api/method/frappe.client.submit`, {
    doc: {
      doctype,
      name,
    },
  });

  const payload = response.data as ErpNextDocEnvelope<unknown> | { data?: unknown };
  if ("data" in payload && payload.data !== undefined) {
    return payload.data;
  }

  return response.data;
}

export async function submitMaterialRequestRequest(name: string) {
  return submitDocumentRequest("Material Request", name);
}

export async function submitPurchaseOrderRequest(name: string) {
  return submitDocumentRequest("Purchase Order", name);
}

export async function submitPurchaseReceiptRequest(name: string) {
  return submitDocumentRequest("Purchase Receipt", name);
}

export async function submitPurchaseInvoiceRequest(name: string) {
  return submitDocumentRequest("Purchase Invoice", name);
}

export async function getItemsRequest() {
  const response = await api.get<ErpNextListEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Item"),
    {
      params: {
        fields: JSON.stringify([
          "name",
          "item_name",
          "item_code",
          "stock_uom",
          "item_group",
          "has_batch_no",
        ]),
        filters: JSON.stringify([["disabled", "=", 0]]),
      },
    },
  );

  return response.data.data;
}

export async function getWarehousesRequest() {
  const response = await api.get<ErpNextListEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Warehouse"),
    {
      params: {
        fields: JSON.stringify(["name", "warehouse_name", "is_group", "company"]),
        filters: JSON.stringify([["is_group", "=", 0]]),
      },
    },
  );

  return response.data.data;
}

export async function getCompaniesRequest() {
  const response = await api.get<ErpNextListEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Company"),
    {
      params: {
        fields: JSON.stringify(["name", "company_name"]),
      },
    },
  );

  return response.data.data;
}

export async function getUomsRequest() {
  const response = await api.get<ErpNextListEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("UOM"),
    {
      params: {
        fields: JSON.stringify(["name"]),
      },
    },
  );

  return response.data.data;
}

export async function getSuppliersRequest() {
  const response = await api.get<ErpNextListEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Supplier"),
    {
      params: {
        fields: JSON.stringify(["name", "supplier_name", "supplier_group", "disabled"]),
        filters: JSON.stringify([["disabled", "=", 0]]),
      },
    },
  );

  return response.data.data;
}

export async function getTaxTemplatesRequest() {
  const response = await api.get<ErpNextListEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Purchase Taxes and Charges Template"),
    {
      params: {
        fields: JSON.stringify(["name", "title", "company", "disabled"]),
        filters: JSON.stringify([["disabled", "=", 0]]),
      },
    },
  );

  return response.data.data;
}

export async function getPriceListsRequest() {
  const response = await api.get<ErpNextListEnvelope<Record<string, unknown>>>(
    resourceDocTypePath("Price List"),
    {
      params: {
        fields: JSON.stringify([
          "name",
          "price_list_name",
          "selling",
          "buying",
          "enabled",
        ]),
        filters: JSON.stringify([["enabled", "=", 1]]),
      },
    },
  );

  return response.data.data;
}

export default api;
