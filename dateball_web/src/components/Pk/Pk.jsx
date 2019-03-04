import React,{Component} from 'react';
import { connect } from 'dva';
import {PullToRefresh, Toast, ListView, WhiteSpace, ImagePicker, List, InputItem, TextareaItem, Button, Modal } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import styles from './Pk.css';
import ImageHeader from './../../utils/ImageHeader';
import TransitionGroup from '../Transition/TransitionGroup';
import PkInfoPage from './PkInfoPage';
import config from './../../../config';

class Pk extends Component{
	constructor(props){
        super(props);
        
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            dataSource,
            animateCls:'left',
            pkModalInfoVisible: false,
            keyValue:'pkList',
            pkInfo:null,
            modal:false,
            error_info:null,
            refreshing:true,
		};
    }

    componentDidMount(){
    }

    componentWillReceiveProps(nextProps){
        const {error_info} = nextProps;
        const {success, data} = nextProps.item;
        const dataBlob = {};
        if(success){
            let pk_list = data.pk_list;
            for (let i = 0; pk_list !== undefined && i < pk_list.length; i++) {
                if(pk_list[i].pk !== undefined){
                    dataBlob[`${i}`] = `row - ${pk_list[i].pk.updatedAt}`;
                }
            }
        }

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(dataBlob),
        });
        this.setState({refreshing: false});

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

    };

    showPkInfo = key => (e, action) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            pkModalInfoVisible: true,
            pkInfo: null,
			keyValue:'pkInfo',
			animateCls:'left',
		});
    };

    onEventClick = (e, pk_info) => {
		this.setState({
            pkModalInfoVisible: true,
            pkInfo: pk_info,
			keyValue:'pkInfo',
			animateCls:'left',
		});
    };

    onBack=(e)=>{
        const id = {id:localStorage.getItem('data_ball_id')}
        this.props.dispatch({
            type: 'pk/fetch_pk_list',
            payload:id
        });

		this.setState({
			pkModalInfoVisible: false,
			keyValue:'pkList',
			animateCls:'right',
		});
    };

    onRefresh = () => {
        this.setState({ refreshing: true});
        const id = {id:localStorage.getItem('data_ball_id')}
        this.props.dispatch({
            type: 'pk/fetch_pk_list',
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
            if(success && data.me !== undefined && data.team_pk !== undefined)
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
    
                let team_pks = data.team_pk;

                const row = (rowData, sectionID, rowID) =>{
                    const obj = team_pks[rowID];
                    let type = "队内训练";
                    let status = "尚未答复";

                    if(obj.pk.reply === 1){
                        status = "尚未答复";
                        if(new Date(obj.pk.last_answer_datetime).getTime() < new Date().getTime()){
                            status = "过期";
                        }
                    }else if(obj.pk.reply === 2){
                        status = "同意";
                    }else if(obj.pk.reply === 3){
                        status = "拒绝";
                    }

                    if(obj.pk.pk_type === 1 ){
                        type = "队内训练";
                        status = "";
                    }else if(obj.pk.pk_type === 2 && obj.pk.select_pk_team === obj.my_team.id){
                        type = "被约战";
                    }else if(obj.pk.pk_type ===2 && obj.pk.select_self_team === obj.my_team.id){
                        type = "约战";
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
                            >{ obj.pk.pk_type === 1 ? type : obj.pk_team.team_name+'('+type+','+status+')'}</div>
                            <div style={{display: '-webkit-box', display: 'flex', padding:'15px 0'}}>
                                <img style={{height: '64px', marginRight:'15px'}} src={config.api + obj.my_team.team_logo} alt="球队LOGO" />
                                <div style={{lineHeight: 1}}>
                                    <div style={{ marginBottom:'8px', fontSize: 17, fontWeight:5}}>
                                    开始日期:{obj.pk.start_datetime},地址:{obj.court.court_addr}</div>
                                    <div>
                                        <span style={{ width:'90%', wordWrap:'break-word', whiteSpace:'normal', display: 'inline-block', fontSize: 16, color:'#888'}}>
                                        联系人:{obj.pk.contact_name},联系电话:{obj.pk.contact_phone}</span>
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
                                <div hidden={!this.state.pkModalInfoVisible ? true:false} >
                                    <PkInfoPage
                                        pkInfo = {this.state.pkInfo}
                                        onBack={this.onBack}
                                        />
                                </div>
                            </div>
						    <div  hidden={this.state.pkModalInfoVisible? true:false} >
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
                                                    }}><Button type="primary" onClick={this.showPkInfo('add')} >发起挑战</Button>
                                                    </div>
                                                )}
                                    </Sticky>
                                    )}
                                
                                renderHeader={()=>{ return (team_pks !== undefined && team_pks.length > 0) ? <span></span> : <Button type="primary" onClick={this.showPkInfo('add')} >发起挑战</Button>}}
                                renderFooter={()=>(<div style={{ padding:30, textAlign:'center'}}>
                                    没有更多了</div>)}
                                renderRow={row}
                                renderSeparator={separator}
                                onScroll={()=>{console.log('scroll')}}
                                scrollEventThrottle={200}
                                onEndReached={()=>{console.log('onEndReached')}}
                                onEndReachedThreshold={10}
                                initialListSize={5}
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
	const {item, error_info, headers} = state.pk;
	return {
		loading: state.loading.models.pk,
        item,
        error_info,
		headers
	};
}

export default connect(mapStateToProps)(Pk);