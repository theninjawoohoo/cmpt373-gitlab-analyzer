import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../../pages/Home';
import Login from '../../pages/Login';
import SfuVerify from '../../pages/SfuVerify';
import Graph from '../../pages/Graph';

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
        <Route path='/home' exact>
          <Home />
        </Route>
        <Route path='/graph' exact>
          <Graph />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
