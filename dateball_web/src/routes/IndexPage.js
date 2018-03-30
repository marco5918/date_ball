import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import MainLayout from '../components/MainLayout/MainLayout';
import {  Route, Switch  } from 'dva/router';
import dynamic from 'dva/dynamic';

function IndexPage({location,history}) {
  const app = window.gApp;
  const GamePage = dynamic({
    app,
    component:()=>import('./GamePage'),
  });
  const TeamPage = dynamic({
    app,
    models:()=>[
      import('../models/teams'),
    ],
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

  const filterPage = ()=>{
    let token = null;
    let expires = null;
    if(window.localStorage){
      token = localStorage.getItem('data_ball_token');
      expires = localStorage.getItem('data_ball_expires');
    }

    let push_url = "/login";

    if(token !== null && expires !== null){
      if(expires > Date.now()){
        push_url = "/me";
      }
    }

    history.push(push_url);

    return null;
  }


  return (
    <span>
    <MainLayout location={location} history={history} >
        <Switch>
        <Route exact path='/' component={filterPage} />
        <Route path='/game' component={GamePage} />
        <Route path='/team' component={TeamPage} />
        <Route path='/pk' component={PkPage} />
        <Route path='/court' component={CourtPage} />
        <Route path='/me' component={MePage} />
        </Switch>
    </MainLayout>
    </span>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
