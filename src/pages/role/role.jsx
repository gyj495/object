
//角色路由

import React, {Component} from 'react'

import {Card, Button, Table, Modal,message,} from "antd";
import {PAGE_SIZE} from "../../utils/constants";



import {reqRoles,reqAddRoles,reqUpdateRoles} from "../../api";
import AddForm from "./add-form";
import AuthForm from './auth-form'
import memoryUtils from "../../utils/memoryUtils";
import {formateDate}from '../../utils/dateUtils'
const {rowSelection}=Table


export default class Role extends Component {

  state={
    roles:[], //所有角色的数组  还是以前的数组，只是元素发生了改变
    role:{},  //选中的role
    isShowAdd:false ,  //是否显示添加界面
    isShowAuth:false,   //是否显示设置角色权限界面
  }

  constructor(props){
    super(props)
    this.auth=React.createRef()
  }

  //初始化列的函数
  initColumn=()=>{
    this.columns=[
      {
        title:'角色名称',
        dataIndex:'name'    //对应的数据name
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        render:formateDate
      },
      {
        title:'授权时间',
        dataIndex:'auth_time',
        render:(create_time)=>formateDate(create_time)
      },
      {
        title:'授权人',
        dataIndex:'auth_name'
      },
    ]
  }

  getRoles=async ()=>{
    const result=await reqRoles()
    if(result.status===0){
      const roles=result.data
      this.setState({
        roles
      })
    }
  }

  onRow=(role)=>{
    return{
      onClick:event=>{   //点击行
        console.log('row onClick()',role)
        this.setState({
          role
        })
      }
    }
  }

  //添加角色
  addRole=()=>{
  //  进行表单验证，只有通过了才向下处理
    this.form.validateFields(async (error,values)=>{
      if (!error){

      //  隐藏确认框
        this.setState({
          isShowAdd:false
        })

      //  收集输入的数据
        const {roleName}=values
        this.form.resetFields()

      //  请求添加
        const result=await reqAddRoles(roleName)
      //  根据结果提示更新列表显示
        if(result.status===0){
          message.success('添加角色成功')
          // this.getRoles()   //看不发请求能不能获得结果
          //新产生的角色
          const role=result.data
        //  更新roles状态
          //往一个数组类型的状态里面添加一个元素
          //取出这个数组状态   push进去   最后更新
          // const roles=this.state.roles
          //新产生了一个数组   往里面添加 不要直接更新状态 要产生一个新的去更新
          // const roles=[...this.state.roles]
          // roles.push(role)
          // this.setState({
          //   roles
          // })

          //更新roles状态  是基于原本状态数据更新
          this.setState(state=>({
            roles:[...state.roles]
          }))

        }else{
          message.error('添加角色失败')
        }
      }
    })

  }

  //更新角色
  updateRole=async ()=>{

    //  隐藏确认框
    this.setState({
      isShowAuth:false
    })

    const role=this.state.role
  //  得到最新的menus
    const menus=this.auth.current.getMenus()
    role.menus=menus
    role.auth_time=Date.now()
    role.auth_name=memoryUtils.user.username

  //  请求更新
    const result=await reqUpdateRoles(role)
    if(result.status===0){
      message.success('设置角色权限成功')
      //更新显示
      // this.getRoles()
      this.setState({
        roles:[...this.state.roles]
      })

    }
  }

  componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getRoles()
  }

  render() {

    const {roles,role,isShowAdd,isShowAuth}=this.state

    // 选择功能的配置
    // const rowSelection = {
    //   type: 'radio',
    //   selectedRowKeys: [role._id],
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log('onChange()', selectedRowKeys, selectedRows)
    //     this.setState({
    //       role: selectedRows[0]
    //     })
    //   }
    // }

    const title=(
      <span>
       <Button type='primary' onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>  &nbsp;&nbsp;
        <Button type='primary' disabled={!role._id}  onClick={()=>this.setState({isShowAuth:true})}>设计角色权限</Button>
    </span>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE}}
          rowSelection={{
            type:'radio',
            selectedRowKeys:[role._id],
            onSelect:(role)=>{    //选择某个radio时候回调
              this.setState({
                role
              })
            }
          }}
          onRow={this.onRow}

          // rowSelection={rowSelection}
          // pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper: true}}

        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={()=>{
            this.setState({isShowAdd:false})
            this.form.resetFields()
          }}
        >
          <AddForm
            setForm={(form) => {this.form = form}}
          />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={()=>{
            this.setState({isShowAuth:false})
          }}
        >
          <AuthForm ref={this.auth} role={role}/>
        </Modal>


      </Card>
    )
  }
}



/*
*设计一个state状态叫checkkeys   需要有一个checkedKey数组
* 需要写一个constructor   取出role里的menus
* 从父组件获取子组件的消息 用ref
* 多层   redius   递归
*/
