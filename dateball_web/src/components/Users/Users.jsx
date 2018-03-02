import React,{Component} from 'react';
import { connect } from 'dva';
import { WhiteSpace, ImagePicker, List, InputItem, Button,Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import styles from './Users.css';
import ImageHeader from './ImageHeader';
import UserModal from './UserModal';
import TransitionGroup from '../Transition/TransitionGroup';



class Users extends Component{
	constructor(props){
		super(props);
		this.state = {
			userModalVisible: false,
			userModalPropName:'',
			userModalPropValue:'',
			userModalPropType:'',
			userModalPlaceHold:'',
			userModalTitle:'',
			userModalExtra:'',
			userModalKey:'',
			keyValue:'userItem',
			animateCls:'left',
		};
	}

	onEventClick = (e, type, name, key, value, extra)=>{
		console.log("onEventClick:"+type+' '+name+' '+' '+value);
		let propName, propType, propKey, propValue, propPlaceHold, propTitle, propExtra;

		propName = name;
		propType = type;
		propValue = value;
		propTitle = '修改个人信息';
		propKey = key;

		if(type === 'text'){
			propPlaceHold = "请输入"+propName;
		}else if(type === 'number'){
			propPlaceHold = "请输入"+propName;
			propExtra = extra;
		}

		this.setState({
			userModalVisible: true,
			userModalPropName:propName,
			userModalPropValue:propValue,
			userModalPropType:propType,
			userModalPlaceHold:propPlaceHold,
			userModalTitle:propTitle,
			userModalExtra:propExtra,
			userModalKey:propKey,
			keyValue:'userModal',
			animateCls:'left',
		});
	};

	onBack=(e)=>{
		this.setState({
			userModalVisible: false,
			keyValue:'userItem',
			animateCls:'right',
		}
		);
	};

	onOk=(key,value)=>{

		const id = this.props.item.data.me.id;
		const hobby_id = this.props.item.data.hobby_info.id;
		console.log("id=",id);

		if(key === 'favicon' && value !== ''){

			const update_value = {
				favicon:value,
				id:id,
				hobby_id:hobby_id,
				form_key:key,
			};

			this.props.dispatch({
				type: 'me/upload',
				payload:{update_value},
			});

		}else{
			const values = {
				id:id,
				hobby_id:hobby_id,
				[key]:value,
			};
	
			this.props.dispatch({
				type: 'me/patch',
				payload:{id, values},
			});

		}
	

		this.setState({
			userModalVisible: false,
			keyValue:'userItem',
			animateCls:'right',
		}
		);
	}

	showAlert = () => {
		const alert = Modal.alert;
		const alertInstance = alert('退出', '确定要退出登录?', [
			{ text: '取消', onPress: () => {console.log('cancel')}, style: 'default' },
			{ text: '确定', onPress: () => {
				if(window.localStorage){
					localStorage.clear();
					this.props.history.push('/me');
				}
			} },
		]);
		setTimeout(() => {
			alertInstance.close();
		}, 500000);
	};

	render(){
		console.log("user headers",this.props.headers);

		if(this.props.headers && this.props.headers['x-access-token-expires']){
			const history = this.props.history;
			history.push('/login');
			return null;
		}

		if(this.props.headers === null || this.props.item === null){
			return (<div></div>);
		}else{
			
			const Item = List.Item;
			const {success, message, data} = this.props.item;
			

			if(success)
			{
				const {me, hobby_info} = data;		
				return (
					<div>			
						<TransitionGroup animateCls={this.state.animateCls} >
						<div key={this.state.keyValue} style={{position:"absolute", width:"100%", height:"100%",overflowY:"auto"}} >
						<div hidden={!this.state.userModalVisible ? true:false} >
						<UserModal 
						name = {this.state.userModalKey}
						title={this.state.userModalTitle} 
						editname={this.state.userModalPropName}
						value={this.state.userModalPropValue}
						type={this.state.userModalPropType}
						placeholder={this.state.userModalPlaceHold}
						extra={this.state.userModalExtra}
						onBack={this.onBack} 
						onOk={this.onOk} />
						</div>
						<div  hidden={this.state.userModalVisible? true:false} >
						<List renderHeader = {()=>'个人信息'}>
							<Item
								arrow="horizontal"
								onClick={
									e=>this.onEventClick(e,'img','头像', 'favicon', me.favicon)
								}
								extra={<ImageHeader src={me.favicon} />}
							>
							{me.login_user}
							</Item>
							<Item 
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'text', '姓名', 'name', me.name)}
								extra={me.name}>
								姓名
							</Item>
							<Item 
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'phone', '手机号码', 'phone', me.phone)}
								extra={me.phone} >
								手机号码
							</Item>
							<Item
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'text', '性别', 'gender', me.gender)}
								extra={me.gender == 1 ? '男':'女'}  >
								性别
							</Item>
							<Item
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'text', '城市', 'city', me.city)}
								extra={me.city}>
								城市
							</Item>
						</List>
						<WhiteSpace />
						<List renderHeader={()=>'详细信息'} >
							<Item 
								extra={me.job}
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'text', '职业', 'job', me.job)}
							>
							职业
							</Item>
							<Item 
								extra={me.hobby}
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'text','爱好', 'hobby', me.hobby)}
							>
							爱好
							</Item>
							<Item 
								extra={hobby_info.height+"cm"}
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'number','身高', 'height', hobby_info.height,'cm')}
							>
							身高
							</Item>
							<Item 
								extra={hobby_info.weight+"kg"}
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'number','体重', 'weight', hobby_info.weight,'kg')}
							>
							体重
							</Item>
							<Item 
								extra={hobby_info.position}
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'text','可打位置', 'position', hobby_info.position)}
							>
							可打位置
							</Item>
							<Item 
								extra={hobby_info.nba_team}
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'text','喜爱球队', 'nba_team', hobby_info.nba_team)}
								wrap
							>
							喜爱球队
							</Item>
							<Item 
								extra={hobby_info.love_star}
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'text','喜爱球星', 'love_star', hobby_info.love_star)}
								wrap
							>
							喜爱球星
							</Item>
							<Item 
								extra={hobby_info.strong_point}
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'text','特长', 'strong_point', hobby_info.strong_point)}
							>
							特长
							</Item>
							<Item 
								extra={hobby_info.jersey_number}
								arrow="horizontal"
								onClick={e=>this.onEventClick(e,'number','球衣号码', 'jersey_number', hobby_info.jersey_number)}
							>
							球衣号码
							</Item>
							<WhiteSpace size="xl" />
							<WhiteSpace size="xl" />
							<Button type="warning" size='large' onClick={this.showAlert}>退出登录</Button>
						</List>
						</div>
						</div>
						</TransitionGroup>
						
				</div>
				);

			}else{
				return (<div>{message}</div>)
			}
			
		}

		
	}
}



function mapStateToProps(state){
	const {item, headers} = state.me;
	return {
		loading: state.loading.models.users,
		item,
		headers
	};
}

export default connect(mapStateToProps)(Users);