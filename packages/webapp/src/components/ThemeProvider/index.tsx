import React from "react";
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";
import "../../Fonts/Montserrat/Montserrat-Light.ttf";
import grey from '@material-ui/core/colors/grey';
const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: "3rem",
    },
  },
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: '#f44336',
    },
  }
    fontFamily: "Montserrat-Light.ttf",
  },
});

const ThemeProvider: React.FC = ({ children }) => (
  <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
);

export default ThemeProvider;
