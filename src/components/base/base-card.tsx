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
        (theme) => ({
          borderColor: "#F0F0F0",
          boxShadow: "0px 0.6px 5px #EEEEEE",
          background: "#fff",
          ...theme.applyStyles("dark", {
            borderColor: "#242424",
            boxShadow: "none",
            background: "#242424",
          }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
