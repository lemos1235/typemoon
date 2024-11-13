import React, { ReactNode } from "react";
import { Typography } from "@mui/material";
import { BaseErrorBoundary } from "./base-error-boundary";

interface Props {
  contentStyle?: React.CSSProperties;
  children?: ReactNode;
  full?: boolean;
}

export const BasePage: React.FC<Props> = props => {
  const { contentStyle, full, children } = props;

  return (
    <BaseErrorBoundary>
      <div className="base-page">
        <div
          className={full ? "base-container no-padding" : "base-container"}
          style={{ backgroundColor: "#ffffff" }}>
          <section
            style={{
              backgroundColor: "var(--background-color)",
            }}>
            <div className="base-content" style={contentStyle}>
              {children}
            </div>
          </section>
        </div>
      </div>
    </BaseErrorBoundary>
  );
};
