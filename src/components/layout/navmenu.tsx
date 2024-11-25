import iconTran from "@/assets/image/icon_tran.svg?react";
import { routers } from "@/pages/_routers";
import { Box, List, SvgIcon, useColorScheme } from "@mui/material";
import { Dot, Sparkle } from "lucide-react";
import VpnButton from "../vpn/vpn-button";
import { LayoutItem } from "./layout-item";

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
      <Box
        className="the-logo"
        data-tauri-drag-region="true"
        onClick={toggleMode}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <SvgIcon
            component={iconTran}
            style={{ height: "34px", width: "34px" }}
            inheritViewBox
          />
        </Box>
        {mode === "system" && (
          <Box
            sx={{
              position: "absolute",
              top: "8px",
              right: "24px",
              zIndex: 1,
              display: "flex",
            }}>
            <Sparkle size={6} />
          </Box>
        )}
      </Box>

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
