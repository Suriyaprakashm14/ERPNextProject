"use client";

import { Card, Col, Form, Input, InputNumber, Row, Space, Switch, Typography } from "antd";

export default function StockSettingsSection() {
  return (
    <Card title="Stock Settings" size="small">
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        <Form.Item
          label="Maintain Stock"
          name="maintainStock"
          valuePropName="checked"
          style={{ marginBottom: 0 }}
        >
          <Switch />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Default Warehouse" name="defaultWarehouse">
              <Input placeholder="Stores - TS" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Reorder Level" name="reorderLevel">
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Safety Stock" name="safetyStock">
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Allow Negative Stock"
              name="allowNegativeStock"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Typography.Text type="secondary">
          This screen does not alter ERPNext global stock settings. Quantity stays controlled by ERPNext
          stock transactions only.
        </Typography.Text>
      </Space>
    </Card>
  );
}
