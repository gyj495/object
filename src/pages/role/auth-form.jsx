import React, {PureComponent} from 'react'

import PropTypes from 'prop-types'

import {
  Form,
  Input,
  Tree
} from 'antd'

import menuList from '../../config/menuConfig'

const {TreeNode}=Tree

const Item = Form.Item

/*
添加分类的form组件
//  */
export default class AuthForm extends PureComponent {

  static propTypes={
    role:PropTypes.object
  }

  state={
    //具体的值根据role里面的muens
    checkedKeys:[]
  }

  constructor(props){
    super(props)

    //根据传入角色的menus生成初始状态
    const {menus}=this.props.role
    this.state={
      checkedKeys:menus
    }
  }

  //为父组件提交获取最新menus数据的方法
  getMenus=()=>this.state.checkedKeys

  getTreeNodes=(menuList)=>{
    return menuList.reduce((pre,item)=>{
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children?this.getTreeNodes(item.children):null}
        </TreeNode>)
      return pre
    },[])
  }

  //选中某个node时的回调
  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  componentWillMount() {
    this.treeNodes=this.getTreeNodes(menuList)
  }

  //根据新传入的role来更新checkedKeys状态
  //当组件接收到新的属性时自动调用
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps()',nextProps)
    const menus=nextProps.role.menus
    this.setState({
      checkedKeys:menus
    })

    //在事件回调函数里面不能这样写
    this.state.checkedKeys=menus
  }


  render() {
    console.log('AuthForm render()')

    const {role}=this.props

    const {checkedKeys}=this.state

    const formItemLayout={
      labelCol:{span:4},  //左侧label的宽度
      wrapperCol:{span:15}  //指定右侧包裹的宽度
    }

    return (
      <div>

        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled/>
        </Item>

        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}

          </TreeNode>
        </Tree>

      </div>
    )
  }
}
