import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import {Icon, Button, Modal} from 'antd';
import screenfull from 'screenfull';
import {connect} from 'react-redux';
import dayjs from 'dayjs';
// import {reqWeather} from '../../../api/index'
import {createDeleteUserInfoAction} from '../../../redux/action_creators/login_action'
import './header.less';

const { confirm } = Modal;


@connect(
  state => ({userInfo: state.userInfo}),
  {deleteUser: createDeleteUserInfoAction}
)
@withRouter
class Header extends Component {

  state={
    isFull:false,
    date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
    weather:{}
  }

  fullScreen = () => {
    screenfull.toggle();
  }

  // getWeather = async ()=>{
  //   const result = await reqWeather();
  //   this.setState({weather:result})
  // }

  componentDidMount(){
    //给screenfull绑定监听
    screenfull.on('change', ()=>{
      let isFull = !this.state.isFull;
      this.setState({isFull});
    });

   this.timerID = setInterval(()=>{
      this.setState({date: dayjs().format('YYYY年 MM月DD日 HH:mm:ss')})
    }, 1000);

    // this.getWeather()
  }

  componentWillUnmount(){
    clearInterval(this.timerID)
  }

  //点击退出登录的回调
  logOut = () => {
    confirm({
      title: '确定退出吗?',
      content: '退出后需要重新登录',
      okText:'确定',
      cancelText:'取消',
      onOk: ()=>{
        this.props.deleteUser();
      },
    });
  
    
  }

  render() {
    const {isFull} = this.state;
    const {user} = this.props.userInfo
    return (
      <header className='header'>
        <div className='header-top'>
          <Button size='small' onClick={this.fullScreen}>
            <Icon type={isFull ? "fullscreen-exit" : "fullscreen"} />
          </Button>
          <span className='username'>欢迎，{user.username}</span>
          <Button type='link' onClick={this.logOut}>退出登录</Button>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{this.props.location.pathname}</div>
          <div className='header-bottom-right'>
            {this.state.date}
            <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="天气信息" />
              晴&nbsp;&nbsp; 温度: 2～5
          </div>
        </div>
      </header>
    )
  }
}
export default Header;