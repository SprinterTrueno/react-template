import { Outlet } from "react-router";
import { Layout } from "antd";
import styles from "./index.module.less";

const { Header, Content, Footer } = Layout;

const BasicLayout = () => {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>React Template</div>
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
      <Footer className={styles.footer}>
        React Template ©{new Date().getFullYear()} Created by TaKumi
      </Footer>
    </Layout>
  );
};

export default BasicLayout;
