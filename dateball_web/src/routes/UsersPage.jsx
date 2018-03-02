import React from 'react';
import { connect } from 'dva';
import UserComponent from '../components/Users/Users';
import styles from './UsersPage.css';

function Users({location,history}){

	return (
			<div className={styles.normal}>
			<UserComponent history={history} />
			</div>
	);
}

export default connect()(Users);
