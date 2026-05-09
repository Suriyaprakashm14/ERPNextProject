import { Card, Flex, Tag } from "antd";

export default function Page() {
  return (
    <Card
      variant="borderless"
      style={{
        boxShadow: "0 18px 50px rgba(63, 39, 26, 0.12)",
      }}
    >
      <Flex vertical gap={16}>
        <Tag color="orange" style={{ width: "fit-content", marginInlineEnd: 0 }}>
          Dashboard
        </Tag>
        <div>
          <h1 style={{ margin: 0 }}>Authentication is connected</h1>
          <p style={{ margin: "12px 0 0", color: "rgba(0, 0, 0, 0.65)" }}>
            This workspace is now protected by ERPNext session authentication
            using the built-in Frappe login endpoint.
          </p>
        </div>
      </Flex>
    </Card>
  );
}
