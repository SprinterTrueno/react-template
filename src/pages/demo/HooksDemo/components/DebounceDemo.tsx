import { useState } from "react";
import { Card, Input, Space, Typography } from "antd";
import { useDebounce } from "@/hooks";

const { Paragraph, Text } = Typography;

const DebounceDemo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <Card title="useDebounce - 防抖 Hook">
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          输入内容后，防抖值会在 500ms 后更新，减少不必要的操作。
        </Paragraph>
        <Input
          placeholder="输入搜索内容"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
          }}
        />
        <div>
          <Text strong>实时值：</Text> {searchTerm}
        </div>
        <div>
          <Text strong>防抖值：</Text> {debouncedSearchTerm}
        </div>
      </Space>
    </Card>
  );
};

export default DebounceDemo;
