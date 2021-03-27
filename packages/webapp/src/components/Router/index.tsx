import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Diff from '../../pages/Diff';
import RepositoryPage from '../../pages/Repository';
import Login from '../../pages/Login';
import OperationsPage from '../../pages/Operations';
import BrowseScoringConfigsPage from '../../pages/ScoringConfig/Browse';
import EditScoringConfigPage from '../../pages/ScoringConfig/Edit';
import SfuVerify from '../../pages/SfuVerify';
import Graph from '../../pages/Graph';
import ListMergeRequestPage from '../../pages/ListMergeRequestPage';
import ApiSettingPage from '../../pages/ApiSetting';
import SettingsPage from '../../pages/Settings';
import { useAuthContext } from '../../contexts/AuthContext';
import CommitsPage from '../../pages/Commits';
import Members from '../../pages/Members';
import RepositoryHomePage from '../../pages/RepositoryHomePage';
import Test from '../../pages/Test';

export function Router() {
  const { user } = useAuthContext();
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact>
          {user?.id ? <Redirect to='/repository' /> : <Login />}
        </Route>
        <Route path='/sfu' exact>
          <SfuVerify />
        </Route>
        <Route path='/repository/:id/members' exact>
          <Members />
        </Route>
        <Route path='/repository' exact>
          <RepositoryPage />
        </Route>
        <Route path='/repository/:id' exact>
          <RepositoryHomePage />
        </Route>
        <Route path='/graph/:id' exact>
          <Graph />
        </Route>
        <Route path='/settings' exact>
          <SettingsPage />
        </Route>
        <Route path='/settings/api' exact>
          <ApiSettingPage />
        </Route>
        <Route path='/settings/scoring' exact>
          <BrowseScoringConfigsPage />
        </Route>
        <Route path='/commits' exact>
          <CommitsPage />
        </Route>
        <Route path='/merge/:id' exact>
          <ListMergeRequestPage />
        </Route>
        <Route path='/operations' exact>
          <OperationsPage />
        </Route>
        <Route path='/diff' exact>
          <Diff />
        </Route>
        <Route path='/settings/scoring/edit' exact>
          <EditScoringConfigPage />
        </Route>
        <Route path='/logout' exact>
          <Login />
        </Route>
        <Route path='/test' exact>
          <Test />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
