import iconTran from "@/assets/image/icon_tran.svg?react";
import { Box, SvgIcon, useColorScheme } from "@mui/material";

export const LayoutBrand = () => {
  const { mode, setMode } = useColorScheme();

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <Box
      className="the-logo"
      data-tauri-drag-region="true"
      onClick={toggleMode}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <SvgIcon
          component={iconTran}
          style={{ height: "28px", width: "28px" }}
          inheritViewBox
        />
      </Box>
    </Box>
  );
};
