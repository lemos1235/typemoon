import { Box } from "@mui/material";
import { LayoutControl } from "./layout-control";

interface Props {
  system: string;
}

export function Titlebar(props: Props) {
  const { system: OS } = props;
  return (
    <Box
      className="the-bar"
      sx={(theme) => ({
        background: "#ebebeb",
        ...theme.applyStyles("dark", {
          background: "#323232",
        }),
      })}>
      <div
        className="the-dragbar"
        data-tauri-drag-region="true"
        style={{ width: "100%" }}></div>
      {OS !== "macos" && <LayoutControl />}
    </Box>
  );
}
