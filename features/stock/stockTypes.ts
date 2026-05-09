export type StockItemListItem = {
  name?: string | null;
  item_name?: string | null;
  item_code?: string | null;
  item_group?: string | null;
  brand?: string | null;
  stock_uom?: string | null;
  is_stock_item?: boolean | number | null;
  has_variants?: boolean | number | null;
  has_batch_no?: boolean | number | null;
  disabled?: boolean | number | null;
};

export type StockItem = {
  name: string;
  item_name: string;
  item_code: string;
  item_group: string;
  brand: string | null;
  stock_uom: string;
  maintain_stock: boolean;
  has_variants: boolean;
  has_batch_no: boolean;
  disabled: boolean;
  description?: string | null;
  selling_price?: number | null;
};

export type StockMode = "create" | "edit" | "view";

export type StockItemFormValues = {
  itemName: string;
  itemCode?: string;
  itemGroup: string;
  brand?: string;
  stockUom: string;
  description?: string;
  category?: string;
  subcategory?: string;
  fabricType?: string;
  gender?: string;
  season?: string;
  pattern?: string;
  fitType?: string;
  sleeveType?: string;
  hasVariants: boolean;
  colors: string[];
  sizes: string[];
  styles: string[];
  buyingPrice?: number;
  mrp?: number;
  sellingPrice: number;
  minimumSellingPrice?: number;
  profitMargin?: number;
  taxTemplate?: string;
  autoGenerateBarcode: boolean;
  barcodePerVariant: boolean;
  manualBarcode?: string;
  enableBatchTracking: boolean;
  enableExpiry: boolean;
  autoCreateBatch: boolean;
  maintainStock: boolean;
  defaultWarehouse?: string;
  reorderLevel?: number;
  safetyStock?: number;
  allowNegativeStock: boolean;
  disabled?: boolean;
};

export type StockItemResourcePayload = {
  item_name: string;
  item_code?: string;
  item_group: string;
  brand?: string;
  stock_uom: string;
  description?: string;
  is_stock_item: boolean;
  has_variants: boolean;
  has_batch_no: boolean;
  disabled: boolean;
};

export type CreateItemPricePayload = {
  item_code: string;
  price_list_rate: number;
  price_list: "Standard Selling";
  currency: "INR";
};

export type UpdateStockItemThunkPayload = {
  name: string;
  values: StockItemFormValues;
};
