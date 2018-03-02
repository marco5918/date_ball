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
    }

    componentDidMount(){
    }

    submit = () => {
        this.props.form.validateFields((error, value) => {
            console.log(error, value);
            if(error === null || (!error.hasOwnProperty('phone') && !error.hasOwnProperty('login_user'))){
                if(value.password === value.password_confirm){
                    value.phone = value.phone.replace(/ /g, "")
                    this.props.dispatch({
                        type: 'me/signup',
                        payload:{value},
                    });
                }
            }   
        });
      }

     
     passwordConfirm = (rule, value, callback) =>{
        var errors = [];
        let password_confirm = null;
        if(rule.field === 'password'){
            password_confirm = this.props.form.getFieldProps('password_confirm');
        }else if(rule.field === 'password_confirm'){
            password_confirm = this.props.form.getFieldProps('password');
        }else{
            errors.push(
                new Error(
                "获取数据错误")
        )}

        if(password_confirm !== null && password_confirm.value !== value){
            errors=[
                new Error("密码不一致")
            ];
        }else{
            errors = []
        }

        callback(errors);
     }

    render(){
        let signup_error = "";

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
                history.push('/me?id='+id);
                return null;
            }else{
                signup_error = <span style={{color:'red'}}>{message}</span>
            }
        }
        let errors = null;
        let errors_password = null;
        let errors_password_confirm = null;
        const { getFieldProps, getFieldError } = this.props.form;
        errors_password = getFieldError('password');
        errors_password_confirm = getFieldError('password_confirm');

        if(errors_password && errors_password.length > 1){
            errors_password.pop();
        }
        if(errors_password_confirm && errors_password_confirm.length > 1){
            errors_password_confirm.pop();
        }


        if((errors_password && errors_password[0] === '密码不一致') && (!errors_password_confirm || (errors_password_confirm && errors_password_confirm[0] !== '密码不一致'))){
            errors_password.pop();
        }else if((!errors_password || (errors_password && errors_password[0] !== '密码不一致')) && (errors_password_confirm && errors_password_confirm[0] === '密码不一致')){
            errors_password_confirm.pop();
        }

        return (
        <div height="100%" >
            <List renderHeader={()=>'注册'}>
                {signup_error}
                <WhiteSpace size="xl" />
                <InputItem
                    {...getFieldProps('login_user', {
                        onChange(){},
                        rules: [{required: true}],
                        validateTrigger: 'onBlur',
                      })}
                    placeholder="登录名称"
                >
                登录名称
                </InputItem>
                {(errors = getFieldError('login_user')) ? <span style={{color:'red'}}>{errors.join(',')}</span> : null}
                <WhiteSpace />
                <InputItem
                    {...getFieldProps('phone', {
                        onChange(){}, 
                        rules: [{required: true}],
                        validateTrigger: 'onBlur',
                      })}
                    type="phone"
                    placeholder="手机号码"
                >
                手机号码
                </InputItem>
                {(errors = getFieldError('phone')) ? <span style={{color:'red'}}>{errors.join(',')}</span> : null}
                <WhiteSpace />
                <InputItem 
                    {...getFieldProps('password', {
                        onChange(){}, 
                        rules: [{required: true},
                        {
                            validator: this.passwordConfirm,
                        },],
                        validateTrigger: ['onChange','onBlur'],
                      })}
                    type="password"
                    placeholder="****"
                >
                设置密码
                </InputItem>
                { errors_password ? <span style={{color:'red'}}>{errors_password.join(',')}</span> : null}
                <WhiteSpace />
                <InputItem 
                    {...getFieldProps('password_confirm', {
                        onChange(){}, 
                        rules: [
                            {required: true},
                            {
                                validator: this.passwordConfirm,
                            },],
                        validateTrigger: ['onChange','onBlur'],
                      })}
                    type="password"
                    placeholder="****"
                >
                确认密码
                </InputItem>
                { errors_password_confirm ? <span style={{color:'red'}}>{errors_password_confirm.join(',')}</span> : null}
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace />
                <WhiteSpace size="xl" />
                <Button type="primary" onClick={this.submit} >注册</Button><WhiteSpace />
                <WhiteSpace size="xl" />
                <div align="center" ><Link to = "/login" >返回登录</Link></div>
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

export default connect(mapStateToProps)(createForm()(SignUp));