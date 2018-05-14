import React,{Component} from 'react';
import { connect } from 'dva';
import {PullToRefresh, Toast, ListView, WhiteSpace, ImagePicker, List, InputItem, TextareaItem, Button, Modal } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import styles from './Team.css';
import ImageHeader from './../../utils/ImageHeader';
import TransitionGroup from '../Transition/TransitionGroup';
import TeamInfoPage from './TeamInfoPage';
import config from './../../../config';


class Team extends Component{
	constructor(props){
        super(props);
        
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        
		this.state = {
            dataSource,
            animateCls:'left',
            teamModalListVisible: false,
            keyValue:'teamList',
            teamPlayerInfo:{},
            modal:false,
            create_team_name_value:'',
            create_team_city_value:'',
            create_team_desc_value:'',
            error_info:null,
            refreshing:true,
		};
    }
    
    componentDidMount(){
    }

    componentWillReceiveProps(nextProps){
        //if(nextProps.item !== this.props.item){
            const {error_info} = nextProps;
            const {success, data} = nextProps.item;
            const dataBlob = {};
            if(success){
                let team_players = data.team_players;
                for (let i = 0; team_players !== undefined && i < team_players.length; i++) {
                    if(team_players[i].team !== undefined){
                        dataBlob[`${i}`] = `row - ${team_players[i].team.updatedAt}`;
                    }
                }
            }

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(dataBlob),
            });
            this.setState({ refreshing: false});

            if(this.props.error_info === undefined || this.state.error_info === null){
                this.setState({
                    error_info:error_info
                })
                if(error_info !== undefined && error_info !== null && !error_info.success){
                    Toast.fail(error_info.message);
                }
            }else if(error_info !== undefined  && error_info.success !== this.props.error_info.success){
                
                this.setState({
                    error_info:error_info
                })
                if(error_info !== undefined && error_info !== null && !error_info.success){
                    Toast.fail(error_info.message);
                }
            }else{
                this.setState({
                    error_info:null
                })
            }
        //}
    }


    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
          [key]: true,
        });
    };

    onClose = key => () => {
        this.setState({
            [key]: false,
            error_info:null,
            create_team_name_value:'',
            create_team_city_value:'',
            create_team_desc_value:'',
        });
    };

    onCreateTeamValueChange = (key, value)=>{
		this.setState({
			[key]:value,
		});
    };
    
    onCreateTeam = ()=>{
        if(this.state.create_team_name_value !== '' 
            && this.state.create_team_city_value !== '' 
            && this.state.create_team_desc_value !== ''){
            
            const id = localStorage.getItem('data_ball_id');

            const values = {
                me_id:id,
                team_name:this.state.create_team_name_value,
                team_city:this.state.create_team_city_value,
                team_info:this.state.create_team_desc_value,
            };
    
            this.props.dispatch({
                type: 'team/create_team',
                payload:{values},
            });

            this.setState({
                modal: false,
                error_info:null,
                create_team_name_value:'',
                create_team_city_value:'',
                create_team_desc_value:'',
            });

        }else{
            Toast.fail("请填入各项内容");
        }
        
    };

    onEventClick = (e, team_play_info) => {
		this.setState({
            teamModalListVisible: true,
            teamPlayerInfo:team_play_info,
			keyValue:'teamInfo',
			animateCls:'left',
		});
    };

	onBack=(e)=>{
        const id = {id:localStorage.getItem('data_ball_id')}
        this.props.dispatch({
            type: 'team/fetch_team_list',
            payload:id
        });

		this.setState({
			teamModalListVisible: false,
			keyValue:'teamList',
			animateCls:'right',
		});
    };

    onRefresh = () => {
        this.setState({ refreshing: true});
        const id = {id:localStorage.getItem('data_ball_id')}
        this.props.dispatch({
            type: 'team/fetch_team_list',
            payload:id
        });
    };
    
	render(){

        if(this.props.headers && this.props.headers['x-access-token-expires']){
			const history = this.props.history;
			history.push('/login');
			return null;
		}

        if(this.props.headers === null || this.props.item === null){
			return (<div></div>);
		}else{
            const {success, message, data} = this.props.item;
            if(success && data.me !== undefined && data.team_players !== undefined)
			{
                const separator = (sectionID, rowID)=>(
                    <div
                        key={`${sectionID}-${rowID}`}
                        style={{
                            backgroundColor: '#F5F5F9',
                            height: 4,
                            borderTop: '1px solid #ECECED',
                            borderBottom: '1px solid #ECECED',
                        }}
                    />
                );
    
                let me = data.me;
                let hobby_info = data.hobby_info;
                let team_players = data.team_players;
                let index = 0;

                const row = (rowData, sectionID, rowID) =>{
    
                    //const obj = team_players[index++];
                    const obj = team_players[rowID];
                    let caption_name = "";
                    let status = "(尚未加入)"

                    if(obj.players !== undefined && obj.players.length > 0){
                        let flag = [0,0];
                        obj.players.map((info)=>{
                            if(info.player !== undefined && info.player.team_title === 1){
                                caption_name = info.me.nick_name === "" ? info.me.name : info.me.nick_name;
                                flag[0] = 1;
                            }

                            if(info.player !== undefined && info.me.id === me.id){
                                if(info.player.status === 1){
                                    status = "(已入队)";
                                }else if(info.player.status === 2){
                                    status = "(已退队)";
                                }else if(info.player.status === 3){
                                    status = "(未入队)";
                                }else if(info.player.status === 4){
                                    status = "(已拒绝)";
                                }
                                flag[1] = 1;
                            }

                            if(flag[0] === 1 && flag[1] === 1){
                                return null;
                            }
                        });
                    }

                    return (
                        <div key={rowID} style={{padding:'0 15px'}} onClick={e=>this.onEventClick(e,obj)} >
                            <div
                                style={{
                                    lineHeight:'50px',
                                    color:'#888',
                                    fontSize: 21,
                                    borderBottom:'1px solid #F6F6F6',
                                }}
                            >{obj.team.team_name+status}</div>
                            <div style={{display: '-webkit-box', display: 'flex', padding:'15px 0'}}>
                                <img style={{height: '64px', marginRight:'15px'}} src={config.api + obj.team.team_logo} alt="球队LOGO" />
                                <div style={{lineHeight: 1}}>
                                    <div style={{ marginBottom:'8px', fontSize: 17, fontWeight:5}}>
                                    {obj.team.team_city},场次:{obj.team.match_num},队长:{caption_name}</div>
                                    <div>
                                        <span style={{ width:'90%', wordWrap:'break-word', whiteSpace:'normal', display: 'inline-block', fontSize: 16, color:'#888'}}>{obj.team.team_info}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
    
    
                return (
                    <div>			
						<TransitionGroup animateCls={this.state.animateCls} >
						    <div key={this.state.keyValue} style={{position:"absolute", width:"100%", height:"100%",overflowY:"auto"}} >
                                <div hidden={!this.state.teamModalListVisible ? true:false} >
                                    <TeamInfoPage
                                        me = {me}
                                        hobby_info = {hobby_info}
                                        team_player_info = {this.state.teamPlayerInfo}
                                        onBack={this.onBack}
                                        />
                                </div>
                            </div>
						    <div  hidden={this.state.teamModalListVisible? true:false} >
                                <Modal
                                    popup
                                    visible={this.state.modal}
                                    onClose={this.onClose('modal')}
                                    animationType="slide-up"
                                    >
                                    <List renderHeader={() => <div>创建球队</div>} className="popup-list">
                                        <List.Item>
                                        <InputItem
                                            key='team_name'
                                            name='team_name'
                                            type='text'
                                            extra=''
                                            placeholder='请输入球队名称'
                                            error={this.state.hasError}
                                            onErrorClick={this.onErrorClick}
                                            value={this.state.create_team_name_value}
                                            editable={true}
                                            onChange={(val)=>{this.onCreateTeamValueChange('create_team_name_value',val)}}
                                            clear
                                        >球队名称</InputItem>
                                        </List.Item>
                                        <List.Item>
                                        <InputItem
                                            name='team_city'
                                            type='text'
                                            extra=''
                                            placeholder='请输入球队所在城市'
                                            error={this.state.hasError}
                                            onErrorClick={this.onErrorClick}
                                            value={this.state.create_team_city_value}
                                            editable={true}
                                            onChange={(val)=>{this.onCreateTeamValueChange('create_team_city_value',val)}}
                                            clear
                                        >城市</InputItem>
                                        </List.Item>
                                        <List.Item>
                                        <TextareaItem
                                            title='球队描述'
                                            placeholder='请输入球队描述'
                                            value={this.state.create_team_desc_value}
                                            error={this.state.hasError}
                                            onErrorClick={this.onErrorClick}
                                            rows={8}
                                            count={200}
                                            onChange={(val)=>{this.onCreateTeamValueChange('create_team_desc_value',val)}}
                                            clear
                                        />
                                        </List.Item>
                                        <List.Item>
                                        <Button type="primary" onClick={this.onCreateTeam}>创建</Button>
                                        </List.Item>
                                    </List>
                                </Modal>
                                <ListView
                                    ref={el => this.lv = el}
                                    dataSource={this.state.dataSource}
                                    className="styles.am-list styles.sticky-list"
                                    useBodyScroll
                                    renderSectionWrapper={sectionID=>(
                                        <StickyContainer
                                            key={`s_${sectionID}_c`}
                                            className="sticky-container"
                                            style={{ zIndex: 4 }}
                                        />
                                    )}
                
                                    renderSectionHeader = {sectionData=>(
                                    <Sticky>
                                        {({
                                            style,
                                        }) => (
                                            <div
                                                className="sticky"
                                                style={{
                                                    ...style,
                                                    zIndex:3,
                                                    }}><Button type="primary" onClick={this.showModal('modal')} >创建球队</Button>
                                                    </div>
                                                )}
                                    </Sticky>
                                    )}
                                
                                renderHeader={()=>{ return (team_players !== undefined && team_players.length > 0) ? <span></span> : <Button type="primary" onClick={this.showModal('modal')} >创建球队</Button>}}
                                renderFooter={()=>(<div style={{ padding:30, textAlign:'center'}}>
                                    没有更多了</div>)}
                                renderRow={row}
                                renderSeparator={separator}
                                onScroll={()=>{console.log('scroll')}}
                                scrollEventThrottle={200}
                                onEndReached={()=>{console.log('onEndReached')}}
                                onEndReachedThreshold={10}
                                initialListSize={100}
                                pullToRefresh={<PullToRefresh
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                                
                                />
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
	const {item, error_info, headers} = state.team;
	return {
		loading: state.loading.models.team,
        item,
        error_info,
		headers
	};
}

export default connect(mapStateToProps)(Team);