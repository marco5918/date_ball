import React from 'react'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, message } from 'antd'
import {signUpApi} from './../api/sign-up'

const FormItem = Form.Item
const Option = Select.Option

class SignUPClass extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      passwordDirty: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getFormValues = this.getFormValues.bind(this);
    this.handlePasswrodBlur = this.handlePasswrodBlur.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.checkConfirm = this.checkConfirm.bind(this);
  }

  async handleSubmit(e){
    e.preventDefault()
    let values = await this.getFormValues()

    if(values){
      let result = await signUpApi(values)
      if( result && result.success === true){
        message.success('注册成功！')
        setTimeout(function(){
            window.location.href = '/admin?signUpSuccess=true'
        },3000);
        
      }else if( result && result.message){
        message.error(result.message)
      }
    }else{
      message.error('系统繁忙, 稍后再试！')
    }
  }

  getFormValues(){
    let that = this
    return new Promise((resolve, reject) => {
      that.props.form.validateFieldsAndScroll((err, values) =>{
        if(!err){
          resolve(values)
        }else{
          reject(false)
        }
      })
    })
  }

  handlePasswrodBlur(e){
    const value = e.target.value
    this.setState({passwordDirty: this.state.passwordDirty || !!value})
  }

  checkPassword(rule, value, callback){
    const form = this.props.form
    if(value && value !== form.getFieldValue('password')){
      callback('两次密码输入不一致，请检查！')
    }else{
      callback()
    }
  }

  checkConfirm(rule, value, callback){
    const form = this.props.form
    if(value && this.state.passwordDirty){
      form.validateFields(['confirm'],{force: true})
    }
    callback()
  }

  render(){
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6},
      wrapperCol: { span: 14},
    }
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6,
      },
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
        {...formItemLayout}
        label={(
          <span>用户名
              <Tooltip title="必须是小写6-16位字母或数字或下划线，不能数字开头">
                <Icon type="question-circle-o" />
              </Tooltip>
          </span>
        )}
        hasFeedback
        >
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入您的用户名'}],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="E-mail地址"
          hasFeedback
          >
          {getFieldDecorator('email',{
            rules: [{
              type: 'email', message:'请您输入正确格式的邮箱地址',
            },{
              required:true, message:'请您输入邮箱地址！',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密码"
          hasFeedback
          >
            {getFieldDecorator('password',{
              rules:[{
                required: true, message:'请您输入您的账号密码！',
              },{
                validator:this.checkConfirm,
              }],
            })(
              <Input type="password" onBlur={this.handlePasswrodBlur} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认密码"
            hasFeedback
            >
              {getFieldDecorator('confirmPassword',{
                rules:[{
                  required:true, message:'请您再次输入账号密码进行确认！',
                },{
                  validator: this.checkPassword,
                }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
              {...tailFormItemLayout}
              style={{ marginBottom: 8}}>
                {getFieldDecorator('agreement',{
                  valuePropName: 'checked',
                })(
                  <Checkbox>我已阅读<a>《xxxxx协议》</a></Checkbox>
                )}
              </FormItem>
              <FormItem
                {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit" size="large">
                    确定
                  </Button>
                </FormItem>
      </Form>
    )
  }

}

const SignUpForm = Form.create()(SignUPClass)

export default SignUpForm
