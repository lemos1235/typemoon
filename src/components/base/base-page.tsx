import React, { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { BaseErrorBoundary } from "./base-error-boundary";

interface Props {
  contentStyle?: React.CSSProperties;
  children?: ReactNode;
  full?: boolean;
}

export const BasePage: React.FC<Props> = (props) => {
  const { contentStyle, full, children } = props;

  return (
    <BaseErrorBoundary>
      <div className="base-page">
        <Box
          sx={({ palette: { mode } }) => ({
            background: mode === "dark" ? "#1B1B1B" : "#fff",
          })}
          className={full ? "base-container no-padding" : "base-container"}
        >
          <section>
            <div className="base-content" style={contentStyle}>
              {children}
            </div>
          </section>
        </Box>
      </div>
    </BaseErrorBoundary>
  );
};
