import { useVerge } from "@/hooks/use-verge";
import { runAtLeast } from "@/utils/async";
import { Box, IconButton, styled } from "@mui/material";
import { useLockFn } from "ahooks";
import { Sparkles } from "lucide-react";
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
      }, 500);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Box
      sx={(theme) => ({
        color: "#212121",
        ...theme.applyStyles("dark", { color: "#fff" }),
      })}>
      <AnimatedIconButton
        onClick={startOrStopVpn}
        disableRipple
        disableFocusRipple
        disableTouchRipple
        disabled={loading}
        color={verge?.enable_tun_mode ? "primary" : "inherit"}>
        <Sparkles />
      </AnimatedIconButton>
    </Box>
  );
};

// 设置淡入淡出的过渡动画
const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: "color 0.3s ease",
}));

export default VpnButton;
