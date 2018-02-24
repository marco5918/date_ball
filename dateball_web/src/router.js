import React from 'react';
import { Router, Route, Switch,IndexRedirect } from 'dva/router';
import dynamic from 'dva/dynamic';


function RouterConfig({ history, app }) {
	const IndexPage = dynamic({
		app,
		component:()=>import('./routes/IndexPage')

	});

	

  return (
    <Router history={history}>
      		<Route path='/' component={IndexPage}  />	 	
    </Router>
  );
}

export default RouterConfig;
