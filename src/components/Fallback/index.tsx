import { useNavigate, useRouteError } from "react-router";
import { Button, Result, Typography } from "antd";
import styles from "./index.module.less";

const { Paragraph, Text } = Typography;

const Fallback = () => {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  return (
    <Result
      status="error"
      title="Application Error"
      subTitle={error.message}
      extra={[
        <Button key="try-again" type="primary" onClick={() => navigate(0)}>
          Try Again
        </Button>,
        <Button
          key="back-home"
          onClick={() => navigate("/", { replace: true })}
        >
          Back Home
        </Button>,
      ]}
    >
      <Paragraph>
        <Text className={styles.errorStackTitle}>
          The error stack contains the following technical details:
        </Text>
      </Paragraph>
      <Paragraph>{error.stack}</Paragraph>
    </Result>
  );
};

export default Fallback;
