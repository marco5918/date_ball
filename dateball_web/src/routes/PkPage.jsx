import React from 'react';
import { connect } from 'dva';
import PkComponent from '../components/Pk/Pk';
import styles from './PkPage.css';

function Pk({location,history}){

	return (
		<div className={styles.normal}>
		<PkComponent history={history} />
		</div>
	);
}

export default connect()(Pk);