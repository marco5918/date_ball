import React from 'react';
import { connect } from 'dva';

function Game({location}){

	return (
				<div>
				This is Game Page!
				</div>
	);
}

export default connect()(Game);