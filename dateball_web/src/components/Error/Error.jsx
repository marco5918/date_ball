import React,{Component} from 'react';
import {connect} from 'dva';
import {Flex, WhiteSpace, WingBlank, Button} from 'antd-mobile';
import { Link } from 'dva/router';
import styles from './Error.css';
import queryString from 'query-string';

function Error({location, history}){
    const value = queryString.parse(location.search);

	return (
        <div>
        <div style={{textAlign:'center',height:'20px'}}>一起约球吧</div>
        <div className='align'>
        <Flex>
        <Flex.Item>抱歉，发生点小错误</Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
        <Flex justify="center" wrap="wrap">
            <Flex.Item>详细信息如下：</Flex.Item>
            <Flex.Item>{value.status}:{value.message}</Flex.Item>
        </Flex>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
        <Flex align="center" justify="center" >

            <Button type="primary" inline key='login' size="small" onClick={()=>{history.push('/login');window.location.reload();}} >请重新登录</Button>
            <WingBlank />
            <Button type="primary" inline key='home' size="small"  onClick={()=>{history.push('/');window.location.reload();}} >或回到主页面</Button>

        </Flex>
        </div>
        </div>
    );
}

export default Error;