import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import MainLayout from '../components/MainLayout/MainLayout';
import { Router, Route, Switch, IndexRedirect,withRouter  } from 'dva/router';
import dynamic from 'dva/dynamic';

function IndexPage({location,history}) {
  const app = window.gApp;
  const GamePage = dynamic({
    app,
    component:()=>import('./GamePage'),
  });
  const TeamPage = dynamic({
    app,
    component:()=>import('./TeamPage'),
  });
  const PkPage = dynamic({
    app,
    component:()=>import('./PkPage'),
  });
  const CourtPage = dynamic({
    app,
    component:()=>import('./CourtPage'),
  });

  const MePage = dynamic({
    app,
    models:()=>[
      import('../models/users'),
    ],
    component:()=>import('./UsersPage'),
  });

  return (
    <MainLayout location={location} history={history} >
        <Switch>
        <Route exact path='/' component={MePage} />
        <Route path='/game' component={GamePage} />
        <Route path='/team' component={TeamPage} />
        <Route path='/pk' component={PkPage} />
        <Route path='/court' component={CourtPage} />
        <Route path='/me' component={MePage} />
        </Switch>
    </MainLayout>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
