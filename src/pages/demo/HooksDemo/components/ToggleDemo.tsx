import { Card, Button, Space, Typography, Switch, Tag } from "antd";
import { useToggle } from "@/hooks";

const { Paragraph, Text } = Typography;

const ToggleDemo = () => {
  const modal = useToggle(false);
  const loading = useToggle(false);
  const visible = useToggle(true);

  const handleLoadingDemo = () => {
    loading.setTrue();
    setTimeout(() => {
      loading.setFalse();
    }, 2000);
  };

  return (
    <Card title="useToggle - 布尔值切换" extra={<Tag color="green">简洁</Tag>}>
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          提供更便捷的布尔值状态管理，比 useState
          更简洁。常用于控制模态框、加载状态等。
        </Paragraph>

        <Card size="small" title="示例 1：模态框控制">
          <Space>
            <Button type="primary" onClick={modal.toggle}>
              {modal.value ? "关闭" : "打开"}模态框
            </Button>
            <Text>
              状态：
              <Text strong type={modal.value ? "success" : "secondary"}>
                {modal.value ? "已打开" : "已关闭"}
              </Text>
            </Text>
          </Space>
        </Card>

        <Card size="small" title="示例 2：加载状态">
          <Space>
            <Button
              type="primary"
              loading={loading.value}
              onClick={handleLoadingDemo}
            >
              模拟加载
            </Button>
            <Text>
              状态：
              <Text strong type={loading.value ? "warning" : "success"}>
                {loading.value ? "加载中..." : "空闲"}
              </Text>
            </Text>
          </Space>
        </Card>

        <Card size="small" title="示例 3：显示/隐藏">
          <Space vertical style={{ width: "100%" }}>
            <Space>
              <Switch checked={visible.value} onChange={visible.toggle} />
              <Text>切换内容显示</Text>
            </Space>
            {visible.value && (
              <Card size="small" style={{ background: "#f0f2f5" }}>
                <Text>🎉 这是可以切换显示的内容！</Text>
              </Card>
            )}
          </Space>
        </Card>

        <Paragraph type="secondary">
          💡 提示：useToggle 提供了 toggle、setTrue、setFalse、setValue
          四种方法，比 useState 更语义化。
        </Paragraph>
      </Space>
    </Card>
  );
};

export default ToggleDemo;
