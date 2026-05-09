"use client";

import { Button, Space, Table } from "antd";
import type { TableColumnsType } from "antd";

import BuyingStatusBadge from "./BuyingStatusBadge";
import type { BuyingDocument } from "@/features/buying/buyingTypes";

type PurchaseReceiptTableProps = {
  rows: BuyingDocument[];
  loading: boolean;
  onView: (row: BuyingDocument) => void;
  onEdit: (row: BuyingDocument) => void;
};

export default function PurchaseReceiptTable({
  rows,
  loading,
  onView,
  onEdit,
}: PurchaseReceiptTableProps) {
  const columns: TableColumnsType<BuyingDocument> = [
    { title: "Document", dataIndex: "name", key: "name" },
    {
      title: "Posting Date",
      key: "posting_date",
      render: (_, record) => String(record.posting_date ?? "—"),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => <BuyingStatusBadge status={String(record.status ?? "")} />,
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
    <Table<BuyingDocument>
      rowKey={(row, index) => String(row.name ?? `row-${index}`)}
      loading={loading}
      columns={columns}
      dataSource={rows}
      onRow={(record) => ({
        onClick: () => onView(record),
        style: { cursor: "pointer" },
      })}
      pagination={{ pageSize: 10, showSizeChanger: false }}
      scroll={{ x: 620 }}
    />
  );
}
