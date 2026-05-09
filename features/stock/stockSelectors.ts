import type { RootState } from "@/store";

export const selectStockState = (state: RootState) => state.stock;
export const selectStockItems = (state: RootState) => state.stock.items;
export const selectStockLoading = (state: RootState) => state.stock.loading;
export const selectStockSaving = (state: RootState) => state.stock.saving;
export const selectStockDrawerOpen = (state: RootState) => state.stock.drawerOpen;
export const selectSelectedStockItem = (state: RootState) =>
  state.stock.selectedItem;
export const selectStockMode = (state: RootState) => state.stock.mode;
export const selectStockError = (state: RootState) => state.stock.error;
export const selectStockSearch = (state: RootState) => state.stock.search;

export const selectFilteredStockItems = (state: RootState) => {
  const search = state.stock.search.trim().toLowerCase();

  if (!search) {
    return state.stock.items;
  }

  return state.stock.items.filter((item) =>
    [
      item.item_code,
      item.item_name,
      item.item_group,
      item.brand ?? "",
      item.stock_uom,
    ].some((value) => value.toLowerCase().includes(search)),
  );
};
