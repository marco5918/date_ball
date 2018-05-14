import React , { Component } from 'react';
import { Toast, Icon, Button, InputItem, NavBar, TextareaItem } from 'antd-mobile';
import ImagePickerModal from './../../utils/ImagePickerModal';
import config from './../../../config';

class TeamEditPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			value: props.value,
			visible: false,
			hasError:false,
		};
	};
	 
	componentWillReceiveProps(nextProps){
		if(nextProps.value !== this.props.value){
			this.setState({value:nextProps.value,});
		}
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
		const { title, editname, name, value, type, placeholder, extra, disableSubmit } = this.props;
		let content;
		const img_src = config.api + value;
		if(type === 'img'){
			let url = img_src;
			content = <ImagePickerModal
				src={url}
				onChange={this.onChange}
			/>
		}else if(type === 'text_area'){
			content = <TextareaItem
				title={editname}
				placeholder={placeholder}
				value={this.state.value}
				error={this.state.hasError}
				onErrorClick={this.onErrorClick}
				rows={8}
				count={200}
				onChange={this.onChange}
				disabled={disableSubmit}
				clear
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
				disabled={disableSubmit}
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
					disabled={disableSubmit}
					onClick={(e)=>this.submitHandler(name)} 
					>
					提交</Button>,
				]}
			>{title}</NavBar>
			{content}
			</div>
		);
	}
}

export default TeamEditPage;