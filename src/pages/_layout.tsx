import iconDark from "@/assets/image/icon_dark.svg?react";
import iconLight from "@/assets/image/icon_light.svg?react";
import { Notice } from "@/components/base";
import { getAxios } from "@/services/api";
import { getPortableFlag } from "@/services/cmds";
import getSystem from "@/utils/get-system";
import {
  createTheme,
  List, Paper, SvgIcon, ThemeProvider
} from "@mui/material";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { mutate, SWRConfig } from "swr";
import { routers } from "./_routers";
import { LayoutItem } from "@/components/layout/layout-item";
import { LayoutControl } from "@/components/layout/layout-control";

const appWindow = getCurrentWebviewWindow();
export let portableFlag = false;

dayjs.extend(relativeTime);

const OS = getSystem();


const Layout = () => {
  const location = useLocation();
  const routersEles = useRoutes(routers);
  if (!routersEles) return null;

  useEffect(() => {
    window.addEventListener("keydown", e => {
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
          Notice.success("配置更新成功");
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

  const theme = createTheme({
    breakpoints: {
      values: { xs: 0, sm: 650, md: 900, lg: 1200, xl: 1536 },
    },
    palette: {
      mode: 'light',
      primary: { main: "#81C784" },
      // secondary: { main: setting.secondary_color || dt.secondary_color },
      // info: { main: setting.info_color || dt.info_color },
      // error: { main: setting.error_color || dt.error_color },
      // warning: { main: setting.warning_color || dt.warning_color },
      // success: { main: setting.success_color || dt.success_color },
      // text: {
      //   primary: setting.primary_text || dt.primary_text,
      //   secondary: setting.secondary_text || dt.secondary_text,
      // },
      // background: {
      //   paper: dt.background_color,
      // },
    },
    // shadows: Array(25).fill("none") as Shadows,
    // typography: {
    //   // todo
    //   fontFamily: setting.font_family
    //     ? `${setting.font_family}, ${dt.font_family}`
    //     : dt.font_family,
    // },
  });

  return (
    <SWRConfig value={{ errorRetryCount: 3 }}>
      <ThemeProvider theme={theme}>
        <Paper
          square
          elevation={0}
          className={`${OS} layout`}
          onContextMenu={e => {
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
          sx={[
            ({ palette }) => ({
              bgcolor: palette.background.paper,
            }),
            OS === "linux"
              ? {
                borderRadius: "8px",
                border: "2px solid var(--divider-color)",
                width: "calc(100vw - 4px)",
                height: "calc(100vh - 4px)",
              }
              : {},
          ]}>
          <div className="layout__top" style={{ backgroundColor: "#ebebeb" }}>
            {
              <div className="the-bar">
                <div
                  className="the-dragbar"
                  data-tauri-drag-region="true"
                  style={{ width: "100%" }}></div>
                {OS !== "macos" && <LayoutControl />}
              </div>
            }
          </div>
          <div className="layout__main">
            <div className="layout__left">
              <div className="the-logo" data-tauri-drag-region="true">
                <div
                  style={{
                    height: "27px",
                    display: "flex",
                    justifyContent: "center",
                  }}>
                  <SvgIcon
                    component={iconLight}
                    style={{
                      height: "36px",
                      width: "36px",
                      marginTop: "-3px",
                      marginRight: "5px",
                      marginLeft: "-3px",
                    }}
                    inheritViewBox
                  />
                </div>
              </div>

              <List className="the-menu">
                {routers.map(router => (
                  <LayoutItem
                    key={router.label}
                    to={router.path}
                    icon={router.icon}>
                    {router.label}
                  </LayoutItem>
                ))}
              </List>
            </div>

            <div className="layout__right" >
              <TransitionGroup className="the-content">
                <CSSTransition
                  key={location.pathname}
                  timeout={300}
                  classNames="page">
                  {React.cloneElement(routersEles, { key: location.pathname })}
                </CSSTransition>
              </TransitionGroup>
            </div>
          </div>
        </Paper>
      </ThemeProvider>
    </SWRConfig>
  );
};

export default Layout;
