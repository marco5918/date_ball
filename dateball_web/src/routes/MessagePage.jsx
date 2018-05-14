import React from 'react';
import { connect } from 'dva';

function Message({location}){

	return (
				<div>
				This is Message Page!
				</div>
	);
}

export default connect()(Message);