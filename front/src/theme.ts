import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";

export const backgroundColor = {
  bgLight: "#2d3268",
  bgDark: "#1a1f4b",
  foreground: "#fdfdfd",
};
export const primaryColor = {
  light: "#DAF7A6",
  main: "#BFD891",
  dark: "#A4B97D",
  contrastText: "#000",
};
export const secondaryColor = {
  light: "#FF5733",
  main: "#BF4126",
  dark: "#802B1A",
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
