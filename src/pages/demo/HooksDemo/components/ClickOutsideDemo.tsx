import { useRef, useState } from "react";
import { Card, Button, Space, Typography, Tag, Alert } from "antd";
import { useClickOutside, useToggle } from "@/hooks";

const { Paragraph, Text } = Typography;

const ClickOutsideDemo = () => {
  const [clickCount, setClickCount] = useState(0);
  const {
    value: isMenuOpen,
    setFalse: closeMenu,
    toggle: toggleMenu
  } = useToggle(false);
  const {
    value: isModalOpen,
    setFalse: closeModal,
    setTrue: openModal
  } = useToggle(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // 示例 1：下拉菜单
  useClickOutside(menuRef, () => {
    if (isMenuOpen) {
      closeMenu();
      setClickCount((prev) => prev + 1);
    }
  });

  // 示例 2：模态框
  useClickOutside(modalRef, () => {
    if (isModalOpen) {
      closeModal();
    }
  });

  return (
    <Card
      title="useClickOutside - 点击外部区域"
      extra={<Tag color="red">高频</Tag>}
    >
      <Space vertical style={{ width: "100%" }}>
        <Paragraph>
          检测点击事件是否发生在指定元素外部，常用于关闭下拉菜单、弹窗、日期选择器等。
        </Paragraph>

        <Card size="small" title="示例 1：下拉菜单">
          <Space vertical style={{ width: "100%" }}>
            <Space>
              <Button type="primary" onClick={toggleMenu}>
                {isMenuOpen ? "关闭" : "打开"}菜单
              </Button>
              <Text type="secondary">
                点击外部区域会自动关闭菜单（已触发 {clickCount} 次）
              </Text>
            </Space>

            {isMenuOpen && (
              <div
                ref={menuRef}
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: 4,
                  padding: 16,
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}
              >
                <Space vertical style={{ width: "100%" }}>
                  <Text strong>菜单选项</Text>
                  <Button type="link" block style={{ textAlign: "left" }}>
                    选项 1
                  </Button>
                  <Button type="link" block style={{ textAlign: "left" }}>
                    选项 2
                  </Button>
                  <Button type="link" block style={{ textAlign: "left" }}>
                    选项 3
                  </Button>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    💡 点击菜单内部不会关闭，点击外部会关闭
                  </Text>
                </Space>
              </div>
            )}
          </Space>
        </Card>

        <Card size="small" title="示例 2：模态框">
          <Space vertical style={{ width: "100%" }}>
            <Button type="primary" onClick={openModal}>
              打开模态框
            </Button>

            {isModalOpen && (
              <>
                {/* 遮罩层 */}
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.45)",
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {/* 模态框内容 */}
                  <div
                    ref={modalRef}
                    style={{
                      background: "#fff",
                      borderRadius: 8,
                      padding: 24,
                      minWidth: 400,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}
                  >
                    <Space vertical style={{ width: "100%" }}>
                      <Text strong style={{ fontSize: 16 }}>
                        模态框标题
                      </Text>
                      <Paragraph>
                        这是一个模态框的内容。点击模态框外部（遮罩层）会自动关闭。
                      </Paragraph>
                      <Space>
                        <Button type="primary" onClick={closeModal}>
                          确定
                        </Button>
                        <Button onClick={closeModal}>取消</Button>
                      </Space>
                    </Space>
                  </div>
                </div>
              </>
            )}
          </Space>
        </Card>

        <Alert
          title="使用场景"
          description={
            <ul style={{ margin: "8px 0 0 0", paddingLeft: 20 }}>
              <li>下拉菜单</li>
              <li>弹窗/对话框</li>
              <li>日期选择器</li>
              <li>自定义右键菜单</li>
              <li>工具提示</li>
            </ul>
          }
          type="info"
          showIcon
        />

        <Paragraph type="secondary">
          💡 提示：useClickOutside 会自动处理鼠标和触摸事件，支持移动端。
        </Paragraph>
      </Space>
    </Card>
  );
};

export default ClickOutsideDemo;
