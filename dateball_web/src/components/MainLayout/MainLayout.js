import React from 'react';
import styles from './MainLayout.css';
import Header from './Header';
import { TabBar } from 'antd-mobile';


class MainLayout extends React.Component {

	render(){
		const history = this.props.history;
		return (
			<div className={styles.normal}>
				<Header location={this.props.location} />
				<div className={styles.content}>
					<div style={{ position: 'relative', height: '100%', width: '100%'}}>
			        <TabBar
			          unselectedTintColor="#949494"
			          tintColor="#33A3F4"
			          barTintColor="white"
			        >
			          <TabBar.Item
			            title="比赛"
			            key="Game"
			            icon={<div style={{
			              width: '22px',
			              height: '22px',
			              background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat' }} />
			            }
			            selectedIcon={<div style={{
			              width: '22px',
			              height: '22px',
			              background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }} />
			            }
			            selected={this.props.location.pathname === '/game'}
			            badge={1}
			            onPress={() => {
			              history.push('/game');
			            }}
			          >
			             { this.props.location.pathname === '/game' ? this.props.children : null }
			          </TabBar.Item>
			          <TabBar.Item
			            icon={
			              <div style={{
			                width: '22px',
			                height: '22px',
			                background: 'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat' }} />
			            }

			            selectedIcon={
			              <div style={{
			                width: '22px',
			                height: '22px',
			                background: 'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat' }} />
			            }

			            title="球队"
			            key="Team"
			            badge={'new'}
			            selected={this.props.location.pathname === '/team'}
			            onPress={() => {
			              history.push('/team');
			            }}
			          >
			            {this.props.location.pathname === '/team' ? this.props.children : null }
			          </TabBar.Item>
			          <TabBar.Item
			            icon={
			              <div style={{
			                width: '22px',
			                height: '22px',
			                background: 'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat' }} />
			            }
			            selectedIcon={
			              <div style={{
			                width: '22px',
			                height: '22px',
			                background: 'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat' }} />
			            }
			            title="约战"
			            key="Pk"
			            dot
			            selected={this.props.location.pathname === '/pk'}
			            onPress={() => {
			              history.push('/pk');
			            }}
			          >
			            {this.props.location.pathname === '/pk' ? this.props.children : null }
			          </TabBar.Item>
			          <TabBar.Item
			            icon={{ uri: 'https://zos.alipayobjects.com/rmsportal/asJMfBrNqpMMlVpeInPQ.svg' }}
			            selectedIcon={{ uri: 'https://zos.alipayobjects.com/rmsportal/gjpzzcrPMkhfEqgbYvmN.svg' }}
			            title="球场"
			            key="Court"
			            selected={this.props.location.pathname === '/court'}
			            onPress={() => {
			              history.push('/court');
			            }}
			          >
			            {this.props.location.pathname === '/court' ? this.props.children : null }
			          </TabBar.Item>
			          <TabBar.Item
			            icon={{ uri: 'https://zos.alipayobjects.com/rmsportal/asJMfBrNqpMMlVpeInPQ.svg' }}
			            selectedIcon={{ uri: 'https://zos.alipayobjects.com/rmsportal/gjpzzcrPMkhfEqgbYvmN.svg' }}
			            title="我"
			            key="Me"
			            selected={this.props.location.pathname === '/me' || this.props.location.pathname === '/'}
			            onPress={() => {
			              history.push('/me');
			            }}
			          >
			            {(this.props.location.pathname === '/me' || this.props.location.pathname === '/') ? this.props.children : null }
			          </TabBar.Item>
			        </TabBar>
			      </div>
			    </div>
		    </div>
		);
	}
}


export default MainLayout;