"use client";

import { Card, Form, Select, Space, Switch, Tag, Typography } from "antd";

import type { StockItemFormValues } from "@/features/stock/stockTypes";

const colorOptions = ["Red", "Blue", "Green", "Black", "White", "Mustard"];
const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
const styleOptions = ["Slim", "Regular", "A-Line", "Straight", "Festive"];

function buildVariantPreview(colors: string[], sizes: string[], styles: string[]) {
  const preview: string[] = [];

  for (const color of colors.length ? colors : ["Standard"]) {
    for (const size of sizes.length ? sizes : ["Free Size"]) {
      for (const style of styles.length ? styles : ["Base"]) {
        preview.push([color, size, style].filter(Boolean).join(" / "));
      }
    }
  }

  return preview;
}

export default function VariantSection() {
  const form = Form.useFormInstance<StockItemFormValues>();
  const hasVariants = Form.useWatch("hasVariants", form) ?? false;
  const colors = Form.useWatch("colors", form) ?? [];
  const sizes = Form.useWatch("sizes", form) ?? [];
  const styles = Form.useWatch("styles", form) ?? [];
  const preview = hasVariants ? buildVariantPreview(colors, sizes, styles) : [];
  const previewItems = preview.slice(0, 12);

  return (
    <Card title="Variants" size="small">
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
        <Form.Item
          label="Has Variants"
          name="hasVariants"
          valuePropName="checked"
          style={{ marginBottom: 0 }}
        >
          <Switch />
        </Form.Item>

        <Form.Item label="Color" name="colors">
          <Select
            mode="multiple"
            options={colorOptions.map((value) => ({ label: value, value }))}
            placeholder="Select colors"
          />
        </Form.Item>

        <Form.Item label="Size" name="sizes">
          <Select
            mode="multiple"
            options={sizeOptions.map((value) => ({ label: value, value }))}
            placeholder="Select sizes"
          />
        </Form.Item>

        <Form.Item label="Style" name="styles" style={{ marginBottom: 0 }}>
          <Select
            mode="multiple"
            options={styleOptions.map((value) => ({ label: value, value }))}
            placeholder="Select styles"
          />
        </Form.Item>

        {hasVariants ? (
          <Space orientation="vertical" size="small" style={{ width: "100%" }}>
            <Typography.Text strong>Variant Preview</Typography.Text>
            <div>
              {previewItems.length > 0 ? (
                previewItems.map((variant) => (
                  <Tag key={variant} color="blue" style={{ marginBottom: 8 }}>
                    {variant}
                  </Tag>
                ))
              ) : (
                <Typography.Text type="secondary">
                  Choose color, size or style values to preview future variants.
                </Typography.Text>
              )}
              {preview.length > previewItems.length ? (
                <Tag color="gold">+{preview.length - previewItems.length} more</Tag>
              ) : null}
            </div>
            <Typography.Text type="secondary">
              Preview only. ERPNext variants are not created from this screen yet.
            </Typography.Text>
            {/* TODO: Add ERPNext variant creation flow after the backend template process is finalized. */}
          </Space>
        ) : null}
      </Space>
    </Card>
  );
}
