
//商品路由

import React, {Component} from 'react'

import {Switch,Route,Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'

export default class Product extends Component {

  render() {
    return (
      <Switch>
        <Route path='/product' component={ProductHome} exact/>{/*路径完全匹配*/}
        <Route path='/product/addupdate' component={ProductAddUpdate}/>
        <Route path='/product/detail' component={ProductDetail}/>
        <Redirect to='/product'/>
      </Switch>
    )
  }
}



//受控组件和非受控组件
//变量的名字作为属性名 需要加中括号
//对象里的属性没有先后顺序