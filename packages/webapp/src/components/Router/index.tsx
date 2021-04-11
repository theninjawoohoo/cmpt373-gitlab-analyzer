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
import SettingsPage from '../../pages/GlobalSettings';
import { useAuthContext } from '../../contexts/AuthContext';
import RepoSetupPage from '../../pages/RepositorySetup';
import ScoreRubricPage from '../../pages/ScoreRubric';
import { RepositoryScoringContextProvider } from '../../pages/RepositorySetup/RepositoryScoringContext';
import CommentPage from '../../pages/Comment';

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
        <Route path='/repository' exact>
          <RepositoryPage />
        </Route>
        <Route path='/setup/:id' exact>
          <RepositoryScoringContextProvider>
            <RepoSetupPage />
          </RepositoryScoringContextProvider>
        </Route>
        <Route path='/setup/:id/rubric' exact>
          <ScoreRubricPage />
        </Route>
        <Route path='/graph/:id' exact>
          <Graph />
        </Route>
        <Route path='/comment/:id' exact>
          <CommentPage />
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
      </Switch>
    </BrowserRouter>
  );
}
