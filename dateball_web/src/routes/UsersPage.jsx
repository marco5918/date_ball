import React from 'react';
import { connect } from 'dva';
import UserComponent from '../components/Users/Users';
import styles from './UsersPage.css';

function Users({location,match}){

	return (
			<div className={styles.normal}>
			<UserComponent id={match.params.id} />
			</div>
	);
}

export default connect()(Users);
