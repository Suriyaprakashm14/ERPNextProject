"use client";

import { Card, Form, Space, Switch, Typography } from "antd";

export default function BatchSection() {
  return (
    <Card title="Batch Settings" size="small">
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        <Form.Item
          label="Enable Batch Tracking"
          name="enableBatchTracking"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Enable Expiry"
          name="enableExpiry"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Auto Create Batch"
          name="autoCreateBatch"
          valuePropName="checked"
          style={{ marginBottom: 0 }}
        >
          <Switch />
        </Form.Item>
        <Typography.Text type="secondary">
          Batch tracking follows ERPNext stock transactions such as Purchase Receipt, Stock Entry and
          Stock Reconciliation.
        </Typography.Text>
      </Space>
    </Card>
  );
}
