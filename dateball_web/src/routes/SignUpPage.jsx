import React from 'react';
import { connect } from 'dva';
import SignUpComponent from '../components/Users/SignUp';
import styles from './UsersPage.css';
function SignUp({location,history}){

	return (
			<div className={styles.normal}>
			<SignUpComponent history={history} />
			</div>
	);
}

export default connect()(SignUp);
