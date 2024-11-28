import { Notice } from "@/components/base";
import { Navmenu } from "@/components/layout/navmenu";
import { Titlebar } from "@/components/layout/titlebar";
import { getAxios } from "@/services/api";
import { getPortableFlag } from "@/services/cmds";
import getSystem from "@/utils/get-system";
import { Box, Paper, useColorScheme } from "@mui/material";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { mutate } from "swr";
import { routers } from "./_routers";

const appWindow = getCurrentWebviewWindow();
export let portableFlag = false;

dayjs.extend(relativeTime);

const OS = getSystem();

const Layout = () => {
  const location = useLocation();
  const routersEles = useRoutes(routers);
  if (!routersEles) return null;

  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : mode === "dark" ? "system" : "light");
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      // macOS有cmd+w
      if (e.key === "Escape" && OS !== "macos") {
        appWindow.close();
      }
    });

    listen("verge://refresh-clash-config", async () => {
      // the clash info may be updated
      await getAxios(true);
      mutate("getProxies");
      mutate("getVersion");
      mutate("getClashConfig");
      mutate("getProxyProviders");
    });

    // update the verge config
    listen("verge://refresh-verge-config", () => mutate("getVergeConfig"));

    // 设置提示监听
    listen("verge://notice-message", ({ payload }) => {
      const [status, msg] = payload as [string, string];
      switch (status) {
        case "set_config::ok":
          // Notice.success("配置更新成功");
          console.log("配置更新成功");
          break;
        case "set_config::error":
          Notice.error(msg);
          break;
        default:
          break;
      }
    });

    setTimeout(async () => {
      portableFlag = await getPortableFlag();
      await appWindow.unminimize();
      await appWindow.show();
      await appWindow.setFocus();
    }, 50);
  }, []);

  console.log("应用初始化");
  return (
    <Paper
      square
      elevation={0}
      className={`${OS} layout`}
      onContextMenu={(e) => {
        // only prevent it on Windows
        const validList = ["input", "textarea"];
        const target = e.currentTarget;
        if (
          OS === "windows" &&
          !(
            validList.includes(target.tagName.toLowerCase()) ||
            target.isContentEditable
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <div className="layout__top" style={{ backgroundColor: "#ebebeb" }}>
        <Titlebar system={OS} />
      </div>
      <Box className="layout__main">
        <Navmenu />
        <div className="layout__right">
          <TransitionGroup className="the-content">
            <CSSTransition
              key={location.pathname}
              timeout={300}
              classNames="page"
            >
              {React.cloneElement(routersEles, { key: location.pathname })}
            </CSSTransition>
          </TransitionGroup>
        </div>
      </Box>
    </Paper>
  );
};

export default Layout;
