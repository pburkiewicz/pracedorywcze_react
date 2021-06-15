import React, { Component } from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';

import { FetchData } from './components/FetchData';

import JobList  from "./components/JobList"
import LeafletMap from "./components/LeafletMap";
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import {ApplicationPaths, LoginActions} from './components/api-authorization/ApiAuthorizationConstants';
import AddJobForm from "./components/AddJob";
import JobDetails from "./components/jobDetails";

import './custom.css'
import {Login} from "./components/api-authorization/Login";
import EditJobForm from "./components/EditJob";
import MessageForm from "./components/Messages/MessageForm";
import Chat from "./components/Messages/Chat";
import ThreadsList from "./components/Messages/ThreadsList";


export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={LeafletMap} />
        <Route path='/map' component={LeafletMap} />

        <AuthorizeRoute path='/add' component={AddJobForm} />
        <Route path='/list' component={JobList} />

        <AuthorizeRoute path='/jobOrder/:id/edit' component={EditJobForm} />
        <AuthorizeRoute path='/jobOrder/:id/send' component={MessageForm} />
        <Route exact path="/jobOrder/:id" component={JobDetails} />

        <AuthorizeRoute path='/threads' component={ThreadsList} />
          <AuthorizeRoute path='/thread/:id' component={Chat} />

          <AuthorizeRoute path='/fetch-data' component={FetchData} />
        
        <Route path='/login' component={Login} action={LoginActions.Login} />
        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    );
  }
}
