import React from 'react';
import { connect } from 'dva';

function Court({location}){

	return (
				<div>
				This is Court Page!
				</div>
	);
}

export default connect()(Court);