import React, { Component } from 'react';
import { Redirect, Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from 'antd';
// import { reqCategoryList } from '../../api/index'
import { createDeleteUserInfoAction } from '../../redux/action_creators/login_action';
import Header from './header/header';
import Home from '../../components/home/home';
import Category from '../category/category';
import Product from '../product/product';
import User from '../user/user';
import Role from '../role/role';
import Bar from '../bar/bar';
import Line from '../line/line';
import Pie from '../pie/pie';
import './css/admin.less'
const { Footer, Sider, Content } = Layout;


@connect(
  state => ({ userInfo: state.userInfo }),
  {
    deleteUserInfo: createDeleteUserInfoAction
  }
)
class Admin extends Component {
  componentDidMount() {
    console.log(this.props);
  }

  logOut = () => {
    this.props.deleteUserInfo();
  }

  // demo = async () => {
  //   let result = await reqCategoryList()
  //   console.log(result);
  // }

  //在render里，若想实现跳转，最好用Redirect
  render() {
    const { user, isLogin } = this.props.userInfo;
    if (!isLogin) {
      console.log('没有登录');
      return <Redirect to='/login' />
    } else {
      console.log('登录了');
      console.log(user);
      return (
        <Layout className='admin'>
          <Sider className='sider'>Sider</Sider>
          <Layout>
            <Header/>
            <Content className='content'>
              <Switch>
                <Route path='/admin/home' component={Home} />
                <Route path='/admin/prod_about/category' component={Category} />
                <Route path='/admin/prod_about/product' component={Product} />
                <Route path='/admin/user' component={User} />
                <Route path='/admin/role' component={Role} />
                <Route path='/admin/charts/bar' component={Bar} />
                <Route path='/admin/charts/line' component={Line} />
                <Route path='/admin/charts/pie' component={Pie} />
                <Redirect to='/admin/home'/>
              </Switch>
              
            </Content>
            <Footer className='footer'>推荐使用谷歌浏览器，可以获得更好的用户体验</Footer>
          </Layout>
        </Layout>

      )
    }

  }
}

export default Admin;

// export default connect(
//   state => ({ userInfo: state.userInfo }),
//   {
//     deleteUserInfo:createDeleteUserInfoAction
//   }
// )(Admin)
