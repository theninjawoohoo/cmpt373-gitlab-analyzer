import { SnackbarProvider } from 'notistack';
import React from 'react';
import './App.css';
import { Router } from './components/Router';
import ThemeProvider from './components/ThemeProvider';
import { AuthContextProvider } from './contexts/AuthContext';
import { RepositoryContextProvider } from './contexts/RepositoryContext';
import { FilterContextProvider } from './contexts/FilterContext';
import LuxonUtils from '@date-io/luxon';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const App = () => {
  return (
    <AuthContextProvider>
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <RepositoryContextProvider>
          <FilterContextProvider>
            <ThemeProvider>
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
              >
                <Router />
              </SnackbarProvider>
            </ThemeProvider>
          </FilterContextProvider>
        </RepositoryContextProvider>
      </MuiPickersUtilsProvider>
    </AuthContextProvider>
  );
};

export default App;
