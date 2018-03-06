import React from 'react';
import { connect } from 'dva';
import ErrorComponent from '../components/Error/Error';
import styles from './UsersPage.css';

function Error({location,history}){

	return (
			<div className={styles.normal}>
			<ErrorComponent location={location} history={history} />
			</div>
	);
}

export default Error;
