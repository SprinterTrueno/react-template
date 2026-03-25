import { useState } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Tag,
  Progress,
  Statistic
} from "antd";
import { useInterval, useToggle } from "@/hooks";

const { Paragraph } = Typography;

const IntervalDemo = () => {
  const [count, setCount] = useState(0);
  const { value: isRunning, toggle: toggleRunning } = useToggle(true);

  const [seconds, setSeconds] = useState(0);
  const {
    value: isTimerRunning,
    toggle: toggleTimer,
    setFalse: stopTimer
  } = useToggle(false);

  const [progress, setProgress] = useState(0);
  const {
    value: isProgressRunning,
    setTrue: startProgress,
    setFalse: stopProgress
  } = useToggle(false);

  // 示例 1：简单计数器
  useInterval(
    () => {
      setCount((prev) => prev + 1);
    },
    isRunning ? 1000 : null
  );

  // 示例 2：倒计时
  useInterval(
    () => {
      setSeconds((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    },
    isTimerRunning ? 1000 : null
  );

  // 示例 3：进度条
  useInterval(
    () => {
      setProgress((prev) => {
        if (prev >= 100) {
          stopProgress();
          return 100;
        }
        return prev + 1;
      });
    },
    isProgressRunning ? 50 : null
  );

  const handleStartTimer = () => {
    setSeconds(10);
    toggleTimer();
  };

  const handleStartProgress = () => {
    setProgress(0);
    startProgress();
  };

  return (
    <Card title="useInterval - 定时器" extra={<Tag color="blue">安全</Tag>}>
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          安全的定时器管理，自动处理清理，避免内存泄漏。支持动态控制定时器的启动和暂停。
        </Paragraph>

        <Card size="small" title="示例 1：计数器">
          <Space vertical style={{ width: "100%" }}>
            <Statistic title="计数" value={count} />
            <Space>
              <Button type="primary" onClick={toggleRunning}>
                {isRunning ? "暂停" : "继续"}
              </Button>
              <Button onClick={() => setCount(0)}>重置</Button>
            </Space>
          </Space>
        </Card>

        <Card size="small" title="示例 2：倒计时">
          <Space vertical style={{ width: "100%" }}>
            <Statistic
              title="倒计时"
              value={seconds}
              suffix="秒"
              styles={{
                content: {
                  color: seconds <= 3 && seconds > 0 ? "#ff4d4f" : undefined
                }
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={handleStartTimer}
                disabled={isTimerRunning}
              >
                开始倒计时（10秒）
              </Button>
              {isTimerRunning && (
                <Button danger onClick={stopTimer}>
                  停止
                </Button>
              )}
            </Space>
          </Space>
        </Card>

        <Card size="small" title="示例 3：进度条动画">
          <Space vertical style={{ width: "100%" }}>
            <Progress
              percent={progress}
              status={progress === 100 ? "success" : "active"}
            />
            <Space>
              <Button
                type="primary"
                onClick={handleStartProgress}
                disabled={isProgressRunning}
              >
                开始加载
              </Button>
              {isProgressRunning && (
                <Button danger onClick={stopProgress}>
                  停止
                </Button>
              )}
              <Button onClick={() => setProgress(0)}>重置</Button>
            </Space>
          </Space>
        </Card>

        <Paragraph type="secondary">
          💡 提示：useInterval 会自动清理定时器，避免内存泄漏。传入 null
          可以暂停定时器。
        </Paragraph>
      </Space>
    </Card>
  );
};

export default IntervalDemo;
