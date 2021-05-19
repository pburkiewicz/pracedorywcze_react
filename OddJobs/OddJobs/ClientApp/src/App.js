import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import JobList  from "./components/JobList"
import LeafletMap from "./components/LeafletMap";
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import {ApplicationPaths, LoginActions} from './components/api-authorization/ApiAuthorizationConstants';

import './custom.css'
import {Login} from "./components/api-authorization/Login";


export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={LeafletMap} />
          <Route path='/map' component={LeafletMap} />
          <Route path='/list' component={JobList} />
          <Route path='/login' component={Login} action={LoginActions.Login} />
        <AuthorizeRoute path='/fetch-data' component={FetchData} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    );
  }
}
