import { useState } from "react";
import { Card, Input, Space, Typography, Tag, Progress } from "antd";
import { useThrottle, useThrottleFn } from "@/hooks";

const { Paragraph, Text } = Typography;

const ThrottleDemo = () => {
  const [inputValue, setInputValue] = useState("");
  const throttledValue = useThrottle(inputValue, 500);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [callCount, setCallCount] = useState(0);
  const [throttledCallCount, setThrottledCallCount] = useState(0);

  const handleScroll = useThrottleFn((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } =
      e.target as HTMLDivElement;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
    setThrottledCallCount((prev) => prev + 1);
  }, 200);

  const handleScrollWithCount = (e: React.UIEvent<HTMLDivElement>) => {
    setCallCount((prev) => prev + 1);
    handleScroll(e);
  };

  return (
    <Card title="useThrottle - 节流" extra={<Tag color="orange">性能优化</Tag>}>
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          在指定时间内，无论触发多少次，只会在时间间隔内执行一次。适合处理滚动、拖拽等高频事件。
        </Paragraph>

        <Card size="small" title="示例 1：输入框节流（500ms）">
          <Space vertical style={{ width: "100%" }}>
            <Input
              placeholder="快速输入文字..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Space vertical>
              <Text>
                实时值：<Text code>{inputValue || "(空)"}</Text>
              </Text>
              <Text>
                节流后的值：<Text code>{throttledValue || "(空)"}</Text>
              </Text>
            </Space>
          </Space>
        </Card>

        <Card size="small" title="示例 2：滚动事件节流（200ms）">
          <Space vertical style={{ width: "100%" }}>
            <div
              style={{
                height: 200,
                overflow: "auto",
                border: "1px solid #d9d9d9",
                borderRadius: 4,
                padding: 16
              }}
              onScroll={handleScrollWithCount}
            >
              <div style={{ height: 800 }}>
                <Paragraph>快速滚动这个区域，观察节流效果...</Paragraph>
                <Paragraph>节流可以有效减少函数执行次数，提升性能。</Paragraph>
                <Paragraph>
                  与防抖不同，节流会在时间间隔内至少执行一次。
                </Paragraph>
                <Paragraph>
                  这使得节流更适合需要持续反馈的场景，如滚动进度条。
                </Paragraph>
                <Paragraph>继续滚动查看更多内容...</Paragraph>
                <Paragraph>节流的典型应用场景：</Paragraph>
                <ul>
                  <li>滚动事件监听</li>
                  <li>窗口 resize 事件</li>
                  <li>鼠标移动事件</li>
                  <li>拖拽操作</li>
                  <li>游戏中的技能冷却</li>
                </ul>
                <Paragraph>
                  通过节流，可以在保证用户体验的同时，大幅降低性能开销。
                </Paragraph>
              </div>
            </div>
            <Progress percent={Math.round(scrollProgress)} />
            <Space>
              <Text>
                触发次数：<Text strong>{callCount}</Text>
              </Text>
              <Text>
                节流后执行次数：
                <Text strong type="success">
                  {throttledCallCount}
                </Text>
              </Text>
              <Text type="secondary">
                （节流减少了 {callCount - throttledCallCount} 次执行）
              </Text>
            </Space>
          </Space>
        </Card>

        <Paragraph type="secondary">
          💡 提示：节流 vs 防抖
          <br />
          • 节流：在时间间隔内至少执行一次，适合需要持续反馈的场景
          <br />• 防抖：在停止触发后才执行，适合只需要最终结果的场景
        </Paragraph>
      </Space>
    </Card>
  );
};

export default ThrottleDemo;
