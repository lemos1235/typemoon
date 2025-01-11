import { Notice } from "@/components/base";
import { getAxios } from "@/services/api";
import getSystem from "@/utils/get-system";
import { Box, Paper, Tab, Tabs, useColorScheme } from "@mui/material";
import { listen } from "@tauri-apps/api/event";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { mutate, SWRConfig } from "swr";
import { LayoutControl } from "@/components/layout/layout-control";
import ProxiesPage from "./proxies";
import RulesPage from "./rules";
import VpnButton from "@/components/vpn/vpn-button";
import { LayoutBrand } from "@/components/layout/layout-brand";

dayjs.extend(relativeTime);

const OS = getSystem();

const appWindow = getCurrentWebviewWindow();

const Layout = () => {
  const { mode } = useColorScheme();
  if (!mode) {
    return null;
  }

  const [tabValue, setTabValue] = useState(0);

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
        {/* 标题栏 */}
        <div className="layout__top" style={{ backgroundColor: "#ebebeb" }}>
          <Box
            className="the-bar"
            sx={(theme) => ({
              background: "#fff",
              ...theme.applyStyles("dark", {
                background: "#323232",
              }),
            })}>
            <div className="the-brand">{OS !== "macos" && <LayoutBrand />}</div>
            <div
              className="the-dragbar"
              data-tauri-drag-region="true"
              style={{ width: "100%" }}>
              <Tabs
                value={tabValue}
                onChange={(event: React.SyntheticEvent, newValue: number) => {
                  setTabValue(newValue);
                }}>
                <Tab disableRipple sx={{ fontWeight: "bold" }} label="节点" />
                <Tab disableRipple sx={{ fontWeight: "bold" }} label="规则" />
              </Tabs>
            </div>
            <div className="the-controls">
              {OS !== "macos" && <LayoutControl />}
            </div>
          </Box>
        </div>
        {/* 主内容 */}
        <div className="layout__main">
          <Box className={`tab-content ${tabValue === 0 ? "active" : ""}`}>
            <ProxiesPage />
          </Box>
          <Box className={`tab-content ${tabValue === 1 ? "active" : ""}`}>
            <RulesPage />
          </Box>
        </div>
        {/* 底部状态兼操作栏 */}
        <div className="layout__bottom">
          <Box
            className="the-bottombar"
            sx={(theme) => ({
              background: "#fff",
              ...theme.applyStyles("dark", {
                background: "#323232",
              }),
            })}>
            <VpnButton />
          </Box>
        </div>
      </Paper>
    </SWRConfig>
  );
};

export default Layout;
