
import { BaseErrorBoundary } from "@/components/base";
import ProxiesPage from "./proxies";

import BorderAllIcon from "@mui/icons-material/BorderAll";
import RuleIcon from "@mui/icons-material/Rule";
import RulesPage from "./rules";

export const routers = [
  {
    label: "节点",
    path: "/",
    icon: <BorderAllIcon />,
    element: <ProxiesPage />,
  },
  {
    label: "规则",
    path: "/rules",
    icon: <RuleIcon />,
    element: <RulesPage />,
  },
].map(router => ({
  ...router,
  element: (
    <BaseErrorBoundary key={router.label}>{router.element}</BaseErrorBoundary>
  ),
}));
