import type { RootState } from "@/store";

export const selectBuyingState = (state: RootState) => state.buying;

export const selectMaterialRequests = (state: RootState) => state.buying.materialRequests;
export const selectPurchaseOrders = (state: RootState) => state.buying.purchaseOrders;
export const selectPurchaseReceipts = (state: RootState) => state.buying.purchaseReceipts;
export const selectPurchaseInvoices = (state: RootState) => state.buying.purchaseInvoices;

export const selectBuyingLoading = (state: RootState) => state.buying.loading;
export const selectBuyingSaving = (state: RootState) => state.buying.saving;
export const selectBuyingSubmitting = (state: RootState) => state.buying.submitting;

export const selectBuyingDrawerOpen = (state: RootState) => state.buying.drawerOpen;
export const selectBuyingMode = (state: RootState) => state.buying.mode;
export const selectSelectedBuyingDocument = (state: RootState) =>
  state.buying.selectedDocument;
export const selectBuyingError = (state: RootState) => state.buying.error;
export const selectBuyingSearch = (state: RootState) => state.buying.search;

export const selectBuyingMasterData = (state: RootState) => state.buying.masterData;
export const selectBuyingMasterLoading = (state: RootState) => state.buying.masterLoading;
export const selectBuyingItems = (state: RootState) => state.buying.masterData.items;
export const selectBuyingWarehouses = (state: RootState) =>
  state.buying.masterData.warehouses;
export const selectBuyingCompanies = (state: RootState) =>
  state.buying.masterData.companies;
export const selectBuyingUoms = (state: RootState) => state.buying.masterData.uoms;
export const selectBuyingSuppliers = (state: RootState) =>
  state.buying.masterData.suppliers;
export const selectBuyingTaxTemplates = (state: RootState) =>
  state.buying.masterData.taxTemplates;
export const selectBuyingPriceLists = (state: RootState) =>
  state.buying.masterData.priceLists;

function matchesSearch(doc: Record<string, unknown>, query: string) {
  return Object.values(doc).some((value) => {
    if (value === null || value === undefined) {
      return false;
    }
    return String(value).toLowerCase().includes(query);
  });
}

export const selectFilteredMaterialRequests = (state: RootState) => {
  const query = state.buying.search.trim().toLowerCase();
  if (!query) {
    return state.buying.materialRequests;
  }
  return state.buying.materialRequests.filter((doc) => matchesSearch(doc, query));
};

export const selectFilteredPurchaseOrders = (state: RootState) => {
  const query = state.buying.search.trim().toLowerCase();
  if (!query) {
    return state.buying.purchaseOrders;
  }
  return state.buying.purchaseOrders.filter((doc) => matchesSearch(doc, query));
};

export const selectFilteredPurchaseReceipts = (state: RootState) => {
  const query = state.buying.search.trim().toLowerCase();
  if (!query) {
    return state.buying.purchaseReceipts;
  }
  return state.buying.purchaseReceipts.filter((doc) => matchesSearch(doc, query));
};

export const selectFilteredPurchaseInvoices = (state: RootState) => {
  const query = state.buying.search.trim().toLowerCase();
  if (!query) {
    return state.buying.purchaseInvoices;
  }
  return state.buying.purchaseInvoices.filter((doc) => matchesSearch(doc, query));
};
