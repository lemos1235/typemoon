import iconTran from "@/assets/image/icon_tran.svg?react";
import { useVerge } from "@/hooks/use-verge";
import {
  checkService,
  installService,
  uninstallService,
} from "@/services/cmds";
import getSystem from "@/utils/get-system";
import { Box, CircularProgress, SvgIcon } from "@mui/material";
import { useLockFn } from "ahooks";
import { debounce } from "lodash-es";
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

  const isActive = serviceStatus === "active";

  const [serviceLoading, setServiceLoading] = useState(false);
  const [uninstallServiceLoaing, setUninstallServiceLoading] = useState(false);
  const [openInstall, setOpenInstall] = useState(false);
  const [openUninstall, setOpenUninstall] = useState(false);
  const { verge, mutateVerge, patchVerge } = useVerge();

  let msgOk = debounce(() => {
    Notice.success("已启用");
  }, 2000);

  const { enable_tun_mode } = verge ?? {};

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

  const handleClick = useLockFn(async () => {
    console.log("serviceStatus:", serviceStatus);
    //检查是否安装服务,如果未安装，则安装并启用服务
    if (serviceStatus === "uninstall" || serviceStatus === "unknown") {
      onInstallService();
      onEnableOrDisableService(true);
    }
    //开启或禁用TUN
    if (enable_tun_mode) {
      patchVerge({ enable_tun_mode: false });
    } else {
      patchVerge({ enable_tun_mode: true });
      console.log("已启用");
      msgOk();
    }
  });

  return (
    <Box
      sx={{
        padding: "8px 8px 0 0",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={handleClick}
    >
      {enable_tun_mode ? (
        <CircularProgress
          disableShrink
          sx={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            color: "var(--text-primary)",
          }}
          size={18}
          thickness={4}
        />
      ) : (
        <SvgIcon
          component={iconTran}
          color={enable_tun_mode ? "success" : "primary"}
          inheritViewBox
        />
      )}
    </Box>
  );
};

export default VpnButton;
