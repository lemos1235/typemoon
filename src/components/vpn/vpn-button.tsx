import { useVerge } from "@/hooks/use-verge";
import { runAtLeast } from "@/utils/async";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, IconButton, styled } from "@mui/material";
import { useLockFn } from "ahooks";
import { ArrowDownToDot, LoaderCircle } from "lucide-react";
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
      }, 1000);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Box
      sx={(theme) => ({
        color: "#959595",
        ...theme.applyStyles("dark", { color: "#fff" }),
      })}>
      <AnimatedIconButton
        onClick={startOrStopVpn}
        disableRipple
        disableFocusRipple
        disableTouchRipple
        disabled={loading}
        color={verge?.enable_tun_mode ? "primary" : "inherit"}>
        {loading ? (
          <LoadingButton
            loadingPosition="end"
            loading
            loadingIndicator={
              verge?.enable_tun_mode ? "停止中..." : "加速中..."
            }
            variant="outlined">
            {verge?.enable_tun_mode ? "停止中..." : "加速中..."}
          </LoadingButton>
        ) : verge?.enable_tun_mode ? (
          <Button variant="contained" color="primary">
            停止
          </Button>
        ) : (
          <Button variant="contained" color="primary">
            立即启用
          </Button>
        )}
      </AnimatedIconButton>
    </Box>
  );
};

// 设置淡入淡出的过渡动画
const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: "color 1s linear, transform 0.9s linear",
}));

export default VpnButton;
