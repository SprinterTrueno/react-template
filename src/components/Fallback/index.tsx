import { useNavigate, useRouteError } from "react-router";
import { Button, Result } from "antd";

const Fallback = () => {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  return (
    <Result
      status="error"
      title="Application Error"
      subTitle={error.message || "Something went wrong"}
      extra={[
        <Button key="try-again" type="primary" onClick={() => navigate(0)}>
          Try Again
        </Button>,
        <Button
          key="back-home"
          onClick={() => navigate("/", { replace: true })}
        >
          Back Home
        </Button>
      ]}
      styles={{
        root: {
          marginTop: "20vh"
        }
      }}
    />
  );
};

export default Fallback;
