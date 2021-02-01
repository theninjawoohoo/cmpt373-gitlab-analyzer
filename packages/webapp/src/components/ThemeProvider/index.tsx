import React from "react";
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";
import "../../Fonts/Montserrat/Montserrat-Light.ttf";
const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: "3rem",
    },
    fontFamily: "Montserrat-Light.ttf",
  },
});

const ThemeProvider: React.FC = ({ children }) => (
  <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
);

export default ThemeProvider;
