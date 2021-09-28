import myAxios from './myAxios';
import { message } from 'antd'
import jsonp from 'jsonp';
import { BASE_URL, WEATHER_AK, CITY } from '../config'

// 登录请求
export const reqLogin = (username, password) => myAxios.post(`${BASE_URL}/login`, { username, password });

//获取商品列表请求
export const reqCategoryList = () => myAxios.get(`${BASE_URL}/manage/category/list`);

//新增商品分类
export const reqAddCategory = ({ categoryName }) => myAxios.post(`${BASE_URL}/manage/category/add`, { categoryName });

//更新一个商品分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => myAxios.post(`${BASE_URL}/manage/category/update`, { categoryId, categoryName });

//请求商品分页列表
export const reqProductList = (pageNum, pageSize) => myAxios.get(`${BASE_URL}/manage/product/list`, { params: { pageNum, pageSize } });

//请求更新商品状态
export const reqUpdateProdStatus = (productId, status) => myAxios.post(`${BASE_URL}/manage/product/updateStatus`, { productId, status });

//请求搜索商品
export const reqSearchProduct = (pageNum, pageSize, searchType, keyWord) => myAxios.get(`${BASE_URL}/manage/product/search`, { params: { pageNum, pageSize, [searchType]:keyWord } });

//根据ID获取商品信息
export const reqProdById = (productId)=> myAxios.get(`${BASE_URL}/manage/product/info`, { params: {productId}});

//请求删除图片 根据图片名删除图片
export const reqDeletePicture = (name) => myAxios.post(`${BASE_URL}/manage/img/delete`, {name});

//请求添加商品
export const reqAddProduct = (productObj) => myAxios.post(`${BASE_URL}/manage/product/add`, {...productObj});

// 请求更新商品
export const reqUpdateProduct = (productObj) => myAxios.post(`${BASE_URL}/manage/product/update`, {...productObj});


//请求天气信息
export const reqWeather = () => {
  return new Promise((resolve, reject) => {
    jsonp(`https://api.map.baidu.com/telematics/v3/weather?location=${CITY}&output=json&ak=${WEATHER_AK}`, (err, data) => {
      if (err) {
        message.error('请求天气接口失败，请联系管理员');
        return new Promise(() => { })
      } else {
        const { dayPictureUrl, temperature, weather } = data.result[0].weather_data[0];
        let weatherObj = { dayPictureUrl, temperature, weather }
        resolve(weatherObj)
      }
    })
  })

}