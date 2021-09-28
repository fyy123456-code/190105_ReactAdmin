import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import {Icon, Button, Modal} from 'antd';
import screenfull from 'screenfull';
import {connect} from 'react-redux';
import dayjs from 'dayjs';
// import {reqWeather} from '../../../api/index'；
import menuList from '../../../config/menu_config';
import {createDeleteUserInfoAction} from '../../../redux/action_creators/login_action'
import './header.less';

const { confirm } = Modal;


@connect(
  state => ({
    userInfo: state.userInfo,
    title:state.title
  }),
  {deleteUser: createDeleteUserInfoAction}
)
@withRouter
class Header extends Component {

  state={
    isFull:false,
    date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
    weather:{},
    title:''
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

    //展示菜单标题
    this.getTitle()
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

  getTitle = () => {
    const {pathname} = this.props.location;
    let pathKey = pathname.split('/').reverse()[0];
    if(pathname.indexOf('product') !== -1) pathKey='product';
    let title='';
    menuList.forEach((item)=>{
      if(item.children instanceof Array){
       let tmp = item.children.find((citem)=>{
          return citem.key === pathKey
        })
        if(tmp) title = tmp.title
      }else{
        if(item.key === pathKey) title = item.title;
      }
    })
    this.setState({title})
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
          <div className='header-bottom-left'>{this.props.title || this.state.title}</div>
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