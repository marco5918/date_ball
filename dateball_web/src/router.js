import React from 'react';
import { Router, Route, Switch, IndexRedirect } from 'dva/router';
import dynamic from 'dva/dynamic';


function RouterConfig({ history, app }) {
	const IndexPage = dynamic({
		app,
		component:()=>import('./routes/IndexPage')
	});

	const LoginPage = dynamic({
    app,
    models:()=>[
      import('./models/users'),
    ],
    component:()=>import('./routes/LoginPage'),
	});
	
	const SignUpPage = dynamic({
    app,
    models:()=>[
      import('./models/users'),
    ],
    component:()=>import('./routes/SignUpPage'),
  });
	

  return (
    <Router history={history}>
			<Switch>
      <Route exact path='/login' component={LoginPage} />
      <Route exact path='/signup' component={SignUpPage} />
			<Route path='/' component={IndexPage}  />
			</Switch>
		</Router>
  );
}

export default RouterConfig;
