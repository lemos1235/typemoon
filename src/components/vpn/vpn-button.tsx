import iconTran from "@/assets/image/icon_tran.svg?react";
import { useVerge } from "@/hooks/use-verge";
import { Box, SvgIcon } from "@mui/material";
import { useLockFn } from "ahooks";

interface Props {}

const VpnButton = (props: Props) => {
  const { verge, patchVerge } = useVerge();

  const startOrStopVpn = useLockFn(async () => {
    if (!verge?.enable_tun_mode) {
      //启动vpn
      console.log("start vpn");
      patchVerge({ enable_tun_mode: true });
    } else {
      //停止vpn
      console.log("stop vpn");
      patchVerge({ enable_tun_mode: false });
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
