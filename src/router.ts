import { createBrowserRouter } from "react-router";
import Fallback from "@/components/Fallback";
import { BasicLayout } from "@/layouts";
import Homepage from "@/pages/Homepage";
import HooksDemo from "@/pages/demo/HooksDemo";
import RequestDemo from "@/pages/demo/RequestDemo";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    ErrorBoundary: Fallback,
    Component: BasicLayout,
    children: [
      { index: true, Component: Homepage },
      { path: "/hooks-demo", Component: HooksDemo },
      { path: "/request-demo", Component: RequestDemo },
      { path: "*", Component: NotFound }
    ]
  }
]);

export default router;
