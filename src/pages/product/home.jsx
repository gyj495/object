
//product默认子路由组件

import React, {Component} from 'react'

import {
  Card,
  Select,
  Input,
  Button,
  Icon,
  Table,
  message
} from 'antd'

import LinkButton from '../../components/Link-button'

import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'

import {PAGE_SIZE} from "../../utils/constants";


const Option =Select.Option

export default class ProductHome extends Component {

  state={
    loading:false,  //是否正在加载中
    total:0,    //商品的总数量
    products:[], //商品的数组
    searchName:'',  //搜索的关键字
    searchType:'productName'   //根据哪个字段搜索  默认是按名称搜索
  }

  //初始化列的数组
  initColumns=()=>{
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
       // 括号里接收数据对象
       render:(price)=>'￥'+price    //当前指定了对应属性  传入的是对应属性的值
      },
      {
        width:100,
        title: '状态',
        // dataIndex: 'status',
        // 括号里接收数据对象
        render:(product)=>{
          const {status,_id}=product
          const newStatus= status===1?2:1
          return(
            <span>
              {/*必须包一个函数  要不然并不是点击的时候调用*/}
              <Button
                type='primary'

                onClick={()=>this.updateStatus(_id,newStatus)}
              >
                {status===1?'下架':'上架'}
              </Button>
              <span>{status===1?'在售':'已下架'}</span>
            </span>
          )
        }
      },
      {
        width:100,
        title: '操作',
        render:(product)=>{
          return (
            <span>
              {/*将produc对象使用state传递给目标路由组件*/}
            <LinkButton
                onClick={()=>this.props.history.push('/product/detail',{product})}>详情
              </LinkButton>
              <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ];
  }

  //获取指定页码的列表数据显示
  getProducts=async (pageNum)=>{

    this.pageNum=pageNum   //保存pageNum, 让其他方法可以看到

    this.setState({loading:true})    //发送请求之前显示loading

    const {searchName,searchType}=this.state

    //如果搜索关键字有值。说明要做搜索分页
    let result
    if(searchName){
      result=await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
    }else{//一般分页
      result=await reqProducts(pageNum,PAGE_SIZE)
    }


    this.setState({loading:false})   //请求结束之后隐藏loading
    if(result.status===0){
      //取出分页数据，更新状态，显示分页列表
      const {total,list}=result.data
      this.setState({
        total,
        products:list
      })
    }
  }

  //更新指定商品的状态
  updateStatus=async (productId,status)=>{
    const result=await reqUpdateStatus(productId,status)
    if(result.status===0){
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getProducts(1)
  }

  render() {

    //取出状态数据
    const {products,total,loading,searchName,searchType}=this.state

    const title=(
      <span>
        <Select
          value={searchType}
          style={{width:120}}
          onChange={value => this.setState({searchType:value})}
        >
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width:120 ,margin:'0 20px'}}
          value={searchName}
          onChange={event => this.setState({searchName:event.target.value})}
        />
        <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
    </span>
    )

    const extra=(
      <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate')}>
        <Icon type='plus'/>
        添加商品
      </Button>
    )


    return (
      // extra  额外信息  显示在右侧    title   显示在左侧
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            current:this.pageNum,
            total,
            defaultPageSize:PAGE_SIZE,
            showQuickJumper:true,
            onChange:this.getProducts
          }}
        />;

      </Card>
    )
  }
}
