import React , { Component } from 'react';
import { connect } from 'dva';
import { WhiteSpace, NavBar, List, Icon, Button, Card, WingBlank, Modal } from 'antd-mobile';
import ImageHeader from './../../utils/ImageHeader';
import TransitionGroup from '../Transition/TransitionGroup';
import TeamEditPage from './TeamEditPage';
import config from './../../../config';

class TeamInfoPage extends Component {
	constructor(props){
		super(props);
		this.state = {
            infoModalVisible: false,
            playerInfoVisible: false,
            playerInfoMessage:'显示球员信息',
            teamModalPropName:'',
			teamModalPropValue:'',
			teamModalPropType:'',
			teamModalPlaceHold:'',
			teamModalTitle:'',
			teamModalExtra:'',
			teamModalKey:'',
            keyValue:'teamEdit',
			animateCls:'left',
		};
	};

	componentDidMount() {
    };
    
    onEventClick = (e, type, name, key, value, extra)=>{
		let propName, propType, propKey, propValue, propPlaceHold, propTitle, propExtra;

		propName = name;
		propType = type;
		propValue = value;
		propTitle = '修改球队信息';
		propKey = key;

		if(type === 'text'){
			propPlaceHold = "请输入"+propName;
		}else if(type === 'number'){
			propPlaceHold = "请输入"+propName;
			propExtra = extra;
		}

		this.setState({
			infoModalVisible: true,
			teamModalPropName:propName,
			teamModalPropValue:propValue,
			teamModalPropType:propType,
			teamModalPlaceHold:propPlaceHold,
			teamModalTitle:propTitle,
			teamModalExtra:propExtra,
			teamModalKey:propKey,
			keyValue:'teamEdit',
			animateCls:'left',
		});
    };
    
    onOk=(key,value)=>{

		const team_id = this.props.team_player_info.team.id;

		if(key === 'team_logo' && value !== ''){

			const update_value = {
				team_logo:value,
				team_id:team_id,
				form_key:key,
			};

			this.props.dispatch({
				type: 'team/upload',
				payload:{update_value},
			});

		}else{
			const values = {
				team_id:team_id,
				[key]:value,
			};
	
			this.props.dispatch({
				type: 'team/patch_team',
				payload:{team_id, values},
			});

		}
	

		this.setState({
			infoModalVisible: false,
			keyValue:'teamInfo',
			animateCls:'right',
		}
		);
	};

    onBack=(e)=>{
		this.setState({
			infoModalVisible: false,
			keyValue:'teamInfo',
			animateCls:'right',
		});
    };

	backHandler = (e) =>{
		this.props.onBack(e);
    };
    
    showPlayerInfo = ()=>{
        const status = this.state.playerInfoVisible;
        if(status){
            this.setState({
                playerInfoVisible:false,
                playerInfoMessage:'显示球员信息',                
            })
        }else{
            this.setState({
                playerInfoVisible:true,
                playerInfoMessage:'隐藏球员信息',                
            })
        }
    };

    showAlert = () => {
		const alert = Modal.alert;
		const alertInstance = alert('删除', '确定要删除球队?', [
			{ text: '取消', onPress: () => {console.log('cancel')}, style: 'default' },
			{ text: '确定', onPress: () => {
				this.backHandler();
			} },
		]);
		setTimeout(() => {
			alertInstance.close();
		}, 500000);
	};

	render(){
        const Item = List.Item;
        const Brief =Item.Brief;
		const {team_player_info} = this.props;
        
        if(team_player_info!== undefined && team_player_info.team !== undefined &&
            team_player_info.players !== undefined && team_player_info.players.length > 0){
                const player_contents = team_player_info.players.map((player_info)=>{
                    let team_title = "队员";
                    if(player_info.player.team_title === 1){
                        team_title = "队长";
                    }else if(player_info.player.team_title === 2){
                        team_title = "副队长";
                    }

                    return (<WingBlank size="lg" key={"players_"+player_info.player.id}>
                        <WhiteSpace size="lg" />
                        <Card>
                        <Card.Header
                            title={<span>{player_info.me.nick_name === "" ? player_info.me.name : player_info.me.nick_name}</span>}
                            thumb={config.api + player_info.me.favicon}
                            thumbStyle={{width:'64px', height:'64px'}}
                            extra={<span>{team_title}</span>}
                        />
                        <Card.Body>
                            <div>比赛场次:{player_info.player.game_count},总得分:{player_info.player.total_points},场均得分:{player_info.player.avg_points}</div>
                            <div>总篮板:{player_info.player.total_rebound},场均篮板:{player_info.player.avg_rebound},总助攻:{player_info.player.total_assist},场均助攻:{player_info.player.avg_assist}</div>
                            <div>总盖帽:{player_info.player.total_block},场均盖帽:{player_info.player.avg_block},总抢断:{player_info.player.total_steal},场均抢断:{player_info.player.avg_steal}</div>
                            <div>总三分投中数:{player_info.player.total_three_point_hit},场均三分投中数:{player_info.player.avg_three_point_hit}</div>
                        </Card.Body>
                        <Card.Footer content={<div>得分王:{player_info.player.scoring_leader},篮板王:{player_info.player.rebound_leader},助攻王:{player_info.player.assisting_leader},盖帽王:{player_info.player.blocking_leader},抢断王:{player_info.player.stealing_leader}</div>}
                        />
                        </Card>
                        <WhiteSpace size="lg" />
                    </WingBlank>)
                });
                
                return (
                     <div>
                         <TransitionGroup animateCls={this.state.animateCls} >
                         <div key={this.state.keyValue} style={{position:"absolute", width:"100%", height:"100%",overflowY:"auto"}} >
                         <div hidden={!this.state.infoModalVisible} >
                            <TeamEditPage 
                                name = {this.state.teamModalKey}
                                title={this.state.teamModalTitle} 
                                editname={this.state.teamModalPropName}
                                value={this.state.teamModalPropValue}
                                type={this.state.teamModalPropType}
                                placeholder={this.state.teamModalPlaceHold}
                                extra={this.state.teamModalExtra}
                                onBack={this.onBack} 
                                onOk={this.onOk} />
                        </div>
                        <div  hidden={this.state.infoModalVisible} >
                         <NavBar
                             mode="light"
                             icon={<Icon type="left" />}
                             onLeftClick={this.backHandler}
                             rightContent={[
                                 <Button key="0" type="primary" size="small" 
                                 inline
                                 onClick={(e)=>this.submitHandler()} >
                                 加入/退出球队</Button>,
                             ]}
                         >球队信息</NavBar>
                         <List key="team_info">
                             <Item
                                 arrow="horizontal"
                                 onClick={
                                     e=>this.onEventClick(e,'img','球队LOGO', 'team_logo',  team_player_info.team.team_logo)
                                 }
                                 
                             >
                             <ImageHeader src={team_player_info.team.team_logo} />
                             </Item>
                             <Item 
                                 arrow="horizontal"
                                 onClick={e=>this.onEventClick(e,'text', '球队名称', 'team_name', team_player_info.team.team_name)}
                                 extra={team_player_info.team.team_name}>
                                 球队名称
                             </Item>
                             <Item
                                 arrow="horizontal"
                                 onClick={e=>this.onEventClick(e,'text', '城市', 'team_city', team_player_info.team.team_city)}
                                 extra={team_player_info.team.team_city}>
                                 城市
                             </Item>
                             <Item 
                                 arrow="horizontal"
                                 onClick={e=>this.onEventClick(e,'number', '比赛场次', 'match_num', team_player_info.team.match_num)}
                                 extra={team_player_info.team.match_num} >
                                 比赛场次
                             </Item>
                             <Item 
                                 arrow="horizontal"
                                 onClick={e=>this.onEventClick(e,'number', '训练场次', 'train_num', team_player_info.team.train_num)}
                                 extra={team_player_info.team.train_num} >
                                 训练场次
                             </Item>
                             <Item 
                                 arrow="horizontal"
                                 onClick={e=>this.onEventClick(e,'number', '胜率', 'winning_rate', team_player_info.team.winning_rate)}
                                 extra={team_player_info.team.winning_rate} >
                                 胜率
                             </Item>
                             <Item
                                 arrow="horizontal"
                                 onClick={e=>this.onEventClick(e,'text_area','球队描述', 'team_info', team_player_info.team.team_info)}
                                >
                                球队描述<Brief>{team_player_info.team.team_info}</Brief>
                             </Item>
                        </List>
                        <WhiteSpace />
                        <Button type="primary" size='large' onClick={this.showPlayerInfo}>{this.state.playerInfoMessage}</Button>
                        <div hidden={!this.state.playerInfoVisible} >
                            <List key="player_info" renderHeader={()=>'球员信息'} >
                                {player_contents}                              
                            </List>
                        </div>
                        <WhiteSpace size="xl" />
                        <Button type="warning" size='large' onClick={this.showAlert}>删除球队</Button>
                    </div>
                </div> 
            </TransitionGroup>
                        
            </div>
            );
        }else{
            return (<div>获取数据失败</div>)
        }
	}
}

export default connect()(TeamInfoPage);