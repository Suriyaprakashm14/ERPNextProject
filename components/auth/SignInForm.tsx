"use client";

import { Alert, Button, Flex, Form, Input, Typography } from "antd";

import { useSignIn } from "@/features/auth/hooks";

type SignInFields = {
  username: string;
  password: string;
};

export default function SignInForm() {
  const [form] = Form.useForm<SignInFields>();
  const { clearError, error, isPending, submit } = useSignIn();

  async function handleFinish(values: SignInFields) {
    try {
      await submit({
        username: values.username.trim(),
        password: values.password,
      });
    } catch {
      return;
    }
  }

  return (
    <Flex vertical gap={20}>
      <Flex vertical gap={4}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Welcome back
        </Typography.Title>
        <Typography.Text type="secondary">
          Sign in with your ERPNext account to continue.
        </Typography.Text>
      </Flex>

      {error ? (
        <Alert
          showIcon
          type="error"
          message="Sign-in failed"
          description={error}
        />
      ) : null}

      <Form<SignInFields>
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={(values) => {
          void handleFinish(values);
        }}
        onValuesChange={() => {
          if (error) {
            clearError();
          }
        }}
      >
        <Form.Item<SignInFields>
          label="Username or email"
          name="username"
          rules={[
            {
              required: true,
              message: "Enter your ERPNext username or email.",
            },
          ]}
        >
          <Input allowClear placeholder="Enter your ERPNext username" />
        </Form.Item>

        <Form.Item<SignInFields>
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Enter your password.",
            },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 12 }}>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            The password is submitted from this Next.js app to your ERPNext site
            using the default Frappe session login API.
          </Typography.Paragraph>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button block type="primary" htmlType="submit" loading={isPending}>
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}
