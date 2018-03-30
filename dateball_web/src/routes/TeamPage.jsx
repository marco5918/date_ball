import React from 'react';
import { connect } from 'dva';
import TeamComponent from '../components/Teams/Team';
import styles from './TeamPage.css';

function Team({location,history}){

	return (
		<div className={styles.normal}>
		<TeamComponent history={history} />
		</div>
	);
}

export default connect()(Team);