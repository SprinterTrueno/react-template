import { useEffect } from "react";
import { Result, Button } from "antd";
import ReactCartoonLogo from "@/assets/images/react-cartoon-logo.png";
import { useApp, useAppDispatch } from "@/context/AppContext";
import styles from "./index.module.less";

const Homepage = () => {
  const app = useApp();
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch({ type: "editName", payload: "React Cartoon" });
    console.log(app);
  }, [app, appDispatch]);

  return (
    <Result
      className={styles.result}
      icon={
        <img
          className={styles.logo}
          src={ReactCartoonLogo}
          alt="react-cartoon-logo.png"
        />
      }
      title="The library for web and native user interfaces"
    />
  );
};

export default Homepage;
