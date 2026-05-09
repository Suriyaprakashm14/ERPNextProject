"use client";

import { Button, Space, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";

import type { StockItem } from "@/features/stock/stockTypes";

type StockItemTableProps = {
  items: StockItem[];
  loading: boolean;
  onView: (item: StockItem) => void;
  onEdit: (item: StockItem) => void;
};

function renderBooleanTag(value: boolean, trueLabel: string) {
  return value ? <Tag color="green">{trueLabel}</Tag> : <Tag>No</Tag>;
}

export default function StockItemTable({
  items,
  loading,
  onView,
  onEdit,
}: StockItemTableProps) {
  const columns: TableColumnsType<StockItem> = [
    {
      title: "Item Code",
      dataIndex: "item_code",
      key: "item_code",
    },
    {
      title: "Item Name",
      dataIndex: "item_name",
      key: "item_name",
    },
    {
      title: "Item Group",
      dataIndex: "item_group",
      key: "item_group",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (value: StockItem["brand"]) => value || "-",
    },
    {
      title: "UOM",
      dataIndex: "stock_uom",
      key: "stock_uom",
    },
    {
      title: "Maintain Stock",
      dataIndex: "maintain_stock",
      key: "maintain_stock",
      render: (value: boolean) => renderBooleanTag(value, "Yes"),
    },
    {
      title: "Has Variants",
      dataIndex: "has_variants",
      key: "has_variants",
      render: (value: boolean) => renderBooleanTag(value, "Yes"),
    },
    {
      title: "Batch Enabled",
      dataIndex: "has_batch_no",
      key: "has_batch_no",
      render: (value: boolean) => renderBooleanTag(value, "Yes"),
    },
    {
      title: "Status",
      dataIndex: "disabled",
      key: "disabled",
      render: (value: boolean) =>
        value ? <Tag color="red">Disabled</Tag> : <Tag color="green">Active</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onEdit(record);
            }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<StockItem>
      rowKey="name"
      loading={loading}
      columns={columns}
      dataSource={items}
      onRow={(record) => ({
        onClick: () => onView(record),
        style: { cursor: "pointer" },
      })}
      pagination={{ pageSize: 10, showSizeChanger: false }}
      scroll={{ x: 1100 }}
    />
  );
}
