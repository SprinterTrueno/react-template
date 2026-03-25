import { useState } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Tag,
  Input,
  message,
  List
} from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { useCopyToClipboard } from "@/hooks";

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const CopyToClipboardDemo = () => {
  const { copiedText, copy, reset } = useCopyToClipboard();
  const [customText, setCustomText] = useState("Hello, Aone Copilot!");

  const handleCopy = async (text: string) => {
    const success = await copy(text);
    if (success) {
      message.success("复制成功！");
      setTimeout(reset, 2000);
    } else {
      message.error("复制失败，请手动复制");
    }
  };

  const codeSnippets = [
    {
      title: "React Hook 示例",
      code: `const { copiedText, copy } = useCopyToClipboard();

const handleCopy = async () => {
  const success = await copy('要复制的文本');
  if (success) {
    message.success('复制成功！');
  }
};`
    },
    {
      title: "API 请求示例",
      code: `const response = await fetch('/api/users');
const data = await response.json();
console.log(data);`
    },
    {
      title: "TypeScript 接口",
      code: `interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}`
    }
  ];

  return (
    <Card
      title="useCopyToClipboard - 复制到剪贴板"
      extra={<Tag color="purple">实用</Tag>}
    >
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          一键复制功能，自动处理兼容性和错误。提升用户体验，常用于复制代码、链接等场景。
        </Paragraph>

        <Card size="small" title="示例 1：自定义文本复制">
          <Space vertical style={{ width: "100%" }}>
            <TextArea
              rows={3}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="输入要复制的文本..."
            />
            <Space>
              <Button
                type="primary"
                icon={
                  copiedText === customText ? (
                    <CheckOutlined />
                  ) : (
                    <CopyOutlined />
                  )
                }
                onClick={() => handleCopy(customText)}
              >
                {copiedText === customText ? "已复制" : "复制文本"}
              </Button>
              {copiedText && (
                <Text type="success">
                  ✓ 已复制：{copiedText.substring(0, 20)}
                  {copiedText.length > 20 ? "..." : ""}
                </Text>
              )}
            </Space>
          </Space>
        </Card>

        <Card size="small" title="示例 2：代码片段复制">
          <List
            dataSource={codeSnippets}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="copy"
                    type="link"
                    icon={
                      copiedText === item.code ? (
                        <CheckOutlined />
                      ) : (
                        <CopyOutlined />
                      )
                    }
                    onClick={() => handleCopy(item.code)}
                  >
                    {copiedText === item.code ? "已复制" : "复制"}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={
                    <pre
                      style={{
                        background: "#f5f5f5",
                        padding: 12,
                        borderRadius: 4,
                        overflow: "auto",
                        margin: "8px 0 0 0"
                      }}
                    >
                      <code>{item.code}</code>
                    </pre>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        <Card size="small" title="示例 3：快捷复制">
          <Space wrap>
            <Button
              icon={<CopyOutlined />}
              onClick={() => handleCopy("https://copilot.code.alibaba-inc.com")}
            >
              复制官网链接
            </Button>
            <Button
              icon={<CopyOutlined />}
              onClick={() => handleCopy("npm install @aone/copilot")}
            >
              复制安装命令
            </Button>
            <Button
              icon={<CopyOutlined />}
              onClick={() => handleCopy("support@aone.alibaba-inc.com")}
            >
              复制邮箱地址
            </Button>
          </Space>
        </Card>

        <Paragraph type="secondary">
          💡 提示：useCopyToClipboard 自动处理新旧浏览器的兼容性，优先使用
          Clipboard API，降级使用 document.execCommand。
        </Paragraph>
      </Space>
    </Card>
  );
};

export default CopyToClipboardDemo;
