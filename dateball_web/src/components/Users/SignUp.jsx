import React,{Component} from 'react';
import {connect} from 'dva';
import {List, InputItem, WhiteSpace, Button} from 'antd-mobile';
import { Link } from 'dva/router';
import {createForm} from 'rc-form';
import queryString from 'query-string';
import styles from './SignUp.css';

class SignUp extends Component{
    constructor(props){
        super(props);
        this.state = {
            value: '',
        };
    }

    componentDidMount(){
        //this.autoFocusInst.focus();
    }

    render(){
        const { getFieldProps } = this.props.form;
        return (
        <div height="100%" >
            <List renderHeader={()=>'注册'}>
                <WhiteSpace size="xl" />
                <InputItem
                    {...getFieldProps('login_name')}
                    placeholder="登录名称"
                >
                登录名称
                </InputItem>
                <WhiteSpace />
                <InputItem
                    {...getFieldProps('phone')}
                    type="phone"
                    placeholder="手机号码"
                >
                手机号码
                </InputItem>
                <WhiteSpace />
                <InputItem 
                    {...getFieldProps('password')}
                    type="password"
                    placeholder="****"
                >
                设置密码
                </InputItem>
                <WhiteSpace />
                <InputItem 
                    {...getFieldProps('password_confirm')}
                    type="password"
                    placeholder="****"
                >
                确认密码
                </InputItem>
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace size="xl" />
                <Button type="primary">注册</Button><WhiteSpace />
                <WhiteSpace size="xl" />
                <div align="center" ><Link to = "/login" >返回登录</Link></div>
            </List>
        </div>
        );
    }
}

function mapStateToProps(state, ownProps){
    return {};
}

export default connect(mapStateToProps)(createForm()(SignUp));