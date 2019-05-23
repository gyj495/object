import React, {Component} from 'react'

import {withRouter} from 'react-router-dom'

import { Modal} from 'antd';

import {formateDate} from "../../utils/dateUtils";

import memoryUtils from '../../utils/memoryUtils'

import storageUtils from '../../utils/storageUtils'

import menuList from '../../config/menuConfig'

import LinkButton from '../Link-button'

import {reqWeather} from '../../api'

import './index.less'


/*
头部组件
 */
class Header extends Component {

  state={
    currentTime:formateDate(Date.now()),//当前时间字符串
    dayPictureUrl:'',   //天气图片url
    weather:''          //天气的文本
  }

  getTime=()=>{
    //每隔一秒钟更新当前时间
    this.intervalId=setInterval(()=>{
      const currentTime=formateDate(Date.now())
      this.setState({currentTime})
    },1000)
  }

  getWeather=async ()=>{
    const {dayPictureUrl,weather}=await reqWeather('北京')
    this.setState({dayPictureUrl,weather})
  }

  getTitle=()=>{
    //得到当前请求路径
    const path=this.props.location.pathname
    let title
    menuList.forEach(item=>{
      if(item.key===path){   //如果当前item对象的key和path一样
        title=item.title     //item的title就是需要的title
      }else if(item.children){
        //在所有子item中查找匹配
        const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0)
        //如果有值说明有匹配的
        if(cItem){
          //取出title
          title=cItem.title
        }
      }
    })
    //返回该title
    return title

  }

  //退出指令
  logOut=()=>{
    Modal.confirm({
        title: '你确定退出登录吗',

        onOk:()=>{
          console.log('确定',this)

          //删除数据
          storageUtils.removeUser()
          memoryUtils.user={}

          //跳转到登录页面
          this.props.history.replace('/login')
        },
      });
    }


  //第一次render之后执行一次    在此执行异步操作，发ajax请求、启动定时器
  componentDidMount() {
    //获取当前时间
    this.getTime()
  //  获取当前天气显示
    this.getWeather()
  }

  // componentWillMount() {
  //   this.title=this.getTitle()
  // }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {

    const {currentTime,dayPictureUrl,weather}=this.state
    const username=memoryUtils.user.username

    const title=this.getTitle()
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logOut}>退出</LinkButton>
        </div>

        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </div>

        </div>
      </div>
    )
  }
}

//因为不是路由组件
export default withRouter(Header)