import { BasePage } from "@/components/base";
import MenuSidebar from "@/components/layout/menu-sidebar";
import { Box } from "@mui/material";
import { useState } from "react";
import {LocalProxies, SubscriptionProxies} from "@/components/proxies/proxy-group";

const ProxiesPage = () => {
  const [menuIndex, setMenuIndex] = useState("local");

  const menus = [
    {
      label: "本地节点",
      index: "local",
    }, {
      label: "订阅节点",
      index: "subscription",
    }]

  return (
    <BasePage full contentStyle={{ height: "100%" }} >
      <Box sx={{ display: "flex", height: "100%" }}>
        <MenuSidebar menus={menus} current={menuIndex} onSelected={(index) => setMenuIndex(index)} />
        <Box sx={{ flex: 1, padding: "8px", background: '#fff', height: "100%" }}>
          {menuIndex === 'local' && <LocalProxies />}
          {menuIndex === 'subscription' && <SubscriptionProxies />}
        </Box>
      </Box>
    </BasePage>
  );
}

export default ProxiesPage;
