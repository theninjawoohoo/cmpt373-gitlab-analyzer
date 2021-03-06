import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../../pages/Home';
import Login from '../../pages/Login';
import SfuVerify from '../../pages/SfuVerify';

export function Router() {
  return <BrowserRouter>
    <Switch>
      <Route path="/" exact>
        <Login />
      </Route>
      <Route path="/sfu" exact>
        <SfuVerify />
      </Route>
      <Route path="/home" exact>
        <Home />
      </Route>
    </Switch>
  </BrowserRouter>;
}