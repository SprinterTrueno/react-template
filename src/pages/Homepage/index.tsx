import { Result } from "antd";
import ReactCartoonLogo from "@/assets/images/react-cartoon-logo.png";
import styles from "./index.module.less";

const Homepage = () => {
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
