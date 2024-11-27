import { Box, SxProps, Theme } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export function ShadowCard(props: Props) {
  const { children, sx } = props;
  return (
    <Box
      sx={[
        {
          borderRadius: "5px",
          borderStyle: "solid",
          borderWidth: "0.5px",
        },
        ({ palette: { mode } }) => ({
          borderColor: mode === "dark" ? "#242424" : "#F0F0F0",
          boxShadow: mode === "dark" ? "none" : "0px 0.6px 5px #EEEEEE",
          background: mode === "dark" ? "#242424" : "#fff",
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
