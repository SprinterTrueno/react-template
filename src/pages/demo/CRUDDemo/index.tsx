import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  message,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm
} from "antd";
import { useRequest } from "@/hooks";
import styles from "./index.module.less";

const { Title, Paragraph } = Typography;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const CRUDDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 模拟获取用户列表 API
  const mockGetUserList = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 800);
    });

    // 从 localStorage 读取用户列表
    const stored = localStorage.getItem("demo_users");
    if (stored) {
      return JSON.parse(stored) as User[];
    }

    // 初始数据
    const initialUsers: User[] = [
      {
        id: "1",
        name: "张三",
        email: "zhangsan@example.com",
        role: "admin",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "李四",
        email: "lisi@example.com",
        role: "user",
        createdAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "王五",
        email: "wangwu@example.com",
        role: "user",
        createdAt: new Date().toISOString()
      }
    ];

    localStorage.setItem("demo_users", JSON.stringify(initialUsers));
    return initialUsers;
  };

  // 模拟创建用户 API
  const mockCreateUser = async (data: Omit<User, "id" | "createdAt">) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    const stored = localStorage.getItem("demo_users");
    const users: User[] = stored ? JSON.parse(stored) : [];

    const newUser: User = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("demo_users", JSON.stringify(users));

    return newUser;
  };

  // 模拟更新用户 API
  const mockUpdateUser = async (
    userId: string,
    data: Partial<Omit<User, "id" | "createdAt">>
  ) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    const stored = localStorage.getItem("demo_users");
    const users: User[] = stored ? JSON.parse(stored) : [];

    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error("用户不存在");
    }

    users[index] = { ...users[index], ...data };
    localStorage.setItem("demo_users", JSON.stringify(users));

    return users[index];
  };

  // 模拟删除用户 API
  const mockDeleteUser = async (userId: string) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    const stored = localStorage.getItem("demo_users");
    const users: User[] = stored ? JSON.parse(stored) : [];

    const filtered = users.filter((u) => u.id !== userId);
    localStorage.setItem("demo_users", JSON.stringify(filtered));

    return { success: true };
  };

  // 获取用户列表
  const {
    loading,
    data: users,
    run: fetchUsers
  } = useRequest(mockGetUserList, {
    onSuccess: () => {
      // 可以在这里添加成功提示
    },
    onError: (error) => {
      message.error(`获取用户列表失败：${error.message}`);
    }
  });

  // 创建用户
  const { loading: creating, run: createUser } = useRequest(mockCreateUser, {
    onSuccess: () => {
      message.success("创建成功");
      setIsModalOpen(false);
      form.resetFields();
      // 👇 关键：创建成功后，自动刷新列表
      fetchUsers();
    },
    onError: (error) => {
      message.error(`创建失败：${error.message}`);
    }
  });

  // 更新用户
  const { loading: updating, run: updateUser } = useRequest(mockUpdateUser, {
    onSuccess: () => {
      message.success("更新成功");
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      // 👇 关键：更新成功后，自动刷新列表
      fetchUsers();
    },
    onError: (error) => {
      message.error(`更新失败：${error.message}`);
    }
  });

  // 删除用户
  const { loading: deleting, run: deleteUser } = useRequest(mockDeleteUser, {
    onSuccess: () => {
      message.success("删除成功");
      // 👇 关键：删除成功后，自动刷新列表
      fetchUsers();
    },
    onError: (error) => {
      message.error(`删除失败：${error.message}`);
    }
  });

  // 打开创建弹窗
  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsModalOpen(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (editingUser) {
      // 更新
      await updateUser(editingUser.id, values);
    } else {
      // 创建
      await createUser(values);
    }
  };

  // 删除用户
  const handleDelete = async (userId: string) => {
    await deleteUser(userId);
  };

  // 表格列定义
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const roleMap: Record<string, string> = {
          admin: "管理员",
          user: "普通用户"
        };
        return roleMap[role] || role;
      }
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("zh-CN")
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_: unknown, record: User) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger loading={deleting}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <Title level={2}>CRUD 示例 - 编辑后自动刷新</Title>

      <Card>
        <Space vertical size="large" style={{ width: "100%" }}>
          <Paragraph>
            本示例展示了完整的 CRUD 操作流程，重点演示
            <strong>编辑/删除/创建操作完成后，自动刷新列表数据</strong>
            的功能。
          </Paragraph>

          <div>
            <Button type="primary" onClick={handleCreate}>
              创建用户
            </Button>
          </div>

          <Table
            dataSource={users || []}
            columns={columns}
            loading={loading}
            rowKey="id"
            pagination={false}
          />

          <div style={{ marginTop: 16 }}>
            <Paragraph strong>核心实现原理：</Paragraph>
            <pre
              style={{
                background: "#f5f5f5",
                padding: 12,
                borderRadius: 4,
                fontSize: 12
              }}
            >
              {`// 1. 获取列表时，保存 run 函数
const { data: users, run: fetchUsers } = useRequest(getUserList);

// 2. 编辑成功后，调用 run 刷新列表
const { run: updateUser } = useRequest(mockUpdateUser, {
  onSuccess: () => {
    message.success('更新成功');
    fetchUsers();  // 👈 自动刷新列表
  }
});

// 3. 删除成功后，调用 run 刷新列表
const { run: deleteUser } = useRequest(mockDeleteUser, {
  onSuccess: () => {
    message.success('删除成功');
    fetchUsers();  // 👈 自动刷新列表
  }
});`}
            </pre>
          </div>
        </Space>
      </Card>

      {/* 创建/编辑弹窗 */}
      <Modal
        title={editingUser ? "编辑用户" : "创建用户"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
        confirmLoading={creating || updating}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: "请选择角色" }]}
          >
            <Select placeholder="请选择角色">
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="user">普通用户</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CRUDDemo;
