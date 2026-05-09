"use client";

import { App, Button, Card, Empty, Flex, Input, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect } from "react";

import StockItemDrawer from "./StockItemDrawer";
import StockItemTable from "./StockItemTable";
import { useStockActions, useStockItems } from "@/features/stock/hooks";
import { useAppDispatch } from "@/store/hooks";
import { fetchStockItems } from "@/features/stock/stockSlice";

export default function StockItemsPage() {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const {
    filteredItems,
    loading,
    saving,
    drawerOpen,
    selectedItem,
    mode,
    error,
    search,
  } = useStockItems();
  const actions = useStockActions();

  useEffect(() => {
    void dispatch(fetchStockItems())
      .unwrap()
      .catch((caughtError) => {
        const errorMessage =
          caughtError instanceof Error ? caughtError.message : "Unable to load stock items.";
        void message.error(errorMessage);
      });
  }, [dispatch, message]);

  return (
    <Flex vertical gap={24}>
      <Card>
        <Flex justify="space-between" align="flex-start" gap={16} wrap="wrap">
          <div>
            <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 8 }}>
              Stock Items Pro
            </Typography.Title>
            <Typography.Text type="secondary">
              Manage textile item masters, variants, barcode, batch and selling prices
            </Typography.Text>
          </div>

          <Space wrap>
            <Input.Search
              allowClear
              placeholder="Search item code, name, brand or group"
              value={search}
              onChange={(event) => {
                actions.setSearch(event.target.value);
              }}
              style={{ width: 320 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                actions.openCreateDrawer();
              }}
            >
              Add Item
            </Button>
          </Space>
        </Flex>
      </Card>

      <Card>
        {filteredItems.length === 0 && !loading ? (
          <Empty description="No stock items found" />
        ) : (
          <StockItemTable
            items={filteredItems}
            loading={loading}
            onView={(item) => {
              actions.openViewDrawer(item);
            }}
            onEdit={(item) => {
              actions.openEditDrawer(item);
            }}
          />
        )}
      </Card>

      <StockItemDrawer
        open={drawerOpen}
        mode={mode}
        saving={saving}
        error={error}
        selectedItem={selectedItem}
        onClose={() => {
          actions.closeDrawer();
        }}
        onEdit={(item) => {
          actions.openEditDrawer(item);
        }}
        onCreate={async (values) => {
          await actions.createStockItem(values);
          void message.success("Stock item created successfully.");
        }}
        onUpdate={async (payload) => {
          await actions.updateStockItem(payload);
          void message.success("Stock item updated successfully.");
        }}
      />
    </Flex>
  );
}
