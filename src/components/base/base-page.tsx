import { Box } from "@mui/material";
import React, { ReactNode } from "react";
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
          sx={(theme) => ({
            background: "#FFFFFF",
            ...theme.applyStyles("dark", {
              background: "#1c1c1c",
            }),
          })}
          className={full ? "base-container no-padding" : "base-container"}>
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
