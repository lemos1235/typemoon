
import { BaseErrorBoundary } from "@/components/base";
import ProxiesPage from "./proxies";

import BorderAllIcon from "@mui/icons-material/BorderAll";

export const routers = [
  {
    label: "节点",
    path: "/",
    icon: <BorderAllIcon />,
    element: <ProxiesPage />,
  },
].map(router => ({
  ...router,
  element: (
    <BaseErrorBoundary key={router.label}>{router.element}</BaseErrorBoundary>
  ),
}));
