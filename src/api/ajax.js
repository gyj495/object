import axios from 'axios'

import {message} from "antd";


// ajax(url,data={},type)   利用形参默认值
export default function ajax(url,data={},type='GET') {

  //必须有return
  return new Promise((resolve,reject)=>{

    let promise

    //执行异步ajax请求
    if(type==='GET'){   //发送get请求
      promise= axios.get(url,{  //配置对象
        params:data       //指定请求参数
      })
    }else{       //发送post请求
      promise= axios.post(url,data)
    }

     //  如果请求成功了
    promise.then(response=>{
      resolve(response.data)
    //  请求失败了  不调用reject（reason） 提示异常信息
    }).catch(error=>{
      //reject(error)
      message.error('请求出错了:'+error.message)
    })

  })

}


