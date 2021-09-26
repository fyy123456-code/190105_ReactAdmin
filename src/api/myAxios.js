import axios from 'axios';
import qs from 'querystring';
import { message } from 'antd';
import NProgress from 'nprogress';
import store from '../redux/store';
import {createDeleteUserInfoAction} from '../redux/action_creators/login_action'
import 'nprogress/nprogress.css'

const instance = axios.create({
  timeout: 4000
});

//请求拦截器
instance.interceptors.request.use((config) => {
  console.log(config);
  NProgress.start();
  //从redux中获取之前所保存的token
  const { token } = store.getState().userInfo;
  //向请求头中添加token,用于校验身份
  if (token) config.headers.Authorization = 'atguigu_' + token;
  const { method, data } = config;
  console.log(data);
  //若是post请求
  if (method.toLocaleLowerCase() === 'post') {
    //若传递过来的参数是对象
    if (data instanceof Object) {
      config.data = qs.stringify(data)
    }
  }
  return config;
});

//响应拦截器
instance.interceptors.response.use(
  (response) => {
    //请求若成功，走这里
    NProgress.done()
    return response.data;
  },
  (error) => {
    //请求若失败，走这里
    NProgress.done()
    if(error.response.status === 401){
      message.error('身份校验失败，请重新登录', 1);
      //分发一个删除用户信息的action
      store.dispatch(createDeleteUserInfoAction())
    }else{
      message.error(error.message, 1);
    }
    
    return new Promise(() => { })
  }
)

export default instance;