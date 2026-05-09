"use client";

import {
  clearError,
  closeDrawer,
  createStockItem,
  fetchStockItems,
  openCreateDrawer,
  openEditDrawer,
  openViewDrawer,
  setSearch,
  updateStockItem,
} from "./stockSlice";
import {
  selectFilteredStockItems,
  selectSelectedStockItem,
  selectStockDrawerOpen,
  selectStockError,
  selectStockItems,
  selectStockLoading,
  selectStockMode,
  selectStockSaving,
  selectStockSearch,
} from "./stockSelectors";
import type { StockItem, StockItemFormValues, UpdateStockItemThunkPayload } from "./stockTypes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useStockItems() {
  return {
    items: useAppSelector(selectStockItems),
    filteredItems: useAppSelector(selectFilteredStockItems),
    loading: useAppSelector(selectStockLoading),
    saving: useAppSelector(selectStockSaving),
    drawerOpen: useAppSelector(selectStockDrawerOpen),
    selectedItem: useAppSelector(selectSelectedStockItem),
    mode: useAppSelector(selectStockMode),
    error: useAppSelector(selectStockError),
    search: useAppSelector(selectStockSearch),
  };
}

export function useStockActions() {
  const dispatch = useAppDispatch();

  return {
    fetchStockItems: () => dispatch(fetchStockItems()).unwrap(),
    openCreateDrawer: () => dispatch(openCreateDrawer()),
    openEditDrawer: (item: StockItem) => dispatch(openEditDrawer(item)),
    openViewDrawer: (item: StockItem) => dispatch(openViewDrawer(item)),
    closeDrawer: () => dispatch(closeDrawer()),
    setSearch: (value: string) => dispatch(setSearch(value)),
    clearError: () => dispatch(clearError()),
    createStockItem: (values: StockItemFormValues) =>
      dispatch(createStockItem(values)).unwrap(),
    updateStockItem: (payload: UpdateStockItemThunkPayload) =>
      dispatch(updateStockItem(payload)).unwrap(),
  };
}
