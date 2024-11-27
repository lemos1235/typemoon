import { BasePage } from "@/components/base";
import MenuSidebar from "@/components/layout/menu-sidebar";
import { Box } from "@mui/material";
import { useState } from "react";
import {
  LocalProxies,
  SubscriptionProxies,
} from "@/components/proxies/proxy-group";

const ProxiesPage = () => {
  const [menuIndex, setMenuIndex] = useState("subscription");

  const menus = [
    {
      label: "订阅节点",
      index: "subscription",
    },
    {
      label: "本地节点",
      index: "local",
    },
  ];

  return (
    <BasePage full contentStyle={{ height: "100%" }}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <MenuSidebar
          menus={menus}
          current={menuIndex}
          onSelected={(index) => setMenuIndex(index)}
        />
        <Box
          sx={[
            {
              flex: 1,
              height: "100%",
              zIndex: 2,
            },
            ({ palette: { mode } }) => ({
              borderLeft:
                mode === "dark" ? "4px solid #2c2c2c" : "1px solid #f1f5fc",
            }),
          ]}
        >
          {menuIndex === "local" && <LocalProxies />}
          {menuIndex === "subscription" && <SubscriptionProxies />}
        </Box>
      </Box>
    </BasePage>
  );
};

export default ProxiesPage;
