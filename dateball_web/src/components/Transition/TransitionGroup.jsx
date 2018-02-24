import React, {Component} from 'react';
import { connect, dispatch } from 'dva';

//import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import style from './TransitionGroup.css';

class TransitionGroup extends Component{
	constructor(props, context){
		super(props, context);
	}

	componentWillMount(){
		document.body.style.margin = "0px";
		//防止页面被拖拽
		document.body.addEventListener('touchmove', (ev)=>{
			ev.preventDefault();
		});
	}

	render(){
		let {animateCls} = this.props;
		return (
			<ReactCSSTransitionGroup
				transitionName = {animateCls}
				transitionEnterTimeout={400}
				transitionLeaveTimeout={400} 
				>
					{
						this.props.children
					}
			</ReactCSSTransitionGroup>
		);
	}
}

export default connect()(TransitionGroup);

