"use client";

import { App, Button, Card, Empty, Flex, Input, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";

import MaterialRequestDrawer from "./MaterialRequestDrawer";
import MaterialRequestTable from "./MaterialRequestTable";
import { useBuyingActions, useBuyingData } from "@/features/buying/hooks";

export default function MaterialRequestsPage() {
  const { message } = App.useApp();
  const {
    filteredMaterialRequests,
    loading,
    saving,
    submitting,
    drawerOpen,
    mode,
    selectedDocument,
    error,
    search,
    masterLoading,
    companiesMaster,
    warehousesMaster,
    itemsMaster,
    uomsMaster,
  } = useBuyingData();
  const actions = useBuyingActions();

  useEffect(() => {
    actions.setCurrentModule("material-request");
    void actions.fetchBuyingMasterData().catch((caught) => {
      void message.error(
        caught instanceof Error ? caught.message : "Unable to load master data.",
      );
    });
  }, []);

  useEffect(() => {
    void actions.fetchMaterialRequests().catch((caught) => {
      void message.error(
        caught instanceof Error ? caught.message : "Unable to load material requests.",
      );
    });
  }, []);

  async function refreshList() {
    try {
      await actions.fetchMaterialRequests();
    } catch (caught) {
      void message.error(
        caught instanceof Error ? caught.message : "Unable to refresh documents.",
      );
    }
  }

  return (
    <Flex vertical gap={24}>
      <Card>
        <Flex justify="space-between" align="flex-start" gap={16} wrap="wrap">
          <div>
            <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 8 }}>
              Material Requests
            </Typography.Title>
            <Typography.Text type="secondary">
              Raise internal requests before purchasing stock
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => actions.openCreateDrawer()}
            >
              New request
            </Button>
          </Space>
        </Flex>
      </Card>

      <Card>
        {filteredMaterialRequests.length === 0 && !loading ? (
          <Empty description="No material requests found" />
        ) : (
          <MaterialRequestTable
            rows={filteredMaterialRequests}
            loading={loading}
            onView={async (row) => {
              const name = String(row.name ?? "");
              if (!name) {
                return;
              }
              try {
                await actions.fetchBuyingDocument(name, "view");
              } catch (caught) {
                void message.error(caught instanceof Error ? caught.message : "Unable to open.");
              }
            }}
            onEdit={async (row) => {
              const name = String(row.name ?? "");
              if (!name) {
                return;
              }
              try {
                await actions.fetchBuyingDocument(name, "edit");
              } catch (caught) {
                void message.error(caught instanceof Error ? caught.message : "Unable to open.");
              }
            }}
          />
        )}
      </Card>

      <MaterialRequestDrawer
        open={drawerOpen}
        mode={mode}
        saving={saving}
        submitting={submitting}
        error={error}
        selectedDocument={selectedDocument}
        masterLoading={masterLoading}
        companies={companiesMaster}
        warehouses={warehousesMaster}
        items={itemsMaster}
        uoms={uomsMaster}
        onClose={() => actions.closeDrawer()}
        onEdit={async () => {
          const name =
            typeof selectedDocument?.name === "string" ? selectedDocument.name : "";
          if (!name) {
            return;
          }
          try {
            await actions.fetchBuyingDocument(name, "edit");
          } catch (caught) {
            void message.error(caught instanceof Error ? caught.message : "Unable to edit.");
          }
        }}
        onCreate={async (values) => {
          await actions.createMaterialRequest(values);
          void message.success("Material Request saved.");
          await refreshList();
        }}
        onUpdate={async ({ name, values }) => {
          await actions.updateMaterialRequest({ name, values });
          void message.success("Material Request updated.");
          await refreshList();
        }}
        onSubmitDocument={async (name) => {
          await actions.submitMaterialRequest(name);
          void message.success("Material Request submitted.");
          await refreshList();
          actions.closeDrawer();
        }}
      />
    </Flex>
  );
}
