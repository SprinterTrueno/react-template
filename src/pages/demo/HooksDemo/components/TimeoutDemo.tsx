import { useState } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Tag,
  Alert,
  message,
  Progress
} from "antd";
import { useTimeout, useToggle } from "@/hooks";

const { Paragraph, Text } = Typography;

const TimeoutDemo = () => {
  const [showTip, setShowTip] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { value: isAutoClose, toggle: toggleAutoClose } = useToggle(false);

  // 示例 1：自动关闭提示（3秒后）
  useTimeout(
    () => {
      setShowTip(false);
      message.info("提示已自动关闭");
    },
    showTip ? 3000 : null
  );

  // 示例 2：倒计时
  useTimeout(
    () => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1);
      }
    },
    countdown > 0 ? 1000 : null
  );

  // 示例 3：自动关闭通知
  useTimeout(
    () => {
      toggleAutoClose();
      message.success("通知已自动关闭");
    },
    isAutoClose ? 5000 : null
  );

  const handleShowTip = () => {
    setShowTip(true);
    message.success("提示已显示，将在 3 秒后自动关闭");
  };

  const handleStartCountdown = () => {
    setCountdown(10);
  };

  const handleShowAutoClose = () => {
    toggleAutoClose();
    message.info("通知将在 5 秒后自动关闭");
  };

  return (
    <Card title="useTimeout - 延迟执行" extra={<Tag color="cyan">实用</Tag>}>
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          在指定延迟后执行回调函数，自动清理定时器。常用于自动关闭提示、延迟加载等场景。
        </Paragraph>

        <Card size="small" title="示例 1：自动关闭提示">
          <Space vertical style={{ width: "100%" }}>
            <Space>
              <Button type="primary" onClick={handleShowTip} disabled={showTip}>
                显示提示
              </Button>
              {showTip && (
                <Alert
                  title="这是一条提示信息"
                  description="将在 3 秒后自动关闭"
                  type="info"
                  showIcon
                  closable={{ onClose: () => setShowTip(false) }}
                />
              )}
            </Space>
          </Space>
        </Card>

        <Card size="small" title="示例 2：倒计时">
          <Space vertical style={{ width: "100%" }}>
            <Space>
              <Button
                type="primary"
                onClick={handleStartCountdown}
                disabled={countdown > 0}
              >
                开始倒计时（10秒）
              </Button>
              {countdown > 0 && (
                <Space>
                  <Text strong style={{ fontSize: 24, color: "#1890ff" }}>
                    {countdown}
                  </Text>
                  <Text type="secondary">秒</Text>
                </Space>
              )}
            </Space>
            {countdown > 0 && (
              <Progress
                percent={((10 - countdown) / 10) * 100}
                status="active"
                showInfo={false}
              />
            )}
          </Space>
        </Card>

        <Card size="small" title="示例 3：自动关闭通知">
          <Space vertical style={{ width: "100%" }}>
            <Space>
              <Button
                type="primary"
                onClick={handleShowAutoClose}
                disabled={isAutoClose}
              >
                显示通知
              </Button>
              {isAutoClose && (
                <Alert
                  title="重要通知"
                  description="这条通知将在 5 秒后自动关闭"
                  type="warning"
                  showIcon
                  closable={{ onClose: toggleAutoClose }}
                />
              )}
            </Space>
          </Space>
        </Card>

        <Alert
          title="使用场景"
          description={
            <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
              <li>自动关闭提示/通知</li>
              <li>延迟显示内容</li>
              <li>防止快速点击</li>
              <li>延迟加载</li>
              <li>倒计时功能</li>
            </ul>
          }
          type="info"
          showIcon
        />

        <Paragraph type="secondary">
          💡 提示：useTimeout 与 useInterval 的区别
          <br />
          • useTimeout：延迟后执行一次
          <br />• useInterval：定期重复执行
        </Paragraph>
      </Space>
    </Card>
  );
};

export default TimeoutDemo;
