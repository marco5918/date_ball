import React , { Component } from 'react';
import { connect } from 'dva';
import { Toast, WhiteSpace, NavBar, List, Icon, Button, Card, WingBlank, Modal, DatePicker, Picker, InputItem, TextareaItem } from 'antd-mobile';
import ImageHeader from './../../utils/ImageHeader';
import TransitionGroup from '../Transition/TransitionGroup';
import PkAddEditPage from './PkAddEditPage';
import config from './../../../config';

class PkInfoPage extends Component {
	constructor(props){
		super(props);
		this.state = {
            infoModalVisible: false,
            noEditInfoModalVisible: false,
            pkModalPropName:'',
			pkModalPropValue:'',
			pkModalPropType:'',
			pkModalPlaceHold:'',
			pkModalTitle:'',
			pkModalExtra:'',
			pkModalKey:'',
            keyValue:'pkInfo',
            animateCls:'left',
            pkInfo:null,
		};
	};

	componentDidMount() {

    };

    componentWillMount(){
        const {pkInfo} = this.props;
        if(pkInfo !== undefined && pkInfo !== null){
            this.props.dispatch({
                type: 'pk/pkInfo',
                payload:pkInfo.pk.id,
            });
        }
    };
    
    componentWillReceiveProps(nextProps){
        const {item_pk_info, pkInfo} = this.props;
        
    };

    onEventClick = (e, type, name, key, value, extra)=>{
		let propName, propType, propKey, propValue, propPlaceHold, propTitle, propExtra;

		propName = name;
		propType = type;
		propValue = value;
		propTitle = '约战信息';
		propKey = key;

		if(type === 'text'){
			propPlaceHold = "请输入"+propName;
		}

		this.setState({
            infoModalVisible: true,
			pkModalPropName:propName,
			pkModalPropValue:propValue,
			pkModalPropType:propType,
			pkModalPlaceHold:propPlaceHold,
			pkModalTitle:propTitle,
			pkModalExtra:propExtra,
			pkModalKey:propKey,
			keyValue:'pkAddEdit',
			animateCls:'left',
		});
    };
    
    onOk=(key,value)=>{

		const team_id = this.props.team_player_info.team.id;
        const values = {
            id:team_id,
            [key]:value,
        };

        this.props.dispatch({
            type: 'pk/patch_pk',
            payload:{team_id, values},
        });

        
        this.setState({
                infoModalVisible: false,
                keyValue:'pkInfo',
                animateCls:'right',
        });
	};

    onBack=(e)=>{
		this.setState({
            infoModalVisible: false,
			keyValue:'teamInfo',
			animateCls:'right',
		});
    };

    render(){
        const Item = List.Item;
        const Brief =Item.Brief;
		const {error_info} = this.props;
                
        if(error_info !== undefined && error_info !== null &&!error_info.success){
            Toast.fail(error_info.message);
        }

        return (
                <div>
                    <TransitionGroup animateCls={this.state.animateCls} >
                        <div key={this.state.keyValue} style={{position:"absolute", width:"100%", height:"100%",overflowY:"auto"}} >
                        <div hidden={!this.state.infoModalVisible} >
                            <PkAddEditPage 
                            name = {this.state.teamModalKey}
                            title={this.state.teamModalTitle} 
                            editname={this.state.teamModalPropName}
                            value={this.state.teamModalPropValue}
                            type={this.state.teamModalPropType}
                            placeholder={this.state.teamModalPlaceHold}
                            extra={this.state.teamModalExtra}
                            onBack={this.onBack} 
                            onOk={this.onOk} 
                            />
                        </div>
                        <div hidden={!this.state.noEditInfoModalVisible} >
                            <NavBar
                                    mode="light"
                                    icon={<Icon type="left" />}
                                    onLeftClick={this.backHandler}
                                >约战详情</NavBar>
                            <List key="team_info">
                                <Item extra={this.state.pkInfo.select_self_team}>
                                主队
                                </Item>
                                <Item extra={this.state.pkInfo.select_pk_team}>
                                客队
                                </Item>
                                <Item
                                    arrow="horizontal"
                                    onClick={e=>this.showCourtInfo(e, this.state.pkInfo.court)}
                                    extra={this.state.pkInfo.court}>
                                球场
                                </Item>
                                <Item extra={this.state.pkInfo.pk_type === 1 ? '队内训练':'约战'} >
                                类型
                                </Item>
                                <Item extra={this.state.pkInfo.reply} >
                                状态
                                </Item>
                                <Item extra={this.state.pkInfo.start_datetime} >
                                开始日期
                                </Item>
                                <Item extra={this.state.pkInfo.last_answer_datetime} >
                                有效日期
                                </Item>
                                <Item extra={this.state.pkInfo.contact_name} >
                                联系人
                                </Item>
                                <Item extra={this.state.pkInfo.contact_phone} >
                                联系电话
                                </Item>
                                <Item>
                                描述<Brief>{this.state.pkInfo.comment}</Brief>
                                </Item>
                            </List>
                        </div>
                        <div  hidden={this.state.infoModalVisible || this.state.noEditInfoModalVisible} >
                            <NavBar
                                mode="light"
                                icon={<Icon type="left" />}
                                onLeftClick={this.backHandler}
                            >约战详情</NavBar>
                            <List key="team_info">
                                <Picker data={[{label:'dddd',value:'1'},{label:'fff',value:'2'}]}
                                 cols={1} className="forss" title="选择球队" 
                                 value={this.state.pkInfo.select_self_team}
                                 onOk={v => this.setState({pkInfo:{ select_self_team: v}})}>
                                <Item arrow="horizontal">
                                主队
                                </Item>
                                </Picker>
                                <Picker data={[{label:'队内训练',value:1},{label:'约战',value:2}]}
                                 cols={1} className="forss" title="选择类型"
                                 value={this.state.pkInfo.pk_type}
                                 onOk={v => this.setState({pkInfo:{ pk_type: v}})}>
                                <Item  arrow="horizontal" >
                                类型
                                </Item>
                                </Picker>
                                <Item
                                    arrow="horizontal"
                                    onClick={e=>this.onSearchTeam(e, this.state.pkInfo.select_pk_team)}
                                    extra={this.state.pkInfo.select_pk_team}
                                >
                                客队
                                </Item>
                                <Item
                                    arrow="horizontal"
                                    onClick={e=>this.showCourtInfo(e, this.state.pkInfo.court)}
                                    extra={this.state.pkInfo.court}>
                                球场
                                </Item>
                                <Picker data={[{label:'未答复',value:1},{label:'同意',value:2},{label:'拒绝',value:3}]}
                                 cols={1} className="forss" title="选择状态"
                                 value={this.state.pkInfo.reply}
                                 onOk={v => this.setState({pkInfo:{ reply: v}})}>
                                <Item arrow="horizontal">
                                状态
                                </Item>
                                </Picker>
                                <DatePicker
                                    value={this.state.pkInfo.start_datetime}
                                    onChange={date => this.setState({ pkInfo:{start_datetime: date} })}
                                >
                                <Item arrow="horizontal">
                                开始日期
                                </Item>
                                </DatePicker>
                                <DatePicker
                                    value={this.state.pkInfo.last_answer_datetime}
                                    onChange={date => this.setState({ pkInfo:{last_answer_datetime: date} })}
                                >
                                <Item arrow="horizontal">
                                有效日期
                                </Item>
                                </DatePicker>
                                <InputItem
                                    name='contact_name'
                                    type='text'
                                    placeholder='请输入联系人'
                                    value={this.state.pkInfo.contact_name}
                                    editable={true}
                                    onChange={val => this.setState({pkInfo:{contact_name: val}})}
                                    clear
                                    maxLength={254}
                                >联系人</InputItem>
                                <InputItem
                                    name='contact_name'
                                    type='text'
                                    placeholder='请输入联系电话'
                                    value={this.state.pkInfo.contact_phone}
                                    editable={true}
                                    onChange={val => this.setState({pkInfo:{contact_phone: val}})}
                                    clear
                                    maxLength={254}
                                >联系电话</InputItem>
                                <TextareaItem
                                    name='comment'
                                    title='描述'
                                    placeholder='请填入附加信息'
                                    value={this.state.pkInfo.comment}
                                    rows={8}
                                    count={200}
                                    onChange={val => this.setState({pkInfo:{comment: val}})}
                                    clear
                                />
                            </List>
                            <WhiteSpace />
                        </div>
                        </div>
                    </TransitionGroup>
                </div>
        );
    }
}

function mapStateToProps(state){
    const {item_pk_info, error_info, headers} = state.pk;
    return {
        item_pk_info,
        error_info,
        headers
    };
}

export default connect(mapStateToProps)(PkInfoPage);