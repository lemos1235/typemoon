import { Box, List, SvgIcon, useColorScheme } from "@mui/material";
import iconTran from "@/assets/image/icon_tran.svg?react";
import { LayoutItem } from "./layout-item";
import VpnButton from "../vpn/vpn-button";
import { routers } from "@/pages/_routers";

export function Navmenu() {
  const { mode, setMode } = useColorScheme();

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : mode === "dark" ? "system" : "light");
  };

  return (
    <Box
      className="the-navmenu"
      sx={(theme) => ({
        background: "#FFFFFF",
        ...theme.applyStyles("dark", {
          background: "#2C2C2C",
        }),
      })}>
      <div className="the-logo" data-tauri-drag-region="true">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={toggleMode}>
          <SvgIcon
            component={iconTran}
            style={{
              height: "36px",
              width: "36px",
            }}
            inheritViewBox
          />
        </Box>
      </div>

      <List className="the-menu">
        {routers.map((router) => (
          <LayoutItem key={router.label} to={router.path} icon={router.icon}>
            {router.label}
          </LayoutItem>
        ))}
      </List>

      <div className="the-down">
        <VpnButton />
      </div>
    </Box>
  );
}
