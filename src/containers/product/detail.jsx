import React, { Component } from 'react';
import { Button, Card, Icon, List, message } from 'antd';
import { connect } from 'react-redux';
import {reqProdById, reqCategoryList} from '../../api/index';
import {BASE_URL} from '../../config/index'
import './detail.less';

const { Item } = List;

@connect(
  state => ({ 
    productList: state.productList,
    categoryList: state.categoryList 
  }),
  {}
)
class Detail extends Component {

  state = {
    categoryId: '',
    categoryName:'',
    desc: '',
    imgs: [],
    price: '',
    detail: '',
    name: '',
    isLoading:true
  }

  getProdById = async(id) => {
    const result = await reqProdById(id);
    const {status, data, msg} = result;
    if(status === 0) {
      this.categoryId = data.categoryId;
      this.setState({...data})
    }
    else  message.error(msg, 1);
  }

  getCategory = async() => {
    let result = await reqCategoryList();
    const {status, data, msg} = result;
    if(status === 0){
     let result = data.find((item)=>{
        return item._id === this.categoryId
      })
      if(result) this.setState({categoryName:result.name, isLoading:false})
    }else{
      message.error(msg, 1);
    }
  }


  componentDidMount() {
    const reduxProdList = this.props.productList;
    const reduxCateList = this.props.categoryList;
    const id = this.props.match.params.id;
    if (reduxProdList.length) {
      let result = reduxProdList.find((item) => item._id === id);
      if (result){
        this.categoryId = result.categoryId;
        this.setState({...result})
      } 
    }else{
      this.getProdById(id)
    }

    if(reduxCateList.length){
      let result = reduxCateList.find((item)=> item._id === this.categoryId);
      if(result) this.setState({categoryName:result.name, isLoading:false})
    }else{
      this.getCategory()
    }

  }
  render() {
    return (
      <Card 
        loading={true} 
        title={
        <div className='left-top'>
          <Button type='link' size='small' onClick={() => { this.props.history.goBack() }}>
            <Icon type='arrow-left' style={{ fontSize: 20 }} />
          </Button>
          <span>商品详情</span>
        </div>
        }
      >
        <List>
          <Item>
            <span className='prod-name'>商品名称：</span>
            <span>{this.state.name}</span>
          </Item>
          <Item>
            <span className='prod-name'>商品描述：</span>
            <span>{this.state.desc}</span>
          </Item>
          <Item>
            <span className='prod-name'>商品价格：</span>
            <span>{this.state.price}</span>
          </Item>
          <Item>
            <span className='prod-name'>所属分类：</span>
            <span>{this.state.categoryName}</span>
          </Item>
          <Item>
            <span className='prod-name'>商品图片：</span>
            <span>
              {
                this.state.imgs.map((item, index) => {
                  return (
                    <img key={index} src={`${BASE_URL}/upload/` + item} alt="商品图片" />
                  )
                })
              }
            </span>
          </Item>
          <Item>
            <span className='prod-name'>商品详情：</span>
            <span dangerouslySetInnerHTML={{ __html: this.state.detail }}></span>
          </Item>
        </List>
      </Card>

    )
  }
}
export default Detail;
