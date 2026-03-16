import { Card, Button, Space, Typography, Tag, message } from "antd";
import { useRequestPro, clearCache } from "@/hooks";

const { Paragraph, Text } = Typography;

const CacheDemo = () => {
  // 模拟 API
  const mockGetUserWithCache = async (userId: string) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    return {
      id: userId,
      username: "李四",
      email: "lisi@example.com",
      likes: Math.floor(Math.random() * 100)
    };
  };

  const {
    loading,
    data,
    run: fetchUserWithCache
  } = useRequestPro(mockGetUserWithCache, {
    enableCache: true,
    cacheKey: "user-cache-demo",
    cacheTime: 30 * 1000,
    refetchOnWindowFocus: true,
    onSuccess: () => {
      message.success("获取成功（已缓存）");
    }
  });

  return (
    <Card
      title="useRequestPro - 缓存功能"
      extra={<Tag color="blue">缓存 30 秒</Tag>}
    >
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          启用缓存后，30 秒内重复请求会直接返回缓存，不会发送新请求。注意观察
          likes 数字的变化。
        </Paragraph>
        <Space wrap>
          <Button
            type="primary"
            loading={loading}
            onClick={() => {
              fetchUserWithCache("456");
            }}
          >
            获取用户信息（带缓存）
          </Button>
          <Button
            onClick={() => {
              clearCache("user-cache-demo");
              message.success("缓存已清除");
            }}
          >
            清除缓存
          </Button>
          {data && (
            <Space>
              <Text>
                用户名：<Text strong>{data.username}</Text>
              </Text>
              <Text>
                Likes：<Text strong>{data.likes}</Text>
              </Text>
            </Space>
          )}
        </Space>
        <div style={{ marginTop: 16 }}>
          <Text strong>测试步骤：</Text>
          <div>1. 点击获取用户信息，记住 likes 数字</div>
          <div>2. 30 秒内再次点击，瞬间显示，likes 数字不变（使用缓存）</div>
          <div>3. 点击清除缓存，再次点击，likes 数字会变（重新请求）</div>
          <div>4. 切换到其他标签页，再切回来，会自动刷新数据</div>
        </div>
      </Space>
    </Card>
  );
};

export default CacheDemo;
