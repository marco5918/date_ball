import React from 'react';
import { connect } from 'dva';
import LoginComponent from '../components/Users/Login';
import styles from './UsersPage.css';
function Login({location,history}){

	return (
			<div className={styles.normal}>
			<LoginComponent history={history} />
			</div>
	);
}

export default connect()(Login);
