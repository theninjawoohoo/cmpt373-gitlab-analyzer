import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RepositoryPage from '../../pages/Repository';
import Login from '../../pages/Login';
import OperationsPage from '../../pages/Operations';
import SfuVerify from '../../pages/SfuVerify';
import Graph from '../../pages/Graph';
// import Settings from '../../pages/Settings';
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
        <Route path='/graph' exact>
          <Graph />
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
        <Route path='/operations' exact>
          <OperationsPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
