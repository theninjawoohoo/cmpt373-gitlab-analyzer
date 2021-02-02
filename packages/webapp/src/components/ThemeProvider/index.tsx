import React from "react";
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";
const theme = createMuiTheme({
  typography: {
<<<<<<< HEAD
    h1: {
      fontSize: "3rem",
=======
    fontFamily: 'Montserrat, sans-serif',
  },

  palette: {
    primary: {
      main: '#0A4D63',
    },
    secondary: {
      main: '#FFFFFF',
>>>>>>> 3acd3cc4c1719d5034a389b2a363e43f4138a7d3
    },
  },
});

const ThemeProvider: React.FC = ({ children }) => (
  <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
);

export default ThemeProvider;
