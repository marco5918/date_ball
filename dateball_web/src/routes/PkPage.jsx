import React from 'react';
import { connect } from 'dva';

function Pk({location}){

	return (
				<div>
				This is Pk Page!
				</div>
	);
}

export default connect()(Pk);