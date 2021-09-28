import React, { Component } from 'react';
import { Button, Card, Icon, List } from 'antd';
import { connect } from 'react-redux';
import {reqProdById} from '../../api/index'
import './detail.less';

const { Item } = List;

@connect(
  state => ({ productList: state.productList }),
  {}
)
class Detail extends Component {

  state = {
    categoryId: '',
    desc: '',
    imgs: [],
    price: '',
    detail: '',
    name: ''
  }

  getProdById = (id) => {
    const result = reqProdById(id);
    const {status, data} = result;
    if(status === 0){
      const {categoryId, desc, imgs, price, detail, name} = data;
      this.setState({categoryId, desc, imgs, price, detail, name});
    }
  }


  componentDidMount() {
    const reduxProdList = this.props.productList;
    const id = this.props.match.params.id;
    if (reduxProdList.length !== 0) {
      let result = reduxProdList.find((item) => {
        return item._id === id
      })
      if (result) {
        const { categoryId, desc, imgs, price, detail, name } = result;
        this.setState({ categoryId, desc, imgs, price, detail, name })
      }
    }else{
      this.getProdById(id)
    }

  }
  render() {
    return (
      <Card title={
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
            <span>{this.state.categoryId}</span>
          </Item>
          <Item>
            <span className='prod-name'>商品图片：</span>
            <span>
              {
                this.state.imgs.map((item, index) => {
                  return (
                    <img key={index} src={`/upload/` + item} alt="商品图片" />
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
