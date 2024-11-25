import iconTran from "@/assets/image/icon_tran.svg?react";
import { useVerge } from "@/hooks/use-verge";
import { runAtLeast } from "@/utils/async";
import { CircularProgress, IconButton, SvgIcon } from "@mui/material";
import { useLockFn } from "ahooks";
import { useState } from "react";

interface Props {}

const VpnButton = (props: Props) => {
  const { verge, patchVerge } = useVerge();

  const [loading, setLoading] = useState(false);

  const startOrStopVpn = useLockFn(async () => {
    try {
      setLoading(true);
      await runAtLeast(async () => {
        if (!verge?.enable_tun_mode) {
          console.log("start vpn");
          await patchVerge({ enable_tun_mode: true });
        } else {
          console.log("stop vpn");
          await patchVerge({ enable_tun_mode: false });
        }
      }, 1500);
    } finally {
      setLoading(false);
    }
  });

  return (
    <IconButton
      onClick={startOrStopVpn}
      disableRipple
      disableFocusRipple
      disableTouchRipple
    >
      {loading ? (
        <CircularProgress color="inherit" size={18} />
      ) : (
        <SvgIcon
          component={iconTran}
          color={verge?.enable_tun_mode ? "primary" : "disabled"}
          inheritViewBox
        />
      )}
    </IconButton>
  );
};

export default VpnButton;
