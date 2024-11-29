import { Notice } from "@/components/base";
import { Navmenu } from "@/components/layout/navmenu";
import { Titlebar } from "@/components/layout/titlebar";
import { getAxios } from "@/services/api";
import getSystem from "@/utils/get-system";
import { Box, Paper, useColorScheme } from "@mui/material";
import { listen } from "@tauri-apps/api/event";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { mutate, SWRConfig } from "swr";
import { routers } from "./_routers";

dayjs.extend(relativeTime);

const OS = getSystem();

const appWindow = getCurrentWebviewWindow();

const Layout = () => {
  const location = useLocation();
  const routersEles = useRoutes(routers);
  if (!routersEles) return null;

  const { mode } = useColorScheme();
  if (!mode) {
    return null;
  }

  useEffect(() => {
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
      await appWindow.show();
      await appWindow.setFocus();
    }, 50);
  }, []);

  console.log("应用初始化");
  return (
    <SWRConfig value={{ errorRetryCount: 3 }}>
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
        }}>
        <div className="layout__top" style={{ backgroundColor: "#ebebeb" }}>
          <Titlebar system={OS} />
        </div>
        <Box className="layout__main">
          <div className="layout__left">
            <Navmenu />
          </div>
          <div className="layout__right">
            <TransitionGroup className="the-content">
              <CSSTransition
                key={location.pathname}
                timeout={300}
                classNames="page">
                {React.cloneElement(routersEles, { key: location.pathname })}
              </CSSTransition>
            </TransitionGroup>
          </div>
        </Box>
      </Paper>
    </SWRConfig>
  );
};

export default Layout;
