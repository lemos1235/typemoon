import iconTran from "@/assets/image/icon_tran.svg?react";
import { useVerge } from "@/hooks/use-verge";
import { Box, SvgIcon } from "@mui/material";
import { useLockFn } from "ahooks";
import { useState } from "react";

interface Props {}

const VpnButton = (props: Props) => {
  const [tunLoading, setTunLoading] = useState(false);
  const { verge, patchVerge } = useVerge();

  const startOrStopVpn = useLockFn(async () => {
    if (tunLoading) {
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
  );
};

export default VpnButton;
