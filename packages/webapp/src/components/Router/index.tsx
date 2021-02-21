import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RepositoryPage from '../../pages/Repository';
import Login from '../../pages/Login';
import OperationsPage from '../../pages/Operations';
import SfuVerify from '../../pages/SfuVerify';
import MergeRequestsList from '../../pages/MergeRequestList';
import MergeRequestCommitList from '../MergeRequestCommitList';
import SettingsPage from '../../pages/Settings';
import { useAuthContext } from '../../contexts/AuthContext';

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
        <Route path='/merge/:id' exact>
          <MergeRequestsList />
        </Route>
        <Route path='/commits/:id' exact>
          <MergeRequestCommitList />
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
