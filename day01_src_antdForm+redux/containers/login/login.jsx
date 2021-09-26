import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import {connect} from 'react-redux';
import {createDemo1Action, createDemo2Action} from '../../redux/action_creators/test_action'
import './css/login.less';
import logo from './imgs/logo.png';

const { Item } = Form;

class Login extends Component {
  componentDidMount(){
    console.log(this.props);
  }

  //点击登录的回调
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields((err, value)=>{
      if(!err){
        // alert('向服务器发送请求')
        this.props.demo2('888')
      }
    })
  }

  pwdValidator = (rule, value, callback)=>{
    if(!value){
      callback('密码不能为空')
    }else if(value.length>12){
      callback('密码必须小于等于12位')
    }else if(value.length<4){
      callback('密码必须大于等于4位')
    }else if(!(/^\w+$/).test(value)){
      callback('密码必须是字母、下划线、数字组成')
    }else{
      callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='login'>
        <header>
          <img src={logo} alt="logo" />
          <h1>商品管理系统{this.props.test}</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: '用户名不能为空!' },
                  { min: 4, message: '用户名必须大于等于4位' },
                  { max: 12, message: '用户名必须小于等于12位' },
                  { pattern: /^\w+$/, message: '用户名必须是字母、下划线、数字组成' }
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />
              )}
            </Item>
            <Item>
              {getFieldDecorator('password', {
                rules: [
                  { validator: this.pwdValidator },
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />
              )}

            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}

export default connect(
  state=>({test:state.test}),
  {
    demo1: createDemo1Action,
    demo2: createDemo2Action
  }
)(Form.create()(Login))
