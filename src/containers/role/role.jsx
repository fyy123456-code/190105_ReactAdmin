import React, { Component } from 'react';
import { Card, Button, Icon, Table, message, Modal, Form, Input, Tree } from 'antd';
import {connect} from 'react-redux';
import { reqAddRole, reqAuthRole, reqUserList } from '../../api/index'
import dayjs from 'dayjs';
import menuList from '../../config/menu_config';

const { Item } = Form;
const { TreeNode } = Tree;

@connect(
  state => ({username: state.userInfo.user.username})
)
@Form.create()
class Role extends Component {

  state = {
    isShowAdd: false,
    isShowAuth: false,
    roleList: [],
    menuList,
    checkedKeys: [],  //要选中的菜单 
    _id:''
  }

  handleOk = () => {
    this.props.form.validateFields(async (err, values) => {
      if (err) return;
      let result = await reqAddRole(values);
      // console.log(values);
      const { status, data, msg } = result;
      // console.log(data);
      if (status === 0) {
        message.success('新增角色成功');
        this.getRoleList()
        this.setState({ isShowAdd: false });

      } else {
        message.error(msg, 1)
      }
    })
  }

  handleCancel = () => {
    this.setState({ isShowAdd: false })
  }

  handleAuthOk = async() => {
    const {_id, checkedKeys} = this.state;
    const {username} = this.props;
    // console.log({_id, menus:checkedKeys, auth_name:username});
    let result =await reqAuthRole({_id, menus:checkedKeys, auth_name:username});
    const {status, data, msg} = result;
    if(status === 0){
      message.success('授权成功', 1);
      this.setState({isShowAuth: false});
      this.getRoleList()
    }else{
      message.error(msg, 1);
    }
  }

  handleAuthCancel = () => {
    this.setState({ isShowAuth: false })
  }

  getRoleList = async () => {
    let result = await reqUserList();
    console.log(result);
    const { status, data, msg } = result;
    console.log(data.list);
    if (status === 0) {
      this.setState({ roleList: data.roles })
    }
  }

  showAuth = (id)=>{
    this.setState({ isShowAuth: true, _id:id });
    let result = this.state.roleList.find((item)=>{
     return item._id === id
    });
    if(result){
      this.setState({checkedKeys: result.menus})
    }
  }

  showAdd =()=>{
    this.props.form.resetFields();
    this.setState({ isShowAdd: true });

  }

  componentDidMount() {
    this.getRoleList()
  }

  //------------tree start---------

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };


  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

  //------------tree end---------------

  render() {

    const dataSource = this.state.roleList;
    // const dataSource = [
    //   {
    //     "menus": [
    //       "role",
    //       "home",
    //       "category"
    //     ],
    //     "_id": "5ca9eaa1b49ef916541160d3",
    //     "name": "测试",
    //     "create_time": 1554639521749,
    //     "auth_time": 1558679920395,
    //     "auth_name": "test007"
    //   },
    // ]

    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: time => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        key: 'auth_time',
        render: time => time ? dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss') : ''
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        key: 'auth_name'
      },
      {
        title: '操作',
        key: 'option',
        render: (item) => <Button type='link' onClick={() => { this.showAuth(item._id) }}>设置权限</Button>
      }

    ]

    const treeData = this.state.menuList;

    return (
      <div>
        <Card
          title={
            <Button type='primary' onClick={() => {this.showAdd() }}>
              <Icon type='plus' />
              新增角色
            </Button>
          }
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey='_id'
          />
        </Card>
        <Modal
          title="新增角色"
          visible={this.state.isShowAdd}
          okText='确定'
          cancelText='取消'
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleOk}>
            <Item>
              {
                getFieldDecorator('roleName', {
                  initialValue: '',
                  rules: [{
                    required: true, message: '角色名必须输入'
                  }]
                })(<Input placeholder='请输入角色名称' />)
              }
            </Item>
          </Form>
        </Modal>
        <Modal
          title="设置权限"
          visible={this.state.isShowAuth}
          okText='确定'
          cancelText='取消'
          onOk={this.handleAuthOk}
          onCancel={this.handleAuthCancel}
        >
          <Tree
            checkable
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            defaultExpandAll  //打开所有节点
          >
            <TreeNode title='平台功能' key='top'>
              {this.renderTreeNodes(treeData)}
            </TreeNode>
          </Tree>

        </Modal>
      </div>

    )
  }
}

export default Role;
