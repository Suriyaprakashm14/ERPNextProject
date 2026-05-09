"use client";

import { Card, Form, Input, Space, Switch, Typography } from "antd";

export default function BarcodeSection() {
  return (
    <Card title="Barcode" size="small">
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        <Form.Item
          label="Auto Generate Barcode"
          name="autoGenerateBarcode"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Barcode Per Variant"
          name="barcodePerVariant"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item label="Manual Barcode" name="manualBarcode" style={{ marginBottom: 0 }}>
          <Input placeholder="Optional manual barcode" />
        </Form.Item>
        <Typography.Text type="secondary">
          Barcode creation is not forced from the frontend when ERPNext or backend mapping owns it.
        </Typography.Text>
        {/* TODO: Map barcode fields to the finalized ERPNext barcode workflow when backend support is ready. */}
      </Space>
    </Card>
  );
}
