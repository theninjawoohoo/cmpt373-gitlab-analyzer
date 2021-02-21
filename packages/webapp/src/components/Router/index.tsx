import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RepositoryPage from '../../pages/Repository';
import Login from '../../pages/Login';
import OperationsPage from '../../pages/Operations';
import SfuVerify from '../../pages/SfuVerify';
import ListMergeRequestPage from '../../pages/ListMergeRequestPage';
import ListCommitsByMergeRequestPage from '../../pages/ListCommitsByMergeRequestPage';
import SettingsPage from '../../pages/Settings';
import { useAuthContext } from '../../contexts/AuthContext';
import CommitsPage from '../../pages/Commits';

export function Router() {
  const { user } = useAuthContext();
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact>
          {user?.id ? <RepositoryPage /> : <Login />}
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
        <Route path='/commit/:id' exact>
          <CommitsPage />
        </Route>
        <Route path='/merge/:id' exact>
          <ListMergeRequestPage />
        </Route>
        <Route path='/commits/:id' exact>
          <ListCommitsByMergeRequestPage />
        </Route>
        <Route path='/operations' exact>
          <OperationsPage />
        </Route>
        <Route path='/logout' exact>
          <Login />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
