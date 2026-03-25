import { Card, Space, Typography, Tag, Alert, Progress } from "antd";
import { useWindowSize } from "@/hooks";

const { Paragraph, Text, Title } = Typography;

const WindowSizeDemo = () => {
  const { width, height } = useWindowSize();

  // 计算设备类型
  const getDeviceType = () => {
    if (width < 576) return { type: "手机", color: "red" };
    if (width < 768) return { type: "平板（竖屏）", color: "orange" };
    if (width < 992) return { type: "平板（横屏）", color: "gold" };
    if (width < 1200) return { type: "小屏桌面", color: "blue" };
    if (width < 1600) return { type: "中屏桌面", color: "green" };
    return { type: "大屏桌面", color: "purple" };
  };

  const device = getDeviceType();

  // 计算宽度百分比（相对于常见的 1920px）
  const widthPercent = Math.min((width / 1920) * 100, 100);

  return (
    <Card
      title="useWindowSize - 窗口尺寸"
      extra={<Tag color="volcano">响应式</Tag>}
    >
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          实时获取窗口的宽度和高度，自动响应窗口大小变化。响应式设计必备！
        </Paragraph>

        <Card size="small" title="当前窗口信息">
          <Space vertical style={{ width: "100%" }}>
            <Space size="large">
              <div>
                <Text type="secondary">宽度</Text>
                <Title level={2} style={{ margin: 0 }}>
                  {width}
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    {" "}
                    px
                  </Text>
                </Title>
              </div>
              <div>
                <Text type="secondary">高度</Text>
                <Title level={2} style={{ margin: 0 }}>
                  {height}
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    {" "}
                    px
                  </Text>
                </Title>
              </div>
              <div>
                <Text type="secondary">设备类型</Text>
                <div>
                  <Tag
                    color={device.color}
                    style={{ fontSize: 16, padding: "4px 12px" }}
                  >
                    {device.type}
                  </Tag>
                </div>
              </div>
            </Space>

            <div>
              <Text type="secondary">宽度占比（相对于 1920px）</Text>
              <Progress percent={Math.round(widthPercent)} status="active" />
            </div>
          </Space>
        </Card>

        <Card size="small" title="响应式断点">
          <Space vertical style={{ width: "100%" }}>
            <Space wrap>
              <Tag color={width < 576 ? "red" : "default"}>
                手机 (&lt; 576px)
              </Tag>
              <Tag color={width >= 576 && width < 768 ? "orange" : "default"}>
                平板竖屏 (≥ 576px)
              </Tag>
              <Tag color={width >= 768 && width < 992 ? "gold" : "default"}>
                平板横屏 (≥ 768px)
              </Tag>
              <Tag color={width >= 992 && width < 1200 ? "blue" : "default"}>
                小屏桌面 (≥ 992px)
              </Tag>
              <Tag color={width >= 1200 && width < 1600 ? "green" : "default"}>
                中屏桌面 (≥ 1200px)
              </Tag>
              <Tag color={width >= 1600 ? "purple" : "default"}>
                大屏桌面 (≥ 1600px)
              </Tag>
            </Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              💡 调整浏览器窗口大小，观察断点变化
            </Text>
          </Space>
        </Card>

        <Card size="small" title="实际应用示例">
          <Space vertical style={{ width: "100%" }}>
            <div
              style={{
                padding: 16,
                background: width < 768 ? "#fff1f0" : "#f0f5ff",
                border: `1px solid ${width < 768 ? "#ffa39e" : "#adc6ff"}`,
                borderRadius: 4
              }}
            >
              {width < 768 ? (
                <Space vertical>
                  <Text strong>📱 移动端布局</Text>
                  <Text>当前宽度小于 768px，显示移动端优化的单列布局</Text>
                </Space>
              ) : (
                <Space vertical>
                  <Text strong>💻 桌面端布局</Text>
                  <Text>当前宽度大于等于 768px，显示桌面端的多列布局</Text>
                </Space>
              )}
            </div>
          </Space>
        </Card>

        <Alert
          title="使用场景"
          description={
            <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
              <li>响应式布局切换</li>
              <li>移动端/桌面端适配</li>
              <li>图表自适应尺寸</li>
              <li>动态计算元素尺寸</li>
              <li>全屏功能</li>
            </ul>
          }
          type="info"
          showIcon
        />

        <Paragraph type="secondary">
          💡 提示：useWindowSize 使用了防抖优化，避免频繁触发重渲染。
        </Paragraph>
      </Space>
    </Card>
  );
};

export default WindowSizeDemo;
