import React from 'react';
import { connect } from 'dva';


function Team({location}){

	return (
				<div>
				This is Team Page!
				</div>
	);
}

export default connect()(Team);