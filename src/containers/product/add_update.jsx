import React, { Component } from 'react';
import { Button, Card, Form, Select, Icon, Input, message } from 'antd';
import { connect } from 'react-redux';
import { reqCategoryList, reqAddProduct, reqProdById, reqUpdateProduct } from '../../api';
import PicturesWall from './pictures_wall';
import RichTextEditor from './rich_text_editor';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const { Item } = Form;
const { Option } = Select;

@connect(
  state => ({
    categoryList: state.categoryList,
    productList: state.productList
  }),
  {}
)
@Form.create()
class AddUpdate extends Component {
  state = {
    categoryList: [],
    operaType: 'add',
    categoryId: '',
    name: '',
    desc: '',
    price: '',
    imgs: [],
    detail: '',
    _id: ''
  }

  getCategoryList = async () => {
    let result = await reqCategoryList();
    const { status, data, msg } = result;
    if (status === 0) {
      this.setState({ categoryList: data })
    } else {
      message.error(msg, 1)
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {operaType,_id} = this.state;
    const imgs = this.refs.picturesWall.getImgArr();
    const detail = this.refs.richTextEditor.getRichText();
    this.props.form.validateFields(async (err, values) => {
      if (err) return
      let result;
      if(operaType === 'add'){
        result = await reqAddProduct({ ...values, imgs, detail });
      }else{
        result = await reqUpdateProduct({ ...values, imgs, detail, _id });
      }
      const { status, data, msg } = result;
      if (status === 0) {
        message.success('操作商品成功');
        this.props.history.replace('/admin/prod_about/product')
      } else {
        message.error(msg, 1);
      }
    })
  }

  getProductList = async (id) => {
    let result = await reqProdById(id);
    const { status, data, msg } = result;
    if (status === 0) {
      this.setState({ ...data });
      this.refs.picturesWall.setFileList(data.imgs);
      this.refs.richTextEditor.setRichText(data.detail)
    }
  }

  componentDidMount() {
    const { categoryList, productList } = this.props;
    const { id } = this.props.match.params;
    if (categoryList.length) this.setState({ categoryList })
    else this.getCategoryList();
    if (id) {
      this.setState({ operaType: 'update' });
      if (productList.length) {
        let result = productList.find(item => item._id === id);
        if (result) {
          this.setState({ ...result });
          this.refs.picturesWall.setFileList(result.imgs);
          this.refs.richTextEditor.setRichText(result.detail)
        }
      } else {
        // 请求服务器
        this.getProductList(id)
      }
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { operaType } = this.state;

    //控制左右表单比例
    const formItemLayout = {
      labelCol: { md: 2 },
      wrapperCol: { md: 7 }
    }
    return (
      <Card
        title={
          <div>
            <Button type='link' onClick={() => { this.props.history.goBack() }}>
              <Icon type='arrow-left' />
              <span>返回</span>
            </Button>
            <span>{operaType === 'update' ? '修改商品' : '添加商品'}</span>
          </div>
        }
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Item label='商品名称'>
            {
              getFieldDecorator('name', {
                initialValue: this.state.name || '',
                rules: [
                  { required: true, message: '商品名称不能为空' }
                ]
              })(<Input placeholder='商品名称' />)
            }
          </Item>
          <Item label='商品描述'>
            {
              getFieldDecorator('desc', {
                initialValue: this.state.desc || '',
                rules: [
                  { required: true, message: '商品描述不能为空' }
                ]
              })(<Input placeholder='商品描述' />)
            }
          </Item>
          <Item label='商品价格'>
            {
              getFieldDecorator('price', {
                initialValue: this.state.price || '',
                rules: [{ required: true, message: '商品价格不能为空' }]
              })(<Input type='number' addonAfter='元' prefix='¥' placeholder='商品价格' />)
            }
          </Item>
          <Item label='商品分类'>
            {
              getFieldDecorator('categoryId', {
                initialValue: this.state.categoryId || '',
                rules: [{ required: true, message: '请选择一个分类' }]
              })(
                <Select>
                  <Option value=''>请选择分类</Option>
                  {
                    this.state.categoryList.map((item) => {
                      return (
                        <Option key={item._id} value={item._id}>{item.name}</Option>
                      )
                    })
                  }
                </Select>
              )
            }
          </Item>
          <Item label='商品图片' wrapperCol={{ md: 12 }}>
            <PicturesWall ref='picturesWall' />
          </Item>
          <Item label='商品详情' wrapperCol={{ md: 16 }}>
            <RichTextEditor ref='richTextEditor' />
          </Item>
          <Button type='primary' htmlType='submit'>提交</Button>
        </Form>
      </Card>

    )
  }
}

export default AddUpdate;
