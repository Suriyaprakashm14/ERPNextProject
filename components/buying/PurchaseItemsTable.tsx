"use client";

import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, Table } from "antd";
import type { FormListFieldData } from "antd/es/form/FormList";
import type { TableColumnsType } from "antd";

export type PurchaseItemColumnSpec = {
  title: string;
  key: string;
  width?: number;
  render: (field: FormListFieldData) => React.ReactNode;
};

type PurchaseItemsTableProps = {
  name: string | number | (string | number)[];
  columns: PurchaseItemColumnSpec[];
  loading: boolean;
  readOnly?: boolean;
  addLabel?: string;
  emptyHint?: React.ReactNode;
  buildDefaultRow: () => Record<string, unknown>;
};

export default function PurchaseItemsTable({
  name,
  columns,
  loading,
  readOnly = false,
  addLabel = "Add line",
  emptyHint,
  buildDefaultRow,
}: PurchaseItemsTableProps) {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => {
        const dataColumns: TableColumnsType<FormListFieldData> = columns.map(
          (column) => ({
            title: column.title,
            key: column.key,
            width: column.width,
            render: (_value: unknown, field: FormListFieldData) => column.render(field),
          }),
        );

        const actionColumn: TableColumnsType<FormListFieldData>[number] = {
          title: "",
          key: "__actions",
          width: 72,
          fixed: "right",
          render: (_value: unknown, field: FormListFieldData) => (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label="Remove line"
              onClick={() => {
                remove(field.name);
              }}
            />
          ),
        };

        const tableColumns = readOnly ? dataColumns : [...dataColumns, actionColumn];

        return (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <Table<FormListFieldData>
              size="middle"
              loading={loading}
              pagination={false}
              rowKey="key"
              dataSource={fields}
              scroll={{ x: "max-content" }}
              locale={{ emptyText: emptyHint }}
              columns={tableColumns}
            />
            {!readOnly ? (
              <Button
                type="dashed"
                block
                style={{ marginTop: 12 }}
                onClick={() => {
                  add(buildDefaultRow());
                }}
              >
                {addLabel}
              </Button>
            ) : null}
          </div>
        );
      }}
    </Form.List>
  );
}
