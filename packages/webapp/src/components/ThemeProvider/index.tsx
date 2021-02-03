import React from 'react';
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';
const theme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },

  palette: {
    primary: {
      main: '#0A4D63',
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
});

const ThemeProvider: React.FC = ({ children }) => (
  <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
);

export default ThemeProvider;
