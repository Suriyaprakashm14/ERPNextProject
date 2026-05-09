"use client";

import { Card, Col, Form, Input, InputNumber, Row, Typography } from "antd";
import { useCallback } from "react";

import type { StockItemFormValues } from "@/features/stock/stockTypes";

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}

export default function PricingSection() {
  const form = Form.useFormInstance<StockItemFormValues>();
  const buyingPrice = Form.useWatch("buyingPrice", form);
  const sellingPrice = Form.useWatch("sellingPrice", form);
  const profitMargin = Form.useWatch("profitMargin", form);
  const computedMargin =
    typeof buyingPrice === "number" &&
    typeof sellingPrice === "number" &&
    buyingPrice > 0
      ? ((sellingPrice - buyingPrice) / buyingPrice) * 100
      : null;

  const syncProfitMarginFromSellingPrice = useCallback(
    (nextSellingPrice: number | null) => {
      if (typeof buyingPrice !== "number" || buyingPrice <= 0) {
        form.setFieldValue("profitMargin", undefined);
        return;
      }

      if (typeof nextSellingPrice !== "number") {
        form.setFieldValue("profitMargin", undefined);
        return;
      }

      const nextMargin = ((nextSellingPrice - buyingPrice) / buyingPrice) * 100;
      form.setFieldValue("profitMargin", roundToTwoDecimals(nextMargin));
    },
    [buyingPrice, form],
  );

  const syncSellingPriceFromProfitMargin = useCallback(
    (nextProfitMargin: number | null) => {
      if (typeof buyingPrice !== "number" || buyingPrice <= 0) {
        form.setFieldValue("sellingPrice", 0);
        return;
      }

      if (typeof nextProfitMargin !== "number") {
        return;
      }

      const nextSellingPrice = buyingPrice * (1 + nextProfitMargin / 100);
      form.setFieldValue("sellingPrice", roundToTwoDecimals(nextSellingPrice));
    },
    [buyingPrice, form],
  );

  return (
    <Card title="Pricing" size="small">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Buying Price" name="buyingPrice">
            <InputNumber
              min={0}
              precision={2}
              style={{ width: "100%" }}
              onChange={(value) => {
                if (typeof profitMargin === "number") {
                  syncSellingPriceFromProfitMargin(profitMargin);
                  return;
                }

                syncProfitMarginFromSellingPrice(sellingPrice ?? null);
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="MRP" name="mrp">
            <InputNumber min={0} precision={2} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Selling Price"
            name="sellingPrice"
            rules={[{ required: true, message: "Enter the selling price." }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: "100%" }}
              onChange={(value) => {
                syncProfitMarginFromSellingPrice(value);
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Minimum Selling Price" name="minimumSellingPrice">
            <InputNumber min={0} precision={2} style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Profit Margin %" name="profitMargin">
            <InputNumber
              min={0}
              precision={2}
              style={{ width: "100%" }}
              onChange={(value) => {
                syncSellingPriceFromProfitMargin(value);
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Tax Template" name="taxTemplate">
            <Input placeholder="Sales Taxes and Charges Template" />
          </Form.Item>
        </Col>
      </Row>

      <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
        UI margin preview:{" "}
        {computedMargin === null ? "Add buying and selling price." : `${computedMargin.toFixed(2)}%`}
      </Typography.Paragraph>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
        Selling price is saved via ERPNext Item Price. Buying price is kept for UI planning only.
      </Typography.Paragraph>
    </Card>
  );
}
