import { Space, Typography } from "antd";
import {
  DebounceDemo,
  LocalStorageDemo,
  RequestDemo,
  CacheDemo,
  RetryDemo,
  MutationDemo,
  CRUDDemo
} from "./components";
import styles from "./index.module.less";

const { Title } = Typography;

const HooksDemo = () => {
  return (
    <div className={styles.container}>
      <Title level={2}>Hooks 功能体验</Title>

      <Space vertical size="large" style={{ width: "100%" }}>
        <DebounceDemo />
        <LocalStorageDemo />
        <RequestDemo />
        <CacheDemo />
        <RetryDemo />
        <MutationDemo />
        <CRUDDemo />
      </Space>
    </div>
  );
};

export default HooksDemo;
