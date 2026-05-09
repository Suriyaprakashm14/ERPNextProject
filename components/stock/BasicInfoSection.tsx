"use client";

import { Card, Col, Form, Input, Row } from "antd";

export default function BasicInfoSection() {
  return (
    <Card title="Basic Info" size="small">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Item Name"
            name="itemName"
            rules={[{ required: true, message: "Enter the item name." }]}
          >
            <Input placeholder="Cotton Kurti" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Item Code" name="itemCode">
            <Input placeholder="Auto or manual code" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Item Group"
            name="itemGroup"
            rules={[{ required: true, message: "Enter the item group." }]}
          >
            <Input placeholder="Finished Goods" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Brand" name="brand">
            <Input placeholder="House brand" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Stock UOM"
            name="stockUom"
            rules={[{ required: true, message: "Enter the stock UOM." }]}
          >
            <Input placeholder="Nos" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} placeholder="Optional ERPNext item description" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
