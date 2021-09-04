import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";

export const backgroundColor = {
  bgLight: "#2d3268",
  bgDark: "#1a1f4b",
  foreground: "#fdfdfd",
};
export const primaryColor = {
  light: "#2356dc",
  main: "#1e3078",
  dark: "#111c47",
  contrastText: "#fff",
};
export const secondaryColor = {
  light: "#165389",
  main: "#1d3a70",
  dark: "#142950",
  contrastText: "#fff",
};

export const text = {
  primary: "#fff",
  secondary: "#dadada",
  disabled: "#444",
  hint: "#dadada",
};

export const borderRadius = 30;

export const theme = createMuiTheme({
  palette: {
    primary: primaryColor,
    secondary: secondaryColor,
    text: text,
  },
  overrides: {
    MuiTextField: {
      root: {
        width: "100%",
      },
    },
    MuiContainer: {
      root: {
        display: "flex",
        justifyContent: "center",
      },
    },
  },
  shape: {
    borderRadius: borderRadius,
  },
  props: {
    MuiButton: {
      variant: "outlined",
      color: "primary",
      size: "large",
    },
    MuiTextField: {
      variant: "outlined",
    },
  },
});
