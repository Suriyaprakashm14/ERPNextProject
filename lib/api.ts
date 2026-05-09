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

export default api;
