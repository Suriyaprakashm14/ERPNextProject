import { Card, Col, Flex, Row, Tag } from "antd";
import { redirect } from "next/navigation";

import SignInForm from "@/components/auth/SignInForm";
import { DEFAULT_AUTH_REDIRECT } from "@/lib/auth-config";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getAuthenticatedUser();

  if (user) {
    redirect(DEFAULT_AUTH_REDIRECT);
  }

  return (
    <Flex
      component="main"
      align="center"
      justify="center"
      style={{ minHeight: "100vh", padding: 24 }}
    >
      <Card
        variant="outlined"
        style={{ width: "100%", maxWidth: 1080 }}
        styles={{ body: { padding: 0 } }}
      >
        <Row gutter={0}>
          <Col xs={24} md={13}>
            <Flex
              vertical
              gap="middle"
              style={{ minHeight: "100%", padding: 32 }}
            >
              <Tag color="orange" variant="filled">
                ERPNext Textile Suite
              </Tag>
              <h1
                style={{
                  margin: 0,
                  fontSize: 30,
                  lineHeight: 1.2,
                  fontWeight: 600,
                }}
              >
                Sign in to your workspace
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "rgba(0, 0, 0, 0.65)",
                  fontSize: 16,
                  lineHeight: 1.6,
                }}
              >
                Use your ERPNext username or email and password. This screen
                signs in directly against ERPNext&apos;s default session
                endpoints.
              </p>
            </Flex>
          </Col>

          <Col xs={24} md={11}>
            <Flex vertical justify="center" style={{ height: "100%", padding: 32 }}>
              <SignInForm />
            </Flex>
          </Col>
        </Row>
      </Card>
    </Flex>
  );
}
