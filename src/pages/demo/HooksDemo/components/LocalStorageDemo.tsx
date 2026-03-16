import { Card, Input, Button, Space, Typography } from "antd";
import { useLocalStorage } from "@/hooks";

const { Paragraph, Text } = Typography;

const LocalStorageDemo = () => {
  const [storedName, setStoredName, removeStoredName] = useLocalStorage<string>(
    "demo_name",
    ""
  );

  return (
    <Card title="useLocalStorage - 本地存储 Hook">
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          数据会自动同步到 localStorage，刷新页面后数据依然存在。
        </Paragraph>
        <Input
          placeholder="输入你的名字"
          value={storedName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setStoredName(e.target.value);
          }}
        />
        <div>
          <Text strong>存储的值：</Text> {storedName || "（空）"}
        </div>
        <Button danger onClick={removeStoredName}>
          清除存储
        </Button>
      </Space>
    </Card>
  );
};

export default LocalStorageDemo;
