import React from 'react';
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';
const theme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    h1: {
      fontSize: '3rem',
    },
    h2: {
      fontSize: '2.5rem',
    },
    h3: {
      fontSize: '2rem',
    },
    h4: {
      fontSize: '1.5rem',
    },
  },

  palette: {
    primary: {
      main: '#0A4D63',
      light: '#A2E1F6',
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
