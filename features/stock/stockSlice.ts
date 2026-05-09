import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type {
  CreateItemPricePayload,
  StockItem,
  StockItemFormValues,
  StockItemListItem,
  StockItemResourcePayload,
  StockMode,
  UpdateStockItemThunkPayload,
} from "./stockTypes";
import {
  createItemPriceRequest,
  createStockItemRequest,
  getItemPricesRequest,
  getStockItemsRequest,
  updateStockItemRequest,
} from "@/lib/api";

type StockState = {
  items: StockItem[];
  selectedItem: StockItem | null;
  drawerOpen: boolean;
  mode: StockMode;
  loading: boolean;
  saving: boolean;
  error: string | null;
  search: string;
};

const initialState: StockState = {
  items: [],
  selectedItem: null,
  drawerOpen: false,
  mode: "create",
  loading: false,
  saving: false,
  error: null,
  search: "",
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
      "Unable to complete the stock request."
    );
  }

  return error instanceof Error ? error.message : "Unable to complete the stock request.";
}

function toBoolean(value: unknown) {
  return value === true || value === 1 || value === "1";
}

function toStringValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function toNumberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeStockItem(
  source: Partial<StockItemListItem> &
    Partial<Pick<StockItem, "description" | "selling_price">>,
) {
  const code = toStringValue(source.item_code, toStringValue(source.name));
  const name = toStringValue(source.name, code);

  return {
    name,
    item_name: toStringValue(source.item_name, code),
    item_code: code,
    item_group: toStringValue(source.item_group, "All Item Groups"),
    brand: toStringValue(source.brand) || null,
    stock_uom: toStringValue(source.stock_uom, "Nos"),
    maintain_stock: toBoolean(source.is_stock_item),
    has_variants: toBoolean(source.has_variants),
    has_batch_no: toBoolean(source.has_batch_no),
    disabled: toBoolean(source.disabled),
    description:
      typeof source.description === "string" && source.description.trim()
        ? source.description.trim()
        : null,
    selling_price: toNumberValue(source.selling_price),
  };
}

function buildStockItemPayload(values: StockItemFormValues): StockItemResourcePayload {
  return {
    item_name: values.itemName.trim(),
    item_code: values.itemCode?.trim() || undefined,
    item_group: values.itemGroup.trim(),
    brand: values.brand?.trim() || undefined,
    stock_uom: values.stockUom.trim(),
    description: values.description?.trim() || undefined,
    is_stock_item: values.maintainStock,
    has_variants: values.hasVariants,
    has_batch_no: values.enableBatchTracking,
    disabled: values.disabled ?? false,
  };
}

function buildItemPricePayload(
  itemCode: string,
  sellingPrice: number | undefined,
): CreateItemPricePayload | null {
  if (typeof sellingPrice !== "number" || Number.isNaN(sellingPrice)) {
    return null;
  }

  return {
    item_code: itemCode,
    price_list_rate: sellingPrice,
    price_list: "Standard Selling",
    currency: "INR",
  };
}

function mergeFormValuesIntoItem(
  source: Partial<StockItem>,
  values: StockItemFormValues,
): StockItem {
  return normalizeStockItem({
    ...source,
    item_name: values.itemName,
    item_code: values.itemCode || source.item_code || source.name,
    item_group: values.itemGroup,
    brand: values.brand,
    stock_uom: values.stockUom,
    description: values.description,
    is_stock_item: values.maintainStock,
    has_variants: values.hasVariants,
    has_batch_no: values.enableBatchTracking,
    disabled: values.disabled ?? false,
    selling_price: values.sellingPrice,
  });
}

export const createItemSellingPrice = createAsyncThunk<
  Record<string, unknown>,
  CreateItemPricePayload,
  { rejectValue: string }
>("stock/createItemSellingPrice", async (payload, { rejectWithValue }) => {
  try {
    return await createItemPriceRequest(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchStockItems = createAsyncThunk<
  StockItem[],
  void,
  { rejectValue: string }
>("stock/fetchStockItems", async (_, { rejectWithValue }) => {
  try {
    const response = await getStockItemsRequest();
    return response.map((item) => normalizeStockItem(item));
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createStockItem = createAsyncThunk<
  StockItem,
  StockItemFormValues,
  { rejectValue: string }
>("stock/createStockItem", async (values, { dispatch, rejectWithValue }) => {
  try {
    const createdItemResponse = await createStockItemRequest(buildStockItemPayload(values));
    const createdItem = mergeFormValuesIntoItem(createdItemResponse, values);
    const itemPricePayload = buildItemPricePayload(
      createdItem.item_code,
      values.sellingPrice,
    );

    if (itemPricePayload) {
      await dispatch(createItemSellingPrice(itemPricePayload)).unwrap();
    }

    return createdItem;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateStockItem = createAsyncThunk<
  StockItem,
  UpdateStockItemThunkPayload,
  { rejectValue: string }
>("stock/updateStockItem", async ({ name, values }, { dispatch, rejectWithValue }) => {
  try {
    const updatedItemResponse = await updateStockItemRequest(
      name,
      buildStockItemPayload(values),
    );
    const updatedItem = mergeFormValuesIntoItem(
      {
        ...updatedItemResponse,
        name,
      },
      values,
    );
    const itemPricePayload = buildItemPricePayload(
      updatedItem.item_code,
      values.sellingPrice,
    );

    if (itemPricePayload) {
      const existingPrices = await getItemPricesRequest(updatedItem.item_code);

      if (existingPrices.length === 0) {
        await dispatch(createItemSellingPrice(itemPricePayload)).unwrap();
      }

      // TODO: Update the existing ERPNext Item Price record when the exact pricing flow is finalized.
    }

    return updatedItem;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    openCreateDrawer(state) {
      state.drawerOpen = true;
      state.mode = "create";
      state.selectedItem = null;
      state.error = null;
    },
    openEditDrawer(state, action: PayloadAction<StockItem>) {
      state.drawerOpen = true;
      state.mode = "edit";
      state.selectedItem = action.payload;
      state.error = null;
    },
    openViewDrawer(state, action: PayloadAction<StockItem>) {
      state.drawerOpen = true;
      state.mode = "view";
      state.selectedItem = action.payload;
      state.error = null;
    },
    closeDrawer(state) {
      state.drawerOpen = false;
      state.selectedItem = null;
      state.error = null;
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
      .addCase(fetchStockItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStockItems.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to load stock items.";
      })
      .addCase(createStockItem.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createStockItem.fulfilled, (state, action) => {
        state.saving = false;
        state.items = [action.payload, ...state.items];
        state.drawerOpen = false;
        state.selectedItem = action.payload;
      })
      .addCase(createStockItem.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to create the item.";
      })
      .addCase(updateStockItem.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateStockItem.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.map((item) =>
          item.name === action.payload.name ? action.payload : item,
        );
        state.drawerOpen = false;
        state.selectedItem = action.payload;
      })
      .addCase(updateStockItem.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? action.error.message ?? "Unable to update the item.";
      });
  },
});

export const {
  openCreateDrawer,
  openEditDrawer,
  openViewDrawer,
  closeDrawer,
  setSearch,
  clearError,
} = stockSlice.actions;

export default stockSlice.reducer;
