"use client";

import { Button, Space, Table } from "antd";
import type { TableColumnsType } from "antd";

import BuyingStatusBadge from "./BuyingStatusBadge";
import type { BuyingDocument } from "@/features/buying/buyingTypes";

type MaterialRequestTableProps = {
  rows: BuyingDocument[];
  loading: boolean;
  onView: (row: BuyingDocument) => void;
  onEdit: (row: BuyingDocument) => void;
};

export default function MaterialRequestTable({
  rows,
  loading,
  onView,
  onEdit,
}: MaterialRequestTableProps) {
  const columns: TableColumnsType<BuyingDocument> = [
    {
      title: "Document",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date",
      key: "transaction_date",
      render: (_, record) => String(record.transaction_date ?? "—"),
    },
    {
      title: "Type",
      key: "material_request_type",
      render: (_, record) => String(record.material_request_type ?? "—"),
    },
    {
      title: "Schedule",
      key: "schedule_date",
      render: (_, record) => String(record.schedule_date ?? "—"),
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
      rowKey="name"
      loading={loading}
      columns={columns}
      dataSource={rows}
      onRow={(record) => ({
        onClick: () => onView(record),
        style: { cursor: "pointer" },
      })}
      pagination={{ pageSize: 10, showSizeChanger: false }}
      scroll={{ x: 900 }}
    />
  );
}
