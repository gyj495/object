import React,{Component} from 'react'

import {Redirect} from 'react-router-dom'

import {
  Form, Icon, Input, Button, message
} from 'antd'

import './login.less'

import  logo from '../../assets/images/logo.png'

import {reqLogin} from "../../api";

import memoryUtils from "../../utils/memoryUtils"

import storageUtils from "../../utils/storageUtils"

const Item=Form.Item


//登录
class Login extends Component {

  handleSubmit=(event)=>{
    //得到form对象
    // const form=this.props.form
    //获取表单项的输入数据
    // const values=form.getFieldsValue()
    // console.log('handleSubmit()',values)


    //阻止事件的默认行为
    event.preventDefault()
    //对所有表单字段进行校验
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // console.log('提交登录的ajax请求 ', values);

      //  请求登录
        const {username,password}=values
        const result=await reqLogin(username,password)

        if (result.status===0) { // 登陆成功
          // 提示登陆成功
          message.success('登陆成功')

          //保存user数据
          const user=result.data
          //保存在内存中
          memoryUtils.user=user
          //保存在local中
          storageUtils.saveUser(user)

          // 跳转到管理界面 (不需要再回退回到登陆)
          this.props.history.replace('/')

        } else { // 登陆失败
          // 提示错误信息
          message.error(result.msg)
        }
      }else{
        console.log('检验失败')
      }
    });
  }

  //自定义密码验证
  validatePwd=(rule,value,callback)=>{
    console.log('validatePwd()',rule,value)
    if(!value){
      callback('密码必须输入')
    }else if(value.length<4){
      callback('密码长度不得小于四位')
    }else if(value.length>12){
      callback('密码长度不得大于12位')
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('密码规定为字母数字，下划线')
    }else{
      callback()  //没有问题  验证通过
    }
    // callback('xxx')  // 验证失败，并制定提示的文本
  }

  render(){

    //如果用户已经登录，自动跳转到管理界面
    const user=memoryUtils.user
    if(user&&user._id){
      return <Redirect to='/'/>
    }


    //得到具有强大功能的form对象
    const form =this.props.form
      const {getFieldDecorator}=form

    return (
      <div className='login'>

        <header className='login-header'>
          <img src={logo} alt="logo"/>
          <h1>React项目：后台管理系统</h1>
        </header>

        <section className='login-content'>

          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
          <Item>
            {
              getFieldDecorator('username',{
                rules: [
                  {required: true,whitespace:true, message: '请输入用户名!' },
                  {min:4,message:'不得小于四位'},
                  {max:12 ,message:'不得大于12位'},
                  {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名需要是字母数字、下划线'},
              ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )
            }
          </Item>
          <Item>
            {
              getFieldDecorator('password',{
                rules:[{
                  validator:this.validatePwd
                }]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />
              )
            }
          </Item>
          <Item>
          <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
          </Item>
          </Form>
        </section>
      </div>
    )
  }
}

const WrapLogin=Form.create()(Login)
export  default WrapLogin



//前台表单验证

