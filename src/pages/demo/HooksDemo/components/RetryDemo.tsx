import { useState, useRef } from "react";
import { Card, Button, Space, Typography, Tag, message } from "antd";
import { useRequestPro } from "@/hooks";

const { Paragraph, Text } = Typography;

interface RetryLog {
  id: string;
  message: string;
}

const RetryDemo = () => {
  const [retryLogs, setRetryLogs] = useState<RetryLog[]>([]);
  const retryCountRef = useRef(0);
  const logIdRef = useRef(0);

  // 模拟 API
  const mockGetUserWithRetry = async (userId: string) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    retryCountRef.current += 1;

    if (retryCountRef.current < 4) {
      throw new Error("网络错误");
    }

    return {
      id: userId,
      username: "王五",
      email: "wangwu@example.com"
    };
  };

  const {
    loading,
    data,
    run: fetchUserWithRetry
  } = useRequestPro(mockGetUserWithRetry, {
    enableRetry: true,
    retryCount: 3,
    retryDelay: 1000,
    onRetry: (attempt, error) => {
      logIdRef.current += 1;
      const log = {
        id: `log-${logIdRef.current}`,
        message: `第 ${attempt} 次重试... 错误：${error.message}`
      };
      setRetryLogs((prev) => [...prev, log]);
    },
    onSuccess: () => {
      logIdRef.current += 1;
      setRetryLogs((prev) => [
        ...prev,
        { id: `log-${logIdRef.current}`, message: "✅ 最终成功！" }
      ]);
      message.success("重试成功！");
    },
    onError: (error) => {
      logIdRef.current += 1;
      setRetryLogs((prev) => [
        ...prev,
        {
          id: `log-${logIdRef.current}`,
          message: `❌ 最终失败：${error.message}`
        }
      ]);
      message.error("重试失败");
    }
  });

  const handleRetryTest = () => {
    retryCountRef.current = 0;
    logIdRef.current = 0;
    setRetryLogs([{ id: "log-0", message: "开始请求..." }]);
    fetchUserWithRetry("789");
  };

  return (
    <Card
      title="useRequestPro - 自动重试"
      extra={<Tag color="orange">重试 3 次</Tag>}
    >
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          网络不稳定时，会自动重试 3 次，每次间隔 1
          秒。前两次会失败，第三次会成功。
        </Paragraph>
        <Space>
          <Button type="primary" loading={loading} onClick={handleRetryTest}>
            获取用户信息（自动重试）
          </Button>
          {data && (
            <Text>
              用户名：<Text strong>{data.username}</Text>
            </Text>
          )}
        </Space>

        {/* 重试日志 */}
        {retryLogs.length > 0 && (
          <Card size="small" title="重试日志" style={{ marginTop: 16 }}>
            <Space vertical style={{ width: "100%" }}>
              {retryLogs.map((log) => {
                let textType: "danger" | "success" | "secondary" = "secondary";
                if (log.message.includes("❌")) {
                  textType = "danger";
                } else if (log.message.includes("✅")) {
                  textType = "success";
                }

                return (
                  <Text key={log.id} type={textType}>
                    {log.message}
                  </Text>
                );
              })}
            </Space>
          </Card>
        )}

        <Paragraph type="secondary">
          点击后会看到完整的重试过程，每次间隔 1 秒。观察重试日志的变化。
        </Paragraph>
      </Space>
    </Card>
  );
};

export default RetryDemo;
