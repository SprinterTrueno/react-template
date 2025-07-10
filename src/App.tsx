import { RouterProvider } from "react-router";
import "@ant-design/v5-patch-for-react-19";
import { App as AntdApp, ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import "dayjs/locale/zh-cn";
import { AppProvider } from "@/context/AppContext";
import router from "./router";
import "normalize.css";

const App = () => {
  console.log("App");

  const a: string = "1";

  return (
    <ConfigProvider locale={zhCN}>
      <AntdApp>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
