import { createTheme, ThemeProvider } from "@mui/material";
import Layout from "./_layout";

export default function ToggleThemeLayout() {
  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
    breakpoints: {
      values: { xs: 0, sm: 650, md: 900, lg: 1200, xl: 1536 },
    },
    palette: {
      primary: { main: "#3CB371" },
    },
    components: {
      MuiDivider: {
        styleOverrides: {
          root: {
            borderWidth: "1.0px",
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          fullWidth: true,
          size: "small",
          variant: "outlined",
          margin: "normal",
          autoComplete: "off",
          autoCorrect: "off",
          autoCapitalize: "off",
          autoFocus: false,
          spellCheck: false,
        },
      },
      MuiFormControl: {
        defaultProps: {
          fullWidth: true,
          size: "small",
          variant: "outlined",
          margin: "normal",
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
}
