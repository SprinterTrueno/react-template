import { RouterProvider } from "react-router";
import "@ant-design/v5-patch-for-react-19";
import { App as AntdApp, ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import "dayjs/locale/zh-cn";
import router from "./router";
import "normalize.css";

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
