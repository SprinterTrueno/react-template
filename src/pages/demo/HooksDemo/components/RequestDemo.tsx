import { Card, Button, Space, Typography, message } from "antd";
import { useRequest } from "@/hooks";

const { Paragraph, Text } = Typography;

const RequestDemo = () => {
  // 模拟 API
  const mockGetUser = async (userId: string) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    return {
      id: userId,
      username: "张三",
      email: "zhangsan@example.com",
      role: "admin",
      createdAt: new Date().toISOString()
    };
  };

  const {
    loading,
    data,
    run: fetchUser
  } = useRequest(mockGetUser, {
    onSuccess: () => {
      message.success("获取用户信息成功");
    },
    onError: (error) => {
      message.error(`获取失败：${error.message}`);
    }
  });

  return (
    <Card title="useRequest - 请求管理 Hook">
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          自动管理请求的 loading、data、error 状态，支持成功/失败回调。
        </Paragraph>
        <Space>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              fetchUser("123");
            }}
          >
            获取用户信息
          </Button>
          {data && (
            <Text>
              用户名：<Text strong>{data.username}</Text>
            </Text>
          )}
        </Space>
        <Paragraph type="secondary">
          点击按钮后，loading 状态自动管理，成功后显示 message 提示。
        </Paragraph>
      </Space>
    </Card>
  );
};

export default RequestDemo;
