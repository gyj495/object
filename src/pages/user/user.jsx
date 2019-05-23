
//用户路由

import React, {Component} from 'react'
import {Button,Card} from "antd";

export default class User extends Component {

  state={
    users:[]
}

  render() {

    const {users}=this.state
    const title=<Button>创建用户</Button>
    return (
      <Card title={title}>

      </Card>
    )
  }
}
