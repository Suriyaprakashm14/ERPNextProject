"use client";

import { Button, Space, Table } from "antd";
import type { TableColumnsType } from "antd";

import BuyingStatusBadge from "./BuyingStatusBadge";
import type { BuyingDocument } from "@/features/buying/buyingTypes";

type PurchaseInvoiceTableProps = {
  rows: BuyingDocument[];
  loading: boolean;
  onView: (row: BuyingDocument) => void;
  onEdit: (row: BuyingDocument) => void;
};

export default function PurchaseInvoiceTable({
  rows,
  loading,
  onView,
  onEdit,
}: PurchaseInvoiceTableProps) {
  const columns: TableColumnsType<BuyingDocument> = [
    { title: "Document", dataIndex: "name", key: "name" },
    {
      title: "Bill No",
      key: "bill_no",
      render: (_, record) => String(record.bill_no ?? "—"),
    },
    {
      title: "Bill Date",
      key: "bill_date",
      render: (_, record) => String(record.bill_date ?? "—"),
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
      scroll={{ x: 860 }}
    />
  );
}
