import { useState } from "react";
import { Card, Button, Space, Typography, Tag, message } from "antd";
import { useRequestPro } from "@/hooks";

const { Paragraph, Text } = Typography;

const MutationDemo = () => {
  const [postData, setPostData] = useState({
    id: "1",
    title: "React Hooks 最佳实践",
    liked: false,
    likes: 42
  });

  // 模拟 API
  const mockLikePost = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    const shouldFail = Math.random() > 0.7;
    if (shouldFail) {
      throw new Error("网络错误，点赞失败");
    }

    return {
      ...postData,
      liked: !postData.liked,
      likes: postData.liked ? postData.likes - 1 : postData.likes + 1
    };
  };

  const {
    loading,
    mutate: mutateLikes,
    run: likePost
  } = useRequestPro(mockLikePost, {
    onSuccess: (result) => {
      setPostData(result);
      message.success(result.liked ? "点赞成功！" : "取消点赞成功！");
    }
  });

  const handleOptimisticLike = async () => {
    const oldData = { ...postData };
    const newData = {
      ...postData,
      liked: !postData.liked,
      likes: postData.liked ? postData.likes - 1 : postData.likes + 1
    };
    mutateLikes(newData);
    setPostData(newData);

    try {
      await likePost();
    } catch {
      mutateLikes(oldData);
      setPostData(oldData);
      message.error("点赞失败，已回滚");
    }
  };

  return (
    <Card
      title="useRequestPro - Mutation（乐观更新）"
      extra={<Tag color="green">立即响应</Tag>}
    >
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          模拟文章的点赞功能：点击后立即更新
          UI，不用等待请求完成。如果请求失败，会自动回滚。
        </Paragraph>

        {/* 文章卡片 */}
        <Card
          size="small"
          style={{
            background: "#f5f5f5",
            border: "1px solid #d9d9d9"
          }}
        >
          <Space vertical style={{ width: "100%" }}>
            <Text strong style={{ fontSize: 16 }}>
              {postData.title}
            </Text>
            <Button
              type={postData.liked ? "primary" : "default"}
              danger={postData.liked}
              loading={loading}
              onClick={handleOptimisticLike}
              icon={postData.liked ? "❤️" : "🤍"}
            >
              {postData.liked ? "已点赞" : "点赞"}
              <Text
                strong
                style={{
                  marginLeft: 8,
                  color: postData.liked ? "#fff" : "#000"
                }}
              >
                {postData.likes}
              </Text>
            </Button>
          </Space>
        </Card>

        <div style={{ marginTop: 16 }}>
          <Text strong>乐观更新的优势：</Text>
          <div>✅ 点击后立即响应，不用等待 1 秒的请求时间</div>
          <div>✅ 用户体验更流畅，感觉更快</div>
          <div>✅ 失败时自动回滚，保证数据一致性</div>
        </div>

        <Paragraph type="warning" style={{ marginTop: 8 }}>
          ⚠️ 注意：请求有 30%
          概率失败，失败时会自动回滚。多点几次试试看回滚效果！
        </Paragraph>

        <div style={{ marginTop: 8 }}>
          <Text strong>实现原理：</Text>
          <pre
            style={{
              background: "#f5f5f5",
              padding: 12,
              borderRadius: 4,
              fontSize: 12
            }}
          >
            {`// 1. 保存旧值
const oldData = { ...postData };

// 2. 立即更新 UI（乐观更新）
mutate(newData);
setPostData(newData);

// 3. 发送请求
try {
  await likePost();
} catch (error) {
  // 4. 失败了，回滚
  mutate(oldData);
  setPostData(oldData);
}`}
          </pre>
        </div>
      </Space>
    </Card>
  );
};

export default MutationDemo;
