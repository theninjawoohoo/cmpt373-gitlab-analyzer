import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RepositoryPage from '../../pages/Repository';
import Login from '../../pages/Login';
import SfuVerify from '../../pages/SfuVerify';
import SettingsPageLayout from '../../components/SettingsPageLayout';

export function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact>
          <Login />
        </Route>
        <Route path='/sfu' exact>
          <SfuVerify />
        </Route>
        <Route path='/repository' exact>
          <RepositoryPage />
        </Route>
        <Route path='/settings' exact>
          <SettingsPageLayout />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
