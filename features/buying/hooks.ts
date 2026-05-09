"use client";

import {
  clearError,
  closeDrawer,
  createMaterialRequest,
  createPurchaseInvoice,
  createPurchaseOrder,
  createPurchaseReceipt,
  fetchBuyingDocument,
  fetchBuyingMasterData,
  fetchMaterialRequests,
  fetchPurchaseInvoices,
  fetchPurchaseOrders,
  fetchPurchaseReceipts,
  openCreateDrawer,
  openEditDrawer,
  openViewDrawer,
  setCurrentModule,
  setSearch,
  submitMaterialRequest,
  submitPurchaseInvoice,
  submitPurchaseOrder,
  submitPurchaseReceipt,
  updateMaterialRequest,
  updatePurchaseInvoice,
  updatePurchaseOrder,
  updatePurchaseReceipt,
} from "./buyingSlice";
import {
  selectBuyingCompanies,
  selectBuyingDrawerOpen,
  selectBuyingError,
  selectBuyingItems,
  selectBuyingLoading,
  selectBuyingMasterData,
  selectBuyingMasterLoading,
  selectBuyingMode,
  selectBuyingPriceLists,
  selectBuyingSaving,
  selectBuyingSearch,
  selectBuyingSubmitting,
  selectBuyingSuppliers,
  selectBuyingTaxTemplates,
  selectBuyingUoms,
  selectBuyingWarehouses,
  selectFilteredMaterialRequests,
  selectFilteredPurchaseInvoices,
  selectFilteredPurchaseOrders,
  selectFilteredPurchaseReceipts,
  selectMaterialRequests,
  selectPurchaseInvoices,
  selectPurchaseOrders,
  selectPurchaseReceipts,
  selectSelectedBuyingDocument,
} from "./buyingSelectors";
import type {
  BuyingDocument,
  BuyingMode,
  BuyingModule,
  MaterialRequestFormValues,
  PurchaseInvoiceFormValues,
  PurchaseOrderFormValues,
  PurchaseReceiptFormValues,
  UpdateBuyingDocumentPayload,
} from "./buyingTypes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function useBuyingData() {
  return {
    materialRequests: useAppSelector(selectMaterialRequests),
    filteredMaterialRequests: useAppSelector(selectFilteredMaterialRequests),
    purchaseOrders: useAppSelector(selectPurchaseOrders),
    filteredPurchaseOrders: useAppSelector(selectFilteredPurchaseOrders),
    purchaseReceipts: useAppSelector(selectPurchaseReceipts),
    filteredPurchaseReceipts: useAppSelector(selectFilteredPurchaseReceipts),
    purchaseInvoices: useAppSelector(selectPurchaseInvoices),
    filteredPurchaseInvoices: useAppSelector(selectFilteredPurchaseInvoices),
    loading: useAppSelector(selectBuyingLoading),
    saving: useAppSelector(selectBuyingSaving),
    submitting: useAppSelector(selectBuyingSubmitting),
    drawerOpen: useAppSelector(selectBuyingDrawerOpen),
    mode: useAppSelector(selectBuyingMode),
    selectedDocument: useAppSelector(selectSelectedBuyingDocument),
    error: useAppSelector(selectBuyingError),
    search: useAppSelector(selectBuyingSearch),
    masterData: useAppSelector(selectBuyingMasterData),
    masterLoading: useAppSelector(selectBuyingMasterLoading),
    itemsMaster: useAppSelector(selectBuyingItems),
    warehousesMaster: useAppSelector(selectBuyingWarehouses),
    companiesMaster: useAppSelector(selectBuyingCompanies),
    uomsMaster: useAppSelector(selectBuyingUoms),
    suppliersMaster: useAppSelector(selectBuyingSuppliers),
    taxTemplatesMaster: useAppSelector(selectBuyingTaxTemplates),
    priceListsMaster: useAppSelector(selectBuyingPriceLists),
  };
}

export function useBuyingActions() {
  const dispatch = useAppDispatch();

  return {
    fetchBuyingMasterData: () => dispatch(fetchBuyingMasterData()).unwrap(),
    fetchMaterialRequests: () => dispatch(fetchMaterialRequests()).unwrap(),
    fetchPurchaseOrders: () => dispatch(fetchPurchaseOrders()).unwrap(),
    fetchPurchaseReceipts: () => dispatch(fetchPurchaseReceipts()).unwrap(),
    fetchPurchaseInvoices: () => dispatch(fetchPurchaseInvoices()).unwrap(),
    fetchBuyingDocument: (name: string, mode: BuyingMode) =>
      dispatch(fetchBuyingDocument({ name, mode })).unwrap(),
    openCreateDrawer: () => dispatch(openCreateDrawer()),
    setCurrentModule: (module: BuyingModule) => dispatch(setCurrentModule(module)),
    openEditDrawer: (document: BuyingDocument) => dispatch(openEditDrawer(document)),
    openViewDrawer: (document: BuyingDocument) => dispatch(openViewDrawer(document)),
    closeDrawer: () => dispatch(closeDrawer()),
    setSearch: (value: string) => dispatch(setSearch(value)),
    clearError: () => dispatch(clearError()),
    createMaterialRequest: (values: MaterialRequestFormValues) =>
      dispatch(createMaterialRequest(values)).unwrap(),
    updateMaterialRequest: (payload: UpdateBuyingDocumentPayload) =>
      dispatch(updateMaterialRequest(payload)).unwrap(),
    submitMaterialRequest: (name: string) =>
      dispatch(submitMaterialRequest(name)).unwrap(),
    createPurchaseOrder: (values: PurchaseOrderFormValues) =>
      dispatch(createPurchaseOrder(values)).unwrap(),
    updatePurchaseOrder: (payload: UpdateBuyingDocumentPayload) =>
      dispatch(updatePurchaseOrder(payload)).unwrap(),
    submitPurchaseOrder: (name: string) =>
      dispatch(submitPurchaseOrder(name)).unwrap(),
    createPurchaseReceipt: (values: PurchaseReceiptFormValues) =>
      dispatch(createPurchaseReceipt(values)).unwrap(),
    updatePurchaseReceipt: (payload: UpdateBuyingDocumentPayload) =>
      dispatch(updatePurchaseReceipt(payload)).unwrap(),
    submitPurchaseReceipt: (name: string) =>
      dispatch(submitPurchaseReceipt(name)).unwrap(),
    createPurchaseInvoice: (values: PurchaseInvoiceFormValues) =>
      dispatch(createPurchaseInvoice(values)).unwrap(),
    updatePurchaseInvoice: (payload: UpdateBuyingDocumentPayload) =>
      dispatch(updatePurchaseInvoice(payload)).unwrap(),
    submitPurchaseInvoice: (name: string) =>
      dispatch(submitPurchaseInvoice(name)).unwrap(),
  };
}
