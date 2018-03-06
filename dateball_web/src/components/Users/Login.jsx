import React,{Component} from 'react';
import {connect} from 'dva';
import {List, InputItem, WhiteSpace, Button} from 'antd-mobile';
import { Link } from 'dva/router';
import {createForm} from 'rc-form';
import queryString from 'query-string';
import styles from './Login.css';

class Login extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){ 
    }

    submit = () => {
        this.props.form.validateFields((error, value) => {
            console.log(error, value);
            if(error === null){
                this.props.dispatch({
                    type: 'me/login',
                    payload:{value},
                }).then(()=>{
                    console.log('dispatch login');
                }).catch((reason)=>{
                    console.error('dispatch login:',reason.message);
                });
            }
        });
    }

    render(){
        let login_error = "";
        const history = this.props.history;
        if(this.props.item !== null){
            const {success, message, data} = this.props.item;
            if(success){
                const {id, login_user, exp, token} = data;
                if(window.localStorage){
                    localStorage.setItem('data_ball_id',id);
                    localStorage.setItem('data_ball_login_user',login_user);
                    localStorage.setItem('data_ball_expires',exp);
                    localStorage.setItem('data_ball_token',token);
                }

                history.push('/me');
                return null;
            }else{
                login_error = <span style={{color:'red'}}>{message}</span>
            }
        }
        
        const { getFieldProps, getFieldError } = this.props.form;
        let errors;
        return (
        <div height="100%" >
            <List renderHeader={()=>'登录'}>        
                <WhiteSpace size="xl" />
                {login_error}
                <WhiteSpace />
                <InputItem
                    {...getFieldProps('login_user_phone', {
                        onChange(){}, 
                        rules: [{required: true}],
                        validateTrigger: 'onBlur',
                      })}
                    placeholder="登录名或手机号"
                >
                <div style={{ backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/DfkJHaJGgMghpXdqNaKF.png)', backgroundSize: 'cover', height: '22px', width: '22px' }} />
                </InputItem>
                {(errors = getFieldError('login_user_phone')) ? <span style={{color:'red'}}>{errors.join(',')}</span> : null}
                <WhiteSpace />
                <InputItem 
                    {...getFieldProps('password', {
                        onChange(){},
                        rules: [{required: true}],
                        validateTrigger: 'onBlur',
                      })}
                    type="password"
                    placeholder="****"
                >
                <div style={{ backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/DfkJHaJGgMghpXdqNaKF.png)', backgroundSize: 'cover', height: '22px', width: '22px' }} />
                </InputItem>
                {(errors = getFieldError('password')) ? <span style={{color:'red'}}>{errors.join(',')}</span> : null}
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace size="xl" />
                <Button type="primary" onClick={this.submit} >登录</Button><WhiteSpace />
                <WhiteSpace size="xl" />
                <div align="center"><Link to = "/signup" >注册</Link></div>
            </List>
        </div>
        );
    }
}

function mapStateToProps(state, ownProps){
    const {item} = state.me;
	return {
		loading: state.loading.models.users,
		item,
	};
}

export default connect(mapStateToProps)(createForm()(Login));