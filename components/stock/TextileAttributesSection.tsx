"use client";

import { Card, Col, Form, Input, Row } from "antd";

export default function TextileAttributesSection() {
  return (
    <Card title="Textile Attributes" size="small">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Category" name="category">
            <Input placeholder="Women Wear" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Subcategory" name="subcategory">
            <Input placeholder="Kurtis" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Fabric Type" name="fabricType">
            <Input placeholder="Cotton" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Gender" name="gender">
            <Input placeholder="Women" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Season" name="season">
            <Input placeholder="Summer" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Pattern" name="pattern">
            <Input placeholder="Printed" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Fit Type" name="fitType">
            <Input placeholder="Regular" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Sleeve Type" name="sleeveType">
            <Input placeholder="Three Quarter" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
