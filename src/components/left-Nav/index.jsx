import React, {Component} from 'react'

import {Link,withRouter} from 'react-router-dom'

import logo from "../../assets/images/logo.png"

import menuList from '../../config/menuConfig'

import { Menu, Icon } from 'antd';

import './index.less'

const SubMenu = Menu.SubMenu;

//左侧导航组件

class LeftNav extends Component{

  //根据menu的数据数组生成对应的标签数组
  //使用map+递归
  getMenuNodes_map=(menuList)=>{
    return menuList.map(item=>{
      if(!item.children){
        return (
          <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
        )
      }else{
        return (
          <SubMenu
          key={item.key}
          title={
            <span>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </span>
          }
        >
        {this.getMenuNodes(item.children)}
        </SubMenu>
        )
      }
    })
  }

  //使用reduce+递归
  getMenuNodes=(menuList)=>{
    //得到当前请求的路径
    const path=this.props.location.pathname

    return menuList.reduce((pre,item)=>{
      if(!item.children){
        pre.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      }else{
        //查找一个与当前路径匹配的子item
        const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0)
        if(cItem){
          this.openKey=item.key
        }

        pre.push((
          <SubMenu
            key={item.key}
            title={
              <span>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        ))
      }
      return pre
    },[])
  }

  componentWillMount() {
    this.menuNodes=this.getMenuNodes(menuList)
  }

  render(){


    //得到当前请求的路径
    let path=this.props.location.pathname

    //匹配下标
    if(path.indexOf('/product')===0){ //  说明当前匹配的是商品或者商品的子路由
      path='/product'

    }

    // 得到需要打开菜单项的key
    const openKey = this.openKey



    return (
        <div className='left-nav'>
          <Link  to='/' className="left-nav-header">
            <img src={logo} alt=""/>
            <h1>硅谷后台</h1>
        </Link>

        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >


          {/*<Menu.Item key="./home">*/}
          {/*  <Link to='./home'>*/}
          {/*    <Icon type="pie-chart" />*/}
          {/*    <span>首页</span>*/}
          {/*  </Link>*/}
          {/*</Menu.Item>*/}
          {/*<SubMenu*/}
          {/*  key="sub1"*/}
          {/*  title={*/}
          {/*    <span>*/}
          {/*      <Icon type="mail" />*/}
          {/*      <span>商品</span>*/}
          {/*    </span>*/}
          {/*  }*/}
          {/*>*/}
          {/*  <Menu.Item key="/category">*/}
          {/*    <Link to='/category'>*/}
          {/*      <Icon type="mail" />*/}
          {/*      <span>品类管理</span>*/}
          {/*    </Link>*/}
          {/*  </Menu.Item>*/}
          {/*  <Menu.Item key="/product">*/}
          {/*    <Link to='/product'>*/}
          {/*      <Icon type="mail" />*/}
          {/*      <span>商品管理</span>*/}
          {/*    </Link>*/}
          {/*  </Menu.Item>*/}
          {/*</SubMenu>*/}

          {/*获取menu所有子节点*/}
          {this.menuNodes}

        </Menu>
      </div>

    )
  }
}

//withRouter高阶组件
export default withRouter(LeftNav)


