import { useState } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Tag,
  Table,
  Popconfirm,
  Form,
  message
} from "antd";
import { useRequestPro } from "@/hooks";
import UserModal from "./UserModal";

const { Paragraph, Text } = Typography;

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

  // 模拟 API
  const mockGetUserList = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 800);
    });

    const stored = localStorage.getItem("demo_users");
    if (stored) {
      return JSON.parse(stored) as User[];
    }

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

  const mockCreateUser = async (userData: Omit<User, "id" | "createdAt">) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    const stored = localStorage.getItem("demo_users");
    const users: User[] = stored ? JSON.parse(stored) : [];

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("demo_users", JSON.stringify(users));

    return newUser;
  };

  const mockUpdateUser = async (
    userId: string,
    userData: Partial<Omit<User, "id" | "createdAt">>
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

    users[index] = { ...users[index], ...userData };
    localStorage.setItem("demo_users", JSON.stringify(users));

    return users[index];
  };

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

  // Hooks
  const { loading, data: users } = useRequestPro(mockGetUserList, {
    manual: false, // 组件挂载时自动执行
    cacheKey: "users", // 设置缓存 key
    onError: (error) => {
      message.error(`获取用户列表失败：${error.message}`);
    }
  });

  const { loading: creating, run: createUser } = useRequestPro(mockCreateUser, {
    invalidateKeys: ["users"], // 👈 自动失效 'users' 缓存
    onSuccess: () => {
      message.success("创建成功");
      setIsModalOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error(`创建失败：${error.message}`);
    }
  });

  const { loading: updating, run: updateUser } = useRequestPro(mockUpdateUser, {
    invalidateKeys: ["users"], // 👈 自动失效 'users' 缓存
    onSuccess: () => {
      message.success("更新成功");
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
    },
    onError: (error) => {
      message.error(`更新失败：${error.message}`);
    }
  });

  const { loading: deleting, run: deleteUser } = useRequestPro(mockDeleteUser, {
    invalidateKeys: ["users"], // 👈 自动失效 'users' 缓存
    onSuccess: () => {
      message.success("删除成功");
    },
    onError: (error) => {
      message.error(`删除失败：${error.message}`);
    }
  });

  // 事件处理
  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (editingUser) {
      await updateUser(editingUser.id, values);
    } else {
      await createUser(values);
    }
  };

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
    <Card
      title="useRequest - CRUD 操作（编辑后自动刷新）"
      extra={<Tag color="purple">自动刷新</Tag>}
    >
      <Space vertical size="large" style={{ width: "100%" }}>
        <Paragraph>
          完整的 CRUD 操作示例，重点演示
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
          size="small"
        />

        <div style={{ marginTop: 16 }}>
          <Text strong>核心实现原理（完全类似 React Query）：</Text>
          <pre
            style={{
              background: "#f5f5f5",
              padding: 12,
              borderRadius: 4,
              fontSize: 12
            }}
          >
            {`// 1. 获取列表时，设置 cacheKey
const { data: users } = useRequestPro(getUserList, {
  manual: false,
  cacheKey: 'users'  // 👈 设置缓存 key
});

// 2. 编辑/删除/创建时，配置 invalidateKeys
const { run: updateUser } = useRequestPro(mockUpdateUser, {
  invalidateKeys: ['users'],  // 👈 成功后自动失效 'users' 缓存
  onSuccess: () => {
    message.success('更新成功');
    // 不需要手动调用 invalidateQueries！
  }
});

// 3. 支持同时失效多个缓存
const { run: createUser } = useRequestPro(mockCreateUser, {
  invalidateKeys: ['users', 'userCount'],  // 👈 同时失效多个
  onSuccess: () => {
    message.success('创建成功');
  }
});`}
          </pre>
        </div>
      </Space>

      <UserModal
        open={isModalOpen}
        editingUser={editingUser}
        loading={creating || updating}
        form={form}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
      />
    </Card>
  );
};

export default CRUDDemo;
