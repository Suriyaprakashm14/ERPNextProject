"use client";

import { App, Button, Card, Empty, Flex, Input, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";

import PurchaseReceiptDrawer from "./PurchaseReceiptDrawer";
import PurchaseReceiptTable from "./PurchaseReceiptTable";
import { useBuyingActions, useBuyingData } from "@/features/buying/hooks";

export default function PurchaseReceiptsPage() {
  const { message } = App.useApp();
  const {
    purchaseOrders,
    filteredPurchaseReceipts,
    loading,
    saving,
    submitting,
    drawerOpen,
    mode,
    selectedDocument,
    error,
    search,
    masterLoading,
    suppliersMaster,
    companiesMaster,
    warehousesMaster,
    itemsMaster,
  } = useBuyingData();
  const actions = useBuyingActions();

  useEffect(() => {
    actions.setCurrentModule("purchase-receipt");
    void actions.fetchBuyingMasterData().catch((caught) => {
      void message.error(
        caught instanceof Error ? caught.message : "Unable to load master data.",
      );
    });
  }, []);

  useEffect(() => {
    void actions.fetchPurchaseReceipts().catch((caught) => {
      void message.error(caught instanceof Error ? caught.message : "Unable to load receipts.");
    });
    void actions.fetchPurchaseOrders().catch((caught) => {
      void message.error(caught instanceof Error ? caught.message : "Unable to load orders.");
    });
  }, []);

  async function refresh() {
    await actions.fetchPurchaseReceipts().catch((caught) => {
      void message.error(caught instanceof Error ? caught.message : "Unable to refresh.");
    });
  }

  return (
    <Flex vertical gap={24}>
      <Card>
        <Flex justify="space-between" align="flex-start" gap={16} wrap="wrap">
          <div>
            <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 8 }}>
              Purchase Receipts
            </Typography.Title>
            <Typography.Text type="secondary">
              Record goods received—inventory updates when submitted in ERPNext
            </Typography.Text>
          </div>
          <Space wrap>
            <Input.Search
              allowClear
              placeholder="Search documents"
              value={search}
              onChange={(event) => actions.setSearch(event.target.value)}
              style={{ width: 280 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => actions.openCreateDrawer()}>
              New receipt
            </Button>
          </Space>
        </Flex>
      </Card>

      <Card>
        {filteredPurchaseReceipts.length === 0 && !loading ? (
          <Empty description="No purchase receipts found" />
        ) : (
          <PurchaseReceiptTable
            rows={filteredPurchaseReceipts}
            loading={loading}
            onView={async (row) => {
              const name = String(row.name ?? "");
              if (!name) return;
              try {
                await actions.fetchBuyingDocument(name, "view");
              } catch (caught) {
                void message.error(caught instanceof Error ? caught.message : "Unable to open.");
              }
            }}
            onEdit={async (row) => {
              const name = String(row.name ?? "");
              if (!name) return;
              try {
                await actions.fetchBuyingDocument(name, "edit");
              } catch (caught) {
                void message.error(caught instanceof Error ? caught.message : "Unable to open.");
              }
            }}
          />
        )}
      </Card>

      <PurchaseReceiptDrawer
        open={drawerOpen}
        mode={mode}
        saving={saving}
        submitting={submitting}
        error={error}
        selectedDocument={selectedDocument}
        masterLoading={masterLoading}
        purchaseOrders={purchaseOrders}
        suppliers={suppliersMaster}
        companies={companiesMaster}
        warehouses={warehousesMaster}
        items={itemsMaster}
        onClose={() => actions.closeDrawer()}
        onEdit={async () => {
          const name =
            typeof selectedDocument?.name === "string" ? selectedDocument.name : "";
          if (!name) return;
          try {
            await actions.fetchBuyingDocument(name, "edit");
          } catch (caught) {
            void message.error(caught instanceof Error ? caught.message : "Unable to edit.");
          }
        }}
        onCreate={async (values) => {
          await actions.createPurchaseReceipt(values);
          void message.success("Purchase Receipt saved.");
          await refresh();
        }}
        onUpdate={async ({ name, values }) => {
          await actions.updatePurchaseReceipt({ name, values });
          void message.success("Purchase Receipt updated.");
          await refresh();
        }}
        onSubmitDocument={async (name) => {
          await actions.submitPurchaseReceipt(name);
          void message.success("Purchase Receipt submitted.");
          await refresh();
          actions.closeDrawer();
        }}
      />
    </Flex>
  );
}
