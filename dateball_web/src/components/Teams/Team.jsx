import React,{Component} from 'react';
import { connect } from 'dva';
import { ListView, WhiteSpace, ImagePicker, List, InputItem, Button, Modal } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import styles from './Team.css';
import ImageHeader from './../../utils/ImageHeader';
import TransitionGroup from '../Transition/TransitionGroup';
import TeamInfoPage from './TeamInfoPage';


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
		};
    }
    
    componentDidMount(){
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.item !== this.props.item){
            const {success, data} = nextProps.item;
            const dataBlob = {};
            if(success){
                let team_players = data.team_players;
                for (let i = 0; team_players !== undefined && i < team_players.length; i++) {
                    dataBlob[`${i}`] = `row - ${i}`;
                }
            }

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(dataBlob),
            });
        }
    }


    gotoCreateTeam = () => {

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
		this.setState({
			teamModalListVisible: false,
			keyValue:'teamList',
			animateCls:'right',
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
    
                    const obj = team_players[index++];
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
                            <div style={{display:'-webkit-box flex', padding:'15px 0'}}>
                                <img style={{height: '64px', marginRight:'15px'}} src={obj.team.team_logo} alt="球队LOGO" />
                                <div style={{lineHeight: 1}}>
                                    <div style={{ marginBottom:'8px', fontSize: 17, fontWeight:5}}>
                                    {obj.team.team_city},比赛场次:{obj.team.match_num},球队队长:{caption_name}</div>
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
                                                    }}><Button type="primary" onClick={this.gotoCreateTeam} >创建球队</Button></div>
                                                )}
                                    </Sticky>
                                    )}
                                
                                renderHeader={()=><span></span>}
                                renderFooter={()=>(<div style={{ padding:30, textAlign:'center'}}>
                                    没有更多了</div>)}
                                renderRow={row}
                                renderSeparator={separator}
                                pageSize={1}
                                onScroll={()=>{console.log('scroll')}}
                                scrollEventThrottle={200}
                                onEndReached={()=>{console.log('onEndReached')}}
                                onEndReachedThreshold={10}
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
	const {item, headers} = state.team;
	return {
		loading: state.loading.models.team,
		item,
		headers
	};
}

export default connect(mapStateToProps)(Team);