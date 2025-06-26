import { RouterProvider } from "react-router";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import "dayjs/locale/zh-cn";
import router from "./router";
import "normalize.css";

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
