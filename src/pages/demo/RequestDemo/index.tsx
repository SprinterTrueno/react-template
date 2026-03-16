import { useState } from "react";
import { Button, Card, Space, Typography, Alert, Spin, Divider } from "antd";
import { request, requestPlus } from "@/utils";
import styles from "./index.module.less";

const { Title, Paragraph, Text } = Typography;

interface TestResult {
  id: string;
  name: string;
  status: "success" | "error" | "loading";
  url: string;
  params?: unknown;
  data?: unknown;
  error?: string;
}

const RequestDemo = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const startTest = (name: string, url: string, params?: unknown) => {
    setTestResult({
      id: `test-${Date.now()}`,
      name,
      url,
      params,
      status: "loading"
    });
  };

  const updateTestResult = (updates: Partial<TestResult>) => {
    setTestResult((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const clearResult = () => {
    setTestResult(null);
  };

  // 测试 request GET 请求
  const testRequestGet = async () => {
    const url = "https://jsonplaceholder.typicode.com/posts";
    const params = { _limit: 3 };
    startTest("request.get - 获取文章列表", url, params);

    try {
      const data = await request.get(url, params);
      updateTestResult({ status: "success", data });
    } catch (error) {
      updateTestResult({
        status: "error",
        error: error instanceof Error ? error.message : "请求失败"
      });
    }
  };

  // 测试 request POST 请求
  const testRequestPost = async () => {
    const url = "https://jsonplaceholder.typicode.com/posts";
    const params = {
      title: "测试文章",
      body: "这是用 request 创建的文章",
      userId: 1
    };
    startTest("request.post - 创建文章", url, params);

    try {
      const data = await request.post(url, params);
      updateTestResult({ status: "success", data });
    } catch (error) {
      updateTestResult({
        status: "error",
        error: error instanceof Error ? error.message : "请求失败"
      });
    }
  };

  // 测试 request PUT 请求
  const testRequestPut = async () => {
    const url = "https://jsonplaceholder.typicode.com/posts/1";
    const params = {
      id: 1,
      title: "更新后的标题",
      body: "更新后的内容",
      userId: 1
    };
    startTest("request.put - 更新文章", url, params);

    try {
      const data = await request.put(url, params);
      updateTestResult({ status: "success", data });
    } catch (error) {
      updateTestResult({
        status: "error",
        error: error instanceof Error ? error.message : "请求失败"
      });
    }
  };

  // 测试 request DELETE 请求
  const testRequestDelete = async () => {
    const url = "https://jsonplaceholder.typicode.com/posts/1";
    startTest("request.delete - 删除文章", url);

    try {
      const data = await request.delete(url);
      updateTestResult({ status: "success", data });
    } catch (error) {
      updateTestResult({
        status: "error",
        error: error instanceof Error ? error.message : "请求失败"
      });
    }
  };

  // 测试 requestPlus GET 请求
  const testRequestPlusGet = async () => {
    const url = "https://jsonplaceholder.typicode.com/users";
    const params = { _limit: 3 };
    startTest("requestPlus.get - 获取用户列表", url, params);

    try {
      const data = await requestPlus.get(url, params);
      updateTestResult({ status: "success", data });
    } catch (error) {
      updateTestResult({
        status: "error",
        error: error instanceof Error ? error.message : "请求失败"
      });
    }
  };

  // 测试 requestPlus POST 请求
  const testRequestPlusPost = async () => {
    const url = "https://jsonplaceholder.typicode.com/users";
    const params = {
      name: "张三",
      email: "zhangsan@example.com",
      phone: "123-456-7890"
    };
    startTest("requestPlus.post - 创建用户", url, params);

    try {
      const data = await requestPlus.post(url, params);
      updateTestResult({ status: "success", data });
    } catch (error) {
      updateTestResult({
        status: "error",
        error: error instanceof Error ? error.message : "请求失败"
      });
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={2}>🧪 Request 工具体验页面</Title>
            <Paragraph>本页面用于测试和体验项目中的两个请求工具</Paragraph>
          </div>

          <Card type="inner" title="📦 request - 简化版（函数式）">
            <Paragraph>
              <Text strong>特点：</Text>
              <ul>
                <li>轻量级、函数式设计</li>
                <li>支持 GET、POST、PUT、DELETE 等常用方法</li>
                <li>自动处理 JSON 数据</li>
                <li>简单易用，适合快速开发</li>
              </ul>
            </Paragraph>
          </Card>

          <Card type="inner" title="🚀 requestPlus - 增强版（Class）">
            <Paragraph>
              <Text strong>特点：</Text>
              <ul>
                <li>面向对象设计，支持实例化</li>
                <li>支持请求/响应拦截器</li>
                <li>可配置默认参数</li>
                <li>适合复杂业务场景</li>
              </ul>
            </Paragraph>
          </Card>

          <Divider />

          <Space size="middle" wrap>
            <Button
              type="primary"
              size="large"
              onClick={testRequestGet}
              loading={testResult?.status === "loading"}
            >
              GET 请求
            </Button>
            <Button
              size="large"
              onClick={testRequestPost}
              loading={testResult?.status === "loading"}
            >
              POST 请求
            </Button>
            <Button
              size="large"
              onClick={testRequestPut}
              loading={testResult?.status === "loading"}
            >
              PUT 请求
            </Button>
            <Button
              size="large"
              onClick={testRequestDelete}
              loading={testResult?.status === "loading"}
            >
              DELETE 请求
            </Button>
            <Button
              size="large"
              onClick={testRequestPlusGet}
              loading={testResult?.status === "loading"}
            >
              requestPlus GET
            </Button>
            <Button
              size="large"
              onClick={testRequestPlusPost}
              loading={testResult?.status === "loading"}
            >
              requestPlus POST
            </Button>
            {testResult && (
              <Button danger onClick={clearResult}>
                清空结果
              </Button>
            )}
          </Space>

          {testResult && (
            <>
              <Divider>测试结果</Divider>
              <Card
                size="small"
                title={
                  <Space>
                    {testResult.status === "loading" && <Spin size="small" />}
                    {testResult.status === "success" && <span>✅</span>}
                    {testResult.status === "error" && <span>❌</span>}
                    <Text>{testResult.name}</Text>
                  </Space>
                }
                className={styles.resultCard}
              >
                {testResult.status === "loading" && (
                  <Text type="secondary">请求中...</Text>
                )}
                {testResult.status === "success" && (
                  <Space orientation="vertical" style={{ width: "100%" }}>
                    <Alert
                      title="请求信息"
                      description={
                        <div>
                          <div>
                            <Text strong>URL: </Text>
                            <Text code>{testResult.url}</Text>
                          </div>
                          {testResult.params ? (
                            <div style={{ marginTop: 8 }}>
                              <Text strong>参数:</Text>
                              <pre className={styles.resultCard}>
                                {JSON.stringify(
                                  testResult.params as unknown,
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          ) : null}
                        </div>
                      }
                      type="info"
                      showIcon
                    />
                    <Alert
                      title="响应结果"
                      description={
                        <pre className={styles.resultCard}>
                          {JSON.stringify(testResult.data as unknown, null, 2)}
                        </pre>
                      }
                      type="success"
                      showIcon
                    />
                  </Space>
                )}
                {testResult.status === "error" && (
                  <Space orientation="vertical" style={{ width: "100%" }}>
                    <Alert
                      title="请求信息"
                      description={
                        <div>
                          <div>
                            <Text strong>URL: </Text>
                            <Text code>{testResult.url}</Text>
                          </div>
                          {testResult.params ? (
                            <div style={{ marginTop: 8 }}>
                              <Text strong>参数:</Text>
                              <pre className={styles.resultCard}>
                                {JSON.stringify(
                                  testResult.params as unknown,
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          ) : null}
                        </div>
                      }
                      type="info"
                      showIcon
                    />
                    <Alert
                      title="请求失败"
                      description={testResult.error}
                      type="error"
                      showIcon
                    />
                  </Space>
                )}
              </Card>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default RequestDemo;
