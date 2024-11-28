import { BasePage } from "@/components/base";
import MenuSidebar from "@/components/layout/menu-sidebar";
import {
  LocalProxies,
  SubscriptionProxies,
} from "@/components/proxies/proxy-group";
import { Box } from "@mui/material";
import { useState } from "react";

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
            (theme) => ({
              borderLeft: "2px solid #f2f2f2",
              ...theme.applyStyles("dark", {
                borderLeft: "4px solid #2c2c2c",
              }),
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
