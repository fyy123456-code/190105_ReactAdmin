import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSaveTitleAction } from '../../../redux/action_creators/menu_action'
import logo from '../../../static/imgs/logo.png';
import menuList from '../../../config/menu_config'
import './left_nav.less'

const { SubMenu, Item } = Menu;

@connect(
  state => ({
    menus: state.userInfo.user.role.menus,
    username: state.userInfo.user.username
  }),
  {
    saveTitle: createSaveTitleAction
  }
)
@withRouter
class LeftNav extends Component {

  hasAuth = (item) => {
    const { menus, username } = this.props;
    if (username === 'admin') {
      return true;
    } else if (!item.children) {
      return menus.find((item2) => { return item2 === item.key })
    } else if (item.children) {
     return item.children.some((item3)=>{return menus.indexOf(item3.key) !== -1})
    }
  }


  createMenu = (target) => {
    return target.map((item) => {
      if (this.hasAuth(item)) {
        if (!item.children) {
          return (
            <Item key={item.key} onClick={() => { this.props.saveTitle(item.title) }}>
              <Link to={item.path}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Item>
          )
        } else {
          return (
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.createMenu(item.children)}
            </SubMenu>
          )
        }
      }

    })
  }
  render() {
    return (
      <div>
        <header className='nav-header'>
          <img src={logo} alt="logo" />
          <h1>商品管理系统</h1>
        </header>
        <Menu
          selectedKeys={this.props.location.pathname.indexOf('product') !== -1 ? 'product' : this.props.location.pathname.split('/').reverse()[0]}
          defaultOpenKeys={this.props.location.pathname.split('/').splice(2)}
          mode="inline"
          theme="dark"
        >
          {
            this.createMenu(menuList)
          }
        </Menu>
      </div>

    )
  }
}
export default LeftNav;
