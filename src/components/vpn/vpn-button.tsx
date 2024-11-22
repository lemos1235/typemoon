import iconTran from "@/assets/image/icon_tran.svg?react";
import { useVerge } from "@/hooks/use-verge";
import {
  checkService,
  installService,
  uninstallService,
} from "@/services/cmds";
import getSystem from "@/utils/get-system";
import { Box, CircularProgress, Stack, SvgIcon } from "@mui/material";
import { useLockFn } from "ahooks";
import { useState } from "react";
import useSWR from "swr";
import { Notice } from "../base";

interface Props {}

const VpnButton = (props: Props) => {
  // service mode
  const { data: serviceStatus, mutate: mutateServiceStatus } = useSWR(
    "checkService",
    checkService,
    {
      revalidateIfStale: false,
      shouldRetryOnError: false,
      focusThrottleInterval: 36e5, // 1 hour
    }
  );

  const isWindows = getSystem() === "windows";

  const [tunLoading, setTunLoading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [uninstallServiceLoaing, setUninstallServiceLoading] = useState(false);
  const [openInstall, setOpenInstall] = useState(false);
  const [openUninstall, setOpenUninstall] = useState(false);
  const { verge, mutateVerge, patchVerge } = useVerge();

  async function install(passwd: string) {
    try {
      setOpenInstall(false);
      await installService(passwd);
      await mutateServiceStatus();
      setTimeout(() => {
        mutateServiceStatus();
      }, 2000);
      setServiceLoading(false);
    } catch (err: any) {
      await mutateServiceStatus();
      setTimeout(() => {
        mutateServiceStatus();
      }, 2000);
      Notice.error(err.message || err.toString());
      setServiceLoading(false);
    }
  }

  async function uninstall(passwd: string) {
    try {
      setOpenUninstall(false);
      await uninstallService(passwd);
      await mutateServiceStatus();
      setTimeout(() => {
        mutateServiceStatus();
      }, 2000);
      setUninstallServiceLoading(false);
    } catch (err: any) {
      await mutateServiceStatus();
      setTimeout(() => {
        mutateServiceStatus();
      }, 2000);
      Notice.error(err.message || err.toString());
      setUninstallServiceLoading(false);
    }
  }

  const onInstallService = useLockFn(async () => {
    setServiceLoading(true);
    // install service
    if (isWindows) {
      await install("");
    } else {
      setOpenInstall(true);
    }
  });

  const onEnableOrDisableService = useLockFn(async (enable: boolean) => {
    setServiceLoading(true);
    try {
      // enable or disable service
      await patchVerge({ enable_service_mode: enable });
      mutateVerge(
        {
          ...verge,
          ...{
            enable_service_mode: enable,
          },
        },
        false
      );
      await mutateServiceStatus();
      setTimeout(() => {
        mutateServiceStatus();
      }, 2000);
      setServiceLoading(false);
    } catch (err: any) {
      await mutateServiceStatus();
      Notice.error(err.message || err.toString());
      setServiceLoading(false);
    }
  });

  const onUninstallService = useLockFn(async () => {
    setUninstallServiceLoading(true);
    if (isWindows) {
      await uninstall("");
    } else {
      setOpenUninstall(true);
    }
  });

  const startOrStopService = useLockFn(async () => {
    if (serviceLoading) {
      return;
    }
    if (verge?.enable_tun_mode) {
      return;
    }
    console.log("serviceStatus:", serviceStatus);
    if (serviceStatus === "uninstall" || serviceStatus === "unknown") {
      //安装服务
      console.log("install service");
      onInstallService();
      onEnableOrDisableService(true);
    }
    if (serviceStatus === "active" || serviceStatus === "installed") {
      //卸载服务
      console.log("uninstall service");
      onUninstallService();
      onEnableOrDisableService(false);
    }
  });

  const startOrStopVpn = useLockFn(async () => {
    if (serviceLoading || tunLoading) {
      return;
    }
    if (serviceStatus !== "active") {
      return;
    }

    if (!verge?.enable_tun_mode) {
      //启动vpn
      console.log("start vpn");
      setTunLoading(true);
      await patchVerge({ enable_tun_mode: true });
      setTunLoading(false);
    } else {
      console.log("stop vpn");
      //停止vpn
      setTunLoading(true);
      await patchVerge({ enable_tun_mode: false });
      setTunLoading(false);
    }
  });

  return (
    <Stack direction="row">
      <Box
        sx={{
          padding: "8px 8px 0 0",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={startOrStopService}
      >
        <SvgIcon
          component={iconTran}
          color={serviceStatus === "active" ? "warning" : "disabled"}
          inheritViewBox
        />
      </Box>
      <Box
        sx={{
          padding: "8px 8px 0 0",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={startOrStopVpn}
      >
        <SvgIcon
          component={iconTran}
          color={verge?.enable_tun_mode ? "success" : "disabled"}
          inheritViewBox
        />
      </Box>
    </Stack>
  );
};

export default VpnButton;
