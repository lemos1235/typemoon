import {
  CloseRounded,
  CropSquareRounded,
  FilterNoneRounded,
  HorizontalRuleRounded,
  PushPinOutlined,
  PushPinRounded,
} from "@mui/icons-material";
import { Box, Button, ButtonGroup } from "@mui/material";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect, useState } from "react";
const appWindow = getCurrentWebviewWindow();

export const LayoutControl = () => {
  const minWidth = 40;

  const [isMaximized, setIsMaximized] = useState(false);
  const [isPined, setIsPined] = useState(false);

  useEffect(() => {
    const unlistenResized = appWindow.onResized(() => {
      appWindow.isMaximized().then((maximized) => {
        setIsMaximized(() => maximized);
      });
    });

    appWindow.isMaximized().then((maximized) => {
      setIsMaximized(() => maximized);
    });

    return () => {
      unlistenResized.then((fn) => fn());
    };
  }, []);

  return (
    <Box
      sx={(theme) => {
        return {
          color: "#808080",
          ...theme.applyStyles("dark", {
            color: "#fff",
          }),
        };
      }}>
      <ButtonGroup
        variant="text"
        color="inherit"
        sx={{
          zIndex: 1000,
          height: "100%",
          ".MuiButtonGroup-grouped": {
            borderRadius: "0px",
            borderRight: "0px",
          },
        }}>
        <Button
          disableTouchRipple
          size="small"
          sx={{ minWidth, svg: { transform: "scale(0.8)" } }}
          onClick={() => {
            appWindow.setAlwaysOnTop(!isPined);
            setIsPined((isPined) => !isPined);
          }}>
          {isPined ? (
            <PushPinRounded fontSize="small" />
          ) : (
            <PushPinOutlined fontSize="small" />
          )}
        </Button>

        <Button
          disableTouchRipple
          size="small"
          sx={{ minWidth, svg: { transform: "scale(0.8)" } }}
          onClick={() => appWindow.minimize()}>
          <HorizontalRuleRounded fontSize="small" />
        </Button>

        <Button
          disableTouchRipple
          size="small"
          sx={{ minWidth, svg: { transform: "scale(0.8)" } }}
          onClick={() => {
            setIsMaximized((isMaximized) => !isMaximized);
            appWindow.toggleMaximize();
          }}>
          {isMaximized ? (
            <FilterNoneRounded
              fontSize="small"
              style={{
                transform: "rotate(180deg) scale(0.7)",
              }}
            />
          ) : (
            <CropSquareRounded fontSize="small" />
          )}
        </Button>

        <Button
          disableTouchRipple
          size="small"
          sx={{
            minWidth,
            svg: { transform: "scale(0.8)" },
            ":hover": { bgcolor: "#ff000090" },
          }}
          onClick={() => appWindow.close()}>
          <CloseRounded fontSize="small" />
        </Button>
      </ButtonGroup>
    </Box>
  );
};
