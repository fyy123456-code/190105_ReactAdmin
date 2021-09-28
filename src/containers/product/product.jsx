import React, { Component } from 'react';
import { Button, Card, Icon, Select, Input, Table, message } from 'antd';
import { connect } from 'react-redux'
import { reqProductList, reqUpdateProdStatus, reqSearchProduct } from '../../api/index';
import {createSaveProductAction} from '../../redux/action_creators/prod_action'
import { PAGE_SIZE } from '../../config/index';

const { Option } = Select


@connect(
  state => ({ productList: state.productList }),
  {
    saveProduct:createSaveProductAction
  }
)
class Product extends Component {

  state = {
    productList: [],  //商品列表数据
    total: '',
    current: 1,
    keyWord: '',
    searchType: 'productName'
  }

  getProductList = async (number = 1) => {
    let result;
    if (this.search) {
      const { keyWord, searchType } = this.state;
      result = await reqSearchProduct(number, PAGE_SIZE, searchType, keyWord);
    } else {
      result = await reqProductList(number, PAGE_SIZE);
    }
    const { status, data } = result;
    //console.log(data);
    if (status === 0) {
      this.setState({
        productList: data.list,
        total: data.total,
        current: data.pageNum
      })
      //保存初始化、搜索获取的商品列表到redux
      this.props.saveProduct(data.list)
    } else {
      message.error('获取商品列表失败');
    }
  }

  updateProdStatus = async ({ _id, status }) => {
    let productList = [...this.state.productList];
    if (status === 1) status = 2;
    else status = 1;
    const result = await reqUpdateProdStatus(_id, status);
    if (result.status === 0) {
      productList = productList.map((item) => {
        if (item._id === _id) {
          item.status = status;
        }
        return item;
      })
      this.setState({ productList })
      message.success('更新商品状态成功');
    } else {
      message.error('更新商品状态失败')
    }
  }

  search = async () => {
    this.search = true;
    this.getProductList()

  }


  componentDidMount() {
    this.getProductList()
  }
  render() {
    const dataSource = this.state.productList;
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width: '18%'
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        width: '9%',
        title: '商品价格',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        render: (price) => {
          return '¥' + price
        }
      },
      {
        width: '10%',
        title: '状态',
        // dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (item) => {
          const { status } = item;
          return (
            <div>
              <Button
                type={status === 1 ? 'danger' : 'primary'}
                onClick={() => { this.updateProdStatus(item) }}
              >
                {status === 1 ? '下架' : '上架'}
              </Button>
              <div>{status === 1 ? '在售' : '已停售'}</div>
            </div>
          )
        }
      },
      {
        title: '操作',
        width: '10%',
        //dataIndex: 'opera',
        key: 'opera',
        align: 'center',
        render: (item) => {
          return (
            <div>
              <Button type='link' onClick={() => { this.props.history.push(`/admin/prod_about/product/detail/${item._id}`) }}>详情</Button><br />
              <Button type='link' onClick={() => { this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`) }}>修改</Button>
            </div>
          )
        }
      },
    ];


    return (
      <Card
        title={
          <div>
            <Select defaultValue='productName' onChange={(value) => { this.setState({ searchType: value }) }}>
              <Option value='productName'>按名称搜索</Option>
              <Option value='productDesc'>按描述搜索</Option>
            </Select>
            <Input
              style={{ width: '20%', margin: '0 10px' }}
              allowClear
              placeholder='请输入搜索关键字'
              onChange={(event) => { this.setState({ keyWord: event.target.value }) }}
            />
            <Button type='primary' onClick={this.search}>
              <Icon type='search' />
              搜索
            </Button>
          </div>
        }
        extra={
          <Button type='primary' onClick={() => { this.props.history.push('/admin/prod_about/product/add_update') }}>
            <Icon type='plus-circle' />
            添加商品
          </Button>
        }
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          rowKey='_id'
          pagination={{
            total: this.state.total,
            pageSize: PAGE_SIZE,
            current: this.state.current,
            onChange: this.getProductList
          }}
        />
      </Card>
    )
  }
}
export default Product;
