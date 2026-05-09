"use client";

import { App, Button, Card, Empty, Flex, Input, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";

import PurchaseOrderDrawer from "./PurchaseOrderDrawer";
import PurchaseOrderTable from "./PurchaseOrderTable";
import { useBuyingActions, useBuyingData } from "@/features/buying/hooks";

export default function PurchaseOrdersPage() {
  const { message } = App.useApp();
  const {
    materialRequests,
    filteredPurchaseOrders,
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
    taxTemplatesMaster,
    itemsMaster,
  } = useBuyingData();
  const actions = useBuyingActions();

  useEffect(() => {
    actions.setCurrentModule("purchase-order");
    void actions.fetchBuyingMasterData().catch((caught) => {
      void message.error(
        caught instanceof Error ? caught.message : "Unable to load master data.",
      );
    });
  }, []);

  useEffect(() => {
    void actions.fetchPurchaseOrders().catch((caught) => {
      void message.error(caught instanceof Error ? caught.message : "Unable to load orders.");
    });
    void actions.fetchMaterialRequests().catch((caught) => {
      void message.error(
        caught instanceof Error ? caught.message : "Unable to load material requests.",
      );
    });
  }, []);

  async function refresh() {
    await actions.fetchPurchaseOrders().catch((caught) => {
      void message.error(caught instanceof Error ? caught.message : "Unable to refresh.");
    });
  }

  return (
    <Flex vertical gap={24}>
      <Card>
        <Flex justify="space-between" align="flex-start" gap={16} wrap="wrap">
          <div>
            <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 8 }}>
              Purchase Orders
            </Typography.Title>
            <Typography.Text type="secondary">
              Commit purchasing intent to suppliers (does not post stock)
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
              New order
            </Button>
          </Space>
        </Flex>
      </Card>

      <Card>
        {filteredPurchaseOrders.length === 0 && !loading ? (
          <Empty description="No purchase orders found" />
        ) : (
          <PurchaseOrderTable
            rows={filteredPurchaseOrders}
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

      <PurchaseOrderDrawer
        open={drawerOpen}
        mode={mode}
        saving={saving}
        submitting={submitting}
        error={error}
        selectedDocument={selectedDocument}
        masterLoading={masterLoading}
        materialRequests={materialRequests}
        suppliers={suppliersMaster}
        companies={companiesMaster}
        warehouses={warehousesMaster}
        taxTemplates={taxTemplatesMaster}
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
          await actions.createPurchaseOrder(values);
          void message.success("Purchase Order saved.");
          await refresh();
        }}
        onUpdate={async ({ name, values }) => {
          await actions.updatePurchaseOrder({ name, values });
          void message.success("Purchase Order updated.");
          await refresh();
        }}
        onSubmitDocument={async (name) => {
          await actions.submitPurchaseOrder(name);
          void message.success("Purchase Order submitted.");
          await refresh();
          actions.closeDrawer();
        }}
      />
    </Flex>
  );
}
