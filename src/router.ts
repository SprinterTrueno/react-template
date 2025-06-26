import { createBrowserRouter } from "react-router";
import Fallback from "@/components/Fallback";
import Homepage from "@/pages/Homepage";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    ErrorBoundary: Fallback,
    children: [
      { index: true, Component: Homepage },
      { path: "*", Component: NotFound },
    ],
  },
]);

export default router;
