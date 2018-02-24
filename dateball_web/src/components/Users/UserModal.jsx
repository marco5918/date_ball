import React , { Component } from 'react';
import { Toast, Icon, Button, InputItem, NavBar} from 'antd-mobile';
import ImagePickerModal from './ImagePickerModal';

class UserEditPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			value: props.value,
			visible: false,
			hasError:false,
		};
	};

	componentDidMount() {

		if(this.autoFocusInst !== undefined){
			this.autoFocusInst.focus();
		}
	};

	onChange = (value)=>{
		this.setState({
			value:value,
		});
	};

	onErrorClick = (e)=>{
		this.setState({
			visible: false,
		});
	};

	submitHandler = (key) =>{
		console.log('submitHandler:',key);
		this.props.onOk(key, this.state.value);
	};

	backHandler = (e) =>{
		console.log('backHandler:',e);
		this.props.onBack(e);
	};

	render(){
		const { title, editname, name, value, type, placeholder, extra } = this.props;
		let content;
		if(type === 'img'){
			let url = "http://192.168.1.103:3002"+value;
			content = <ImagePickerModal
				src={url}
				onChange={this.onChange}
			/>
		}else{
			content = <InputItem
				name={name}
				type={type}
				extra={extra}
				placeholder={placeholder}
				error={this.state.hasError}
				onErrorClick={this.onErrorClick}
				value={this.state.value}
				editable={true}
				onChange={this.onChange}
				ref={el => this.autoFocusInst = el}
				clear
			>{editname}</InputItem>
		}

		return (
			<div >
			<NavBar
				mode="light"
				icon={<Icon type="left" />}
				onLeftClick={this.backHandler}
				rightContent={[
					<Button key="0" type="primary" size="small" 
					inline
					onClick={(e)=>this.submitHandler(name)} >
					提交</Button>,
				]}
			>{title}</NavBar>
			{content}
			</div>
		);
	}
}

export default UserEditPage;