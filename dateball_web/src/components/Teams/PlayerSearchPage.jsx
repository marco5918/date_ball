import React , { Component } from 'react';
import { connect } from 'dva';
import { Modal, Toast, Icon, Button, NavBar, SearchBar, Card, WingBlank, WhiteSpace } from 'antd-mobile';
import config from './../../../config';

class PlayerSearchPage extends Component {
	constructor(props){
		super(props);
		this.state = {
            value: "",
            search:null,
			visible: false,
			hasError:false,
		};
	};
	 
	componentWillReceiveProps(nextProps){
        const {error_info, search_item} = nextProps;

        if(search_item !== undefined && search_item!==null 
            && search_item.success && search_item.data !== undefined){
            this.setState({search:{
                me:search_item.data.me,
                hobby_info:search_item.data.hobby_info,
                player:search_item.data.player,
            }});
        }
	};

	componentDidMount() {		
		if(this.autoFocusInst !== undefined){
			this.autoFocusInst.focus();
		}
	};

    onSearch = (value)=>{
        const search_data = {
            search : value,
            teamId : this.props.teamId,
        };

		this.props.dispatch({
            type: 'team/search',
            payload:{search_data},
        });
    };
    
	onChange = (value)=>{
		this.setState({
			value:value,
		});
	};

    onClear = () => {
        this.setState({ value: '', search:null });
    };

	onErrorClick = (e)=>{
		this.setState({
			visible: false,
		});
	};

	submitHandler = (key) =>{
        console.log('submitHandler:',key);
        
        const alert = Modal.alert;

        if(this.state.search !== null && this.state.search.me !== undefined){
            const teamId = this.props.teamId;
            const selectPlayerId = this.state.search.me.id;

            if(this.state.search.player !== undefined && this.state.search.player !== null 
                && (this.state.search.player.status === 1 || this.state.search.player.status === 3)){
                    Toast.fail("该用户已在球队中，不可重复添加");
                    return;
            }

            let doAction = () => {

                const values = {
                    team_id:teamId,
                    me_id:selectPlayerId,
                };

                this.props.dispatch({
                    type: 'team/invite_player',
                    payload:{values},
                });                                   

                this.props.onSelect();
            }

            const alertInstance = alert("邀请", "确定邀请该用户加入球队？", [
                { text: '取消', onPress: () => {console.log('cancel')}, style: 'default' },
                { text: '确定', onPress: () => {
                    doAction();
                } },
            ]);
    
            setTimeout(() => {
                alertInstance.close();
            }, 500000);
       
        }else{
            Toast.fail("请先查找到需要邀请的用户");
        }
		
	};

	backHandler = (e) =>{
		console.log('backHandler:',e);
		this.props.onBack(e);
	};

	render(){

        let content = null;
        if(this.state.search !== null){
            let team_player_status = "";
            if(this.state.search.palyer !== undefined && this.state.search.palyer !== null){
                if(this.state.search.player.status === 1){
                    team_player_status = "(已入队)";
                }else if(this.state.search.player.status === 2){
                    team_player_status = "(已退队)";
                }else if(this.state.search.player.status === 3){
                    team_player_status = "(未入队)";
                }else if(this.state.search.player.status === 4){
                    team_player_status = "(已拒绝)";
                }
            }
            

            content = <WingBlank size="lg">
                        <WhiteSpace size="lg" />
                        <Card>
                        <Card.Header
                            title={<span>{this.state.search.me.name}{team_player_status}</span>}
                            thumb={config.api + this.state.search.me.favicon}
                            thumbStyle={{width:'64px', height:'64px'}}
                            extra={<span>{this.state.search.me.city}</span>}
                        />
                        <Card.Body>
                            <div><b>职业:</b>{this.state.search.me.job}, <b>爱好:</b>{this.state.search.me.hobby}</div>
                            <div><b>喜爱球星:</b>{this.state.search.hobby_info.love_star}, <b>喜爱球队:</b>{this.state.search.hobby_info.nba_team}, <b>可打位置:</b>{this.state.search.hobby_info.position}</div>
                            <div><b>特长:</b>{this.state.search.hobby_info.strong_point}, <b>球衣号码:</b>{this.state.search.hobby_info.jersey_number}</div>
                        </Card.Body>
                        <Card.Footer content={<div><b>性别:</b>{this.state.search.me.gender === 1 ? '男':'女'}, <b>身高:</b>{this.state.search.hobby_info.height}cm, <b>体重:</b>{this.state.search.hobby_info.weight}kg</div>}  />
                        </Card>
                        <WhiteSpace size="lg" />
                    </WingBlank>
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
					onClick={(e)=>this.submitHandler()} 
					>
					邀请</Button>,
				]}
			>邀请队员</NavBar>
			<SearchBar
                value={this.state.value}
                placeholder="输入账号或手机号码"
                onSubmit={(value)=>this.onSearch(value)}
                onClear={(e)=>this.onClear()}
                showCancelButton={false}
                onChange={(value)=>this.onChange(value)}
                ref={ref => this.autoFocusInst = ref}
            />
            <div hidden={this.state.search !== null} align="center">
                <span>无结果</span>
            </div>
            <div hidden={this.state.search === null} >
                {content}
            </div>
			</div>
		);
	}
}

function mapStateToProps(state){
	const {search_item, error_info, headers} = state.team;
	return {
        search_item,
        error_info,
		headers
	};
}

export default connect(mapStateToProps)(PlayerSearchPage);