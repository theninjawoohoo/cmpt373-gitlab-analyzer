import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RepositoryPage from '../../pages/Repository';
import Login from '../../pages/Login';
import SfuVerify from '../../pages/SfuVerify';
import MergeRequestsList from '../../pages/MergeRequestList';
import MergeRequestCommitList from '../MergeRequestCommitList';
import SettingsPage from '../../pages/Settings';

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
          <SettingsPage />
        </Route>
        <Route path='/merge/:id' exact>
          <MergeRequestsList />
        </Route>
        <Route path='/commits/:id' exact>
          <MergeRequestCommitList />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
