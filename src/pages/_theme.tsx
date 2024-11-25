import { createTheme, ThemeProvider } from "@mui/material";
import Layout from "./_layout";

export default function ToggleThemeLayout() {
  const theme = createTheme({
    // cssVariables: {
    //   colorSchemeSelector: 'class'
    // },
    colorSchemes: {
      dark: {
        palette: {
          mode: "dark",
          primary: { main: "#3CB371" },
        },
      },
      light: {
        palette: {
          mode: "light",
          primary: { main: "#3CB371" },
        },
      },
    },
    breakpoints: {
      values: { xs: 0, sm: 650, md: 900, lg: 1200, xl: 1536 },
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
