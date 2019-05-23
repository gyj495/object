// 应用根组件

import React,{Component} from 'react'

// import {Button,message} from "antd";

import {BrowserRouter,Route,Switch} from 'react-router-dom'

import Login from './pages/login/login'

import Admin from './pages/admin/admin'

export default class App extends Component{
  render(){
    //有嵌套的标签  用小括号  switch
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}

