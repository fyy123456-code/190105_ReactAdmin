import React, { Component } from 'react';
import { Button, Card, Icon, message, Table, Modal, Form, Input } from 'antd';
import {connect} from 'react-redux';
import {createSaveCategoryAction} from '../../redux/action_creators/category_action'
import { reqCategoryList, reqAddCategory, reqUpdateCategory } from '../../api/index';
import { PAGE_SIZE } from '../../config/index';

const { Item } = Form;

@connect(
  state => ({}),
  {
    saveCategory: createSaveCategoryAction
  }
)
@Form.create()
class Category extends Component {

  state = {
    categoryList: [], //商品分类列表
    visible: false,  //控制模态框是否显示
    operType: '' ,//控制是新增还是修改
    isLoading:true,
    modalCurrentValue:'',
    modalCurrentId:''
  }

  getCategoryList = async () => {
    let result = await reqCategoryList();
    this.setState({isLoading:false});
    const { status, data, msg } = result;
    if (status === 0) {
      this.setState({ categoryList: data.reverse() })
      //保存分类信息到redux
      this.props.saveCategory(data);
    } else {
      message.error(msg, 1);
    }
  }

  //显示新增分类
  showAdd = () => {
    this.setState({
      operType: 'add',
      modalCurrentValue:'',
      modalCurrentId:'',
      visible: true,
    });
  };

  //显示修改分类
  showUpdate = (item) => {
    const {_id, name} = item;
    this.setState({
      modalCurrentValue:name,
      modalCurrentId:_id,
      operType: 'update',
      visible: true,
    });
  };

  toAdd = async(values) => {
    let result = await reqAddCategory(values);
    
    const {status, data, msg} = result;
    if(status === 0){
      message.success('添加成功')
      let categoryList = [...this.state.categoryList];
      categoryList.unshift(data);
      this.setState({categoryList});
      this.setState({visible: false}); // 隐藏模态框
      this.props.form.resetFields();//重置表单
    }else{
      message.error(msg, 1)
    }
    
  }

  toUpdate = async(categoryObj) =>{
    const result = await reqUpdateCategory(categoryObj);
    const {status, msg} = result;
    if(status === 0){
      message.success('更新成功');
      this.getCategoryList();
      this.props.form.resetFields();
      this.setState({visible:false})
    }else{
      message.error(msg, 1);
    }
  }

  handleOk = () => {
    const {operType} = this.state
    this.props.form.validateFields(async(err, values) => {
      if (err) {
        message.error('表单输入有误，请检查', 1);
        return;
      }
      if(operType === 'add') this.toAdd(values);
      if(operType === 'update'){
        const categoryId = this.state.modalCurrentId;
        const categoryName = values.categoryName
        const categoryObj = {categoryId, categoryName};
        this.toUpdate(categoryObj);
      }
     
      
      
      
    })

  };

  handleCancel = () => {
    this.props.form.resetFields()
    this.setState({
      visible: false,
    });
  };


  componentDidMount() {
    this.getCategoryList()
  }

  render() {
    const { visible, operType } = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
        width: '75%',
      },
      {
        title: '操作',
        align: 'center',
        key:'age',
        render: (item) => {
          return (
            <Button onClick={()=>{this.showUpdate(item)}} type='link'>修改分类</Button>
          )
        }
      }
    ];
    return (
      <div>
        <Card
          extra={
            <Button type='primary' onClick={this.showAdd}>
              <Icon type='plus' />
              添加
            </Button>
          }
        >
          <Table
            dataSource={this.state.categoryList}
            rowKey='_id'
            columns={columns}
            bordered
            pagination={{ pageSize: PAGE_SIZE, showQuickJumper:true }}
            loading={this.state.isLoading}
          />
        </Card>
        <Modal
          title={operType === 'add' ? '新增分类' : '修改分类'}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText='确定'
          cancelText='取消'
        >
          <p>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Item>
                {getFieldDecorator('categoryName', {
                  initialValue:this.state.modalCurrentValue,
                  rules: [
                    { required: true, message: '分类名称不能为空!' },
                  ],
                })(
                  <Input
                    placeholder="请输入分类名称"
                  />
                )}
              </Item>
            </Form>
          </p>
        </Modal>
      </div>
    )
  }
}
export default Category;
