import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom'
import { createSaveUserInfoAction } from '../../redux/action_creators/login_action';
import { reqLogin } from '../../api/index'
import './css/login.less';
import logo from '../../static/imgs/logo.png';

const { Item } = Form;

@Form.create()
@connect(
  state => ({isLogin: state.userInfo.isLogin}),
  {
    saveUserInfo: createSaveUserInfoAction,
  }
)
class Login extends Component {
  componentDidMount() {

  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      const { username, password } = values
      if (!err) {
        const result = await reqLogin(username, password);
        const { status, msg, data } = result;
        if (status === 0) {
          console.log(data);
          //1.服务器返回到user信息和token保存在redux管理
          this.props.saveUserInfo(data)
          //2.跳转到admin
          this.props.history.replace('/admin');
          
        } else {
          message.warning(msg,1)
        }
      } else {
        message.error('表单验证有误')
      }
    })
  }

  pwdValidator = (rule, value, callback) => {
    if (!value) {
      callback('密码不能为空')
    } else if (value.length > 12) {
      callback('密码必须小于等于12位')
    } else if (value.length < 4) {
      callback('密码必须大于等于4位')
    } else if (!(/^\w+$/).test(value)) {
      callback('密码必须是字母、下划线、数字组成')
    } else {
      callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {isLogin} = this.props;
    if(isLogin){
      return <Redirect to='/admin' />
    }
    return (
      <div className='login'>
        <header>
          <img src={logo} alt="logo" />
          <h1>商品管理后台</h1>
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


export default Login;

// export default connect(
//   state => ({isLogin: state.userInfo.isLogin}),
//   {
//     saveUserInfo: createSaveUserInfoAction,
//   }
// )(Form.create()(Login))
