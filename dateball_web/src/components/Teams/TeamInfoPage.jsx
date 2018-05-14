import React , { Component } from 'react';
import { connect } from 'dva';
import { Toast, WhiteSpace, NavBar, List, Icon, Button, Card, WingBlank, Modal } from 'antd-mobile';
import ImageHeader from './../../utils/ImageHeader';
import TransitionGroup from '../Transition/TransitionGroup';
import TeamEditPage from './TeamEditPage';
import PlayerSearchPage from './PlayerSearchPage';
import config from './../../../config';

class TeamInfoPage extends Component {
	constructor(props){
		super(props);
		this.state = {
            infoModalVisible: false,
            searchModalVisible: false,
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
            teamInfo:{
                id:null,
                team_logo:null,
                team_name:null,
                team_city:null,
                match_num:null,
                train_num:null,
                winning_rate:null,
                team_info:null,
                players:null,
            },
		};
	};

	componentDidMount() {
    };

    componentWillMount(){
        const {team_player_info} = this.props;

        let players_change = false;

        if(team_player_info !== undefined && team_player_info !== null
            && team_player_info.players !== undefined
            && team_player_info.players.length > 0
            && this.state.teamInfo !== null
            && this.state.teamInfo.players !== null){
                for(let i = 0; i < team_player_info.players.length; i++){
                   for(let j = 0; j < this.state.teamInfo.players.length; j++){
                        if(team_player_info.players[i].player.id === this.state.teamInfo.players[j].player.id){
                            if(team_player_info.players[i].player.updatedAt !== this.state.teamInfo.players[j].player.updatedAt){
                                players_change = true;
                                break;
                            }
                        }
                   }

                   if(players_change){
                       break;
                   }
                }
            
            }

        if(team_player_info !== undefined && team_player_info !== null
            && team_player_info.team !== undefined
            && (team_player_info.team.id !== this.state.teamInfo.id
            || team_player_info.team.team_logo !== this.state.teamInfo.team_logo
            || team_player_info.team.team_name !== this.state.teamInfo.team_name
            || team_player_info.team.team_city !== this.state.teamInfo.team_city
            || team_player_info.team.match_num !== this.state.teamInfo.match_num
            || team_player_info.team.train_num !== this.state.teamInfo.train_num
            || team_player_info.team.winning_rate !== this.state.teamInfo.winning_rate
            || team_player_info.team.team_info !== this.state.teamInfo.team_info
            || players_change)){
            this.setState({teamInfo:{
                id:team_player_info.team.id,
                team_logo:team_player_info.team.team_logo,
                team_name:team_player_info.team.team_name,
                team_city:team_player_info.team.team_city,
                match_num:team_player_info.team.match_num,
                train_num:team_player_info.team.train_num,
                winning_rate:team_player_info.team.winning_rate,
                team_info:team_player_info.team.team_info,
                players:team_player_info.players,
            }});
        };
    };
    
    componentWillReceiveProps(nextProps){
        const {error_info, item_team_info} = nextProps;

        if(item_team_info !== undefined && item_team_info!==null 
            && item_team_info.success && item_team_info.data.team !== undefined
            && item_team_info.data.players !== undefined){
            this.setState({teamInfo:{
                id:item_team_info.data.team.id,
                team_logo:item_team_info.data.team.team_logo,
                team_name:item_team_info.data.team.team_name,
                team_city:item_team_info.data.team.team_city,
                match_num:item_team_info.data.team.match_num,
                train_num:item_team_info.data.team.train_num,
                winning_rate:item_team_info.data.team.winning_rate,
                team_info:item_team_info.data.team.team_info,
                players:item_team_info.data.players,
            }});
        }
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
            searchModalVisible: false,
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
				favicon:value,
				team_id:team_id,
				form_key:key,
			};

			this.props.dispatch({
				type: 'team/upload',
				payload:{update_value},
			});

		}else{
			const values = {
				id:team_id,
				[key]:value,
			};
	
			this.props.dispatch({
				type: 'team/patch_team',
				payload:{team_id, values},
			});

        }
        
        this.setState({
                infoModalVisible: false,
                searchModalVisible: false,
                keyValue:'teamInfo',
                animateCls:'right',
        });
	};

    onBack=(e)=>{
		this.setState({
            infoModalVisible: false,
            searchModalVisible: false,
			keyValue:'teamInfo',
			animateCls:'right',
		});
    };

    onSelect=(e)=>{
		this.setState({
            infoModalVisible: false,
            searchModalVisible: false,
			keyValue:'teamInfo',
			animateCls:'right',
		});
    };

	backHandler = (e) =>{
		this.props.onBack(e);
    };

    gotoSelectPlayers = (team_id) =>{
        this.setState({
            infoModalVisible: false,
            searchModalVisible: true,
			keyValue:'playerSearch',
			animateCls:'left',
		});
    };

    submitHandler = (action) => {
        const alert = Modal.alert;
        let alert_title = "";
        let alert_info = "";
        let doAction = null;
        
        const me_id = parseInt(localStorage.getItem('data_ball_id'));
        switch(action){
            case 'out':
            {
                console.log("out");
                alert_title = "退队";
                alert_info = "请您确认是否退出球队（确保球队至少有一名队长或副队长）？";
                doAction = () => {
                    const {team_player_info} = this.props;
                    if(team_player_info !== undefined && team_player_info !== null 
                        && team_player_info.team !== undefined && team_player_info.team !== null){
                            const team_id = team_player_info.team.id;
                            const values = {
                                team_id:team_id,
                                me_id:me_id,
                            };

                            this.props.dispatch({
                                type: 'team/out_team',
                                payload:{values},
                            });                                   
                    }
                    this.backHandler();
                }
            }
            break;
            case 'join':
            {
                console.log("join");
                alert_title = "加入";
                alert_info = "请您确认是否加入球队？";
                doAction = () => {
                    const {team_player_info} = this.props;
                    if(team_player_info !== undefined && team_player_info !== null 
                        && team_player_info.team !== undefined && team_player_info.team !== null){
                            const team_id = team_player_info.team.id;
                            const values = {
                                team_id:team_id,
                                me_id:me_id,
                            };

                            this.props.dispatch({
                                type: 'team/join_team',
                                payload:{values},
                            });                                   
                    }
                    this.backHandler();
                }
            }
                
            break;
            case "reject":
            {
                alert_title = "拒绝";
                alert_info = "请您确认是否拒绝球队邀请？";
                doAction = () => {
                    const {team_player_info} = this.props;
                    if(team_player_info !== undefined && team_player_info !== null 
                        && team_player_info.team !== undefined && team_player_info.team !== null){
                            const team_id = team_player_info.team.id;
                            const values = {
                                team_id:team_id,
                                me_id:me_id,
                            };

                            this.props.dispatch({
                                type: 'team/reject_team',
                                payload:{values},
                            });                                   
                    }
                    this.backHandler();
                }
            }
                
            break;
            case "hidden":
            {
                console.log("hidden");
            }
               
            break;
            default:
            break;
        }

        const alertInstance = alert(alert_title, alert_info, [
			{ text: '取消', onPress: () => {console.log('cancel')}, style: 'default' },
			{ text: '确定', onPress: () => {
                doAction();
			} },
		]);

        setTimeout(() => {
			alertInstance.close();
        }, 500000);
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
                const {team_player_info} = this.props;
                if(team_player_info !== undefined && team_player_info !== null 
                    && team_player_info.team !== undefined && team_player_info.team !== null){
                        const id = team_player_info.team.id;
                        this.props.dispatch({
                            type: 'team/remove_team',
                            payload:id,
                        });                                   
                }
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
		const {error_info} = this.props;
        let player_me = null;
        const me_id = parseInt(localStorage.getItem('data_ball_id'));

        if(this.state.teamInfo !== undefined &&
            this.state.teamInfo.players !== undefined && 
            this.state.teamInfo.players !== null &&
            this.state.teamInfo.players.length > 0){
                const player_contents = this.state.teamInfo.players.map((player_info)=>{

                    let team_title = "队员";
                    if(player_info.player.team_title === 1){
                        team_title = "队长";
                    }else if(player_info.player.team_title === 2){
                        team_title = "副队长";
                    }

                    let team_player_status = "";
                    if(player_info.player.status === 1){
                        team_player_status = "(已入队)";
                    }else if(player_info.player.status === 2){
                        team_player_status = "(已退队)";
                    }else if(player_info.player.status === 3){
                        team_player_status = "(未入队)";
                    }else if(player_info.player.status === 4){
                        team_player_status = "(已拒绝)";
                    }

                    
                    if(player_info.player.meId === me_id){
                        player_me = player_info.player;
                    }

                    return (<WingBlank size="lg" key={"players_"+player_info.player.id}>
                        <WhiteSpace size="lg" />
                        <Card>
                        <Card.Header
                            title={<span>{player_info.me.nick_name === "" ? player_info.me.name : player_info.me.nick_name}</span>}
                            thumb={config.api + player_info.me.favicon}
                            thumbStyle={{width:'64px', height:'64px'}}
                            extra={<span>{team_title}{team_player_status}</span>}
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

                

                if(error_info !== undefined && error_info !== null &&!error_info.success){
                    Toast.fail(error_info.message);
                }

                let rightContent = [];
                let deleteTeam = null;
                let disableSubmit = true;

                if(player_me.status === 1){
                    rightContent[0] = <WingBlank key="0" size="sm"><Button key="0" type="primary" size="small" 
                                        inline
                                        onClick={(e)=>this.submitHandler("out")} >
                                        退队</Button></WingBlank>;
                    if(player_me.team_title === 1 || player_me.team_title === 2 ){
                        rightContent[1] = <WingBlank key="1" size="sm"><Button key="1" type="primary" size="small" 
                                        inline
                                        onClick={(e)=>this.gotoSelectPlayers(this.state.teamInfo.id)} >
                                        邀请</Button></WingBlank>;
                        disableSubmit = false;
                        deleteTeam = <Button type="warning" size='large' onClick={this.showAlert}>删除球队</Button>
                    }               

                }else if(player_me.status === 3){
                    
                    rightContent[0] = <WingBlank key="0"  size="sm"><Button key="0" type="primary" size="small" 
                                        inline
                                        onClick={(e)=>this.submitHandler("join")} >
                                        入队</Button></WingBlank>;
                    rightContent[1] = <WingBlank key="1"  size="sm"><Button key="1" type="primary" size="small" 
                                        inline
                                        onClick={(e)=>this.submitHandler("reject")} >
                                        拒绝</Button></WingBlank>;

                }else if(player_me.status === 4 || player_me.status === 2){
                    // rightContent[0] = <WingBlank size="sm"><Button key="0" type="primary" size="small" 
                    //                     inline
                    //                     onClick={(e)=>this.submitHandler("hidden")} >
                    //                     隐藏显示拒绝或退出球队</Button></WingBlank>;
                }

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
                                onOk={this.onOk} 
                                disableSubmit={disableSubmit}/>
                        </div>
                        <div hidden={!this.state.searchModalVisible} >
                            <PlayerSearchPage
                                teamId = {this.state.teamInfo.id}
                                onBack={this.onBack}
                                onSelect={this.onSelect} />
                        </div>
                        <div  hidden={this.state.infoModalVisible || this.state.searchModalVisible} >
                         <NavBar
                             mode="light"
                             icon={<Icon type="left" />}
                             onLeftClick={this.backHandler}
                             rightContent={rightContent}
                         >球队信息</NavBar>
                         <List key="team_info">
                             <Item
                                 arrow="horizontal"
                                 onClick={
                                     e=>this.onEventClick(e,'img','球队LOGO', 'team_logo',  this.state.teamInfo.team_logo)
                                 }
                                 
                             >
                             <ImageHeader src={this.state.teamInfo.team_logo} />
                             </Item>
                             <Item 
                                 arrow="horizontal"
                                 onClick={e=>this.onEventClick(e,'text', '球队名称', 'team_name', this.state.teamInfo.team_name)}
                                 extra={this.state.teamInfo.team_name}>
                                 球队名称
                             </Item>
                             <Item
                                 arrow="horizontal"
                                 onClick={e=>this.onEventClick(e,'text', '城市', 'team_city', this.state.teamInfo.team_city)}
                                 extra={this.state.teamInfo.team_city}>
                                 城市
                             </Item>
                             <Item 
                                 arrow="horizontal"
                                 onClick={e=>this.onEventClick(e,'number', '比赛场次', 'match_num', this.state.teamInfo.match_num)}
                                 extra={this.state.teamInfo.match_num} >
                                 比赛场次
                             </Item>
                             <Item 
                                 arrow="horizontal"
                                 onClick={e=>this.onEventClick(e,'number', '训练场次', 'train_num', this.state.teamInfo.train_num)}
                                 extra={this.state.teamInfo.train_num} >
                                 训练场次
                             </Item>
                             <Item 
                                 arrow="horizontal"
                                 onClick={e=>this.onEventClick(e,'number', '胜率', 'winning_rate', this.state.teamInfo.winning_rate)}
                                 extra={this.state.teamInfo.winning_rate} >
                                 胜率
                             </Item>
                             <Item
                                 arrow="horizontal"
                                 onClick={e=>this.onEventClick(e,'text_area','球队描述', 'team_info', this.state.teamInfo.team_info)}
                                >
                                球队描述<Brief>{this.state.teamInfo.team_info}</Brief>
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
                        {deleteTeam}
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

function mapStateToProps(state){
	const {item_team_info, error_info, headers} = state.team;
	return {
        item_team_info,
        error_info,
		headers
	};
}

export default connect(mapStateToProps)(TeamInfoPage);