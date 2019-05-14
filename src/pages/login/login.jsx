import React,{Component} from 'react'

import {
  Form,Icon,Input,Button
}from 'antd'

import './login.less'

import  logo from './images/logo.png'

const Item=Form.Item

//登录

class Login extends Component {



  handleSubmit=(event)=>{
    const form=this.props.form
    const values=form.getFieldsValue()
    console.log('handleSubmit()',values)
    event.preventDefault()
  }

  render(){

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
                rules: [{ required: true, message: '请输入用户名!' }
                ,{min:4,message:'不得小于四位'},
                  {max:12 ,message:'不得大于12位'}
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
              getFieldDecorator('password',{})(
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

//valiadataPwd=(rule,value,callback)=>{
// callback()  没有问题  验证通过
// callback('xxx')   验证失败，并制定提示的文本

//前台表单验证

