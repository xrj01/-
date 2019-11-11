import React from "react";
import { Popover,Steps} from "antd";
import api from './../../../component/api'
import prompt from './../../../component/prompt'
import { Link } from "react-router-dom";
import "./index.scss";
import { red } from "ansi-colors";

export default class parentOrder extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            current: 0,
            sonID : '',
            sonDate : '',    // 父订单所有数据
            invoice_info : [], // 发票信息
            address_info : [], // 收货人信息
            order_info : {}, // 订单列表
            product_name:''
        }
    }
    
    render(){
        const {invoice_info,sonDate,address_info,order_info,sonID,current,product_name} = this.state
        // 步骤条
        const { Step } = Steps;
        const steps = [
            {
                title: (<div className='parentOrder-steps-title'>提交订单</div>),
                description:(<div className='parentOrder-steps-activeTitle'>
                                {sonDate.create_time}
                            </div>),
                icon : (<img src={require('./../../../image/newtijiaodingdan1.png')} alt=''/>),
                iconActive : (<img src={require('./../../../image/newtijiaodingdan.png')} alt=''/>)
            },
            {
                title: (<div className='parentOrder-steps-title'>提交审批</div>),
                description:(<div className='parentOrder-steps-activeTitle'>
                                {sonDate.wait_approval_time}
                            </div>),
                icon : (<img src={require('./../../../image/newtijiaoshenpi1.png')} alt=''/>),
                iconActive : (<img src={require('./../../../image/newtijiaoshenpi.png')} alt=''/>)
            },
            {
                title: (<div className='parentOrder-steps-title'>付款成功</div>),
                description:(<div className='parentOrder-steps-activeTitle'>
                                {sonDate.pay_time}
                            </div>),
                icon : (<img src={require('./../../../image/newfukuanchenggong1.png')} alt=''/>),
                iconActive : (<img src={require('./../../../image/newfukuanchenggong.png')} alt=''/>)
            },
            {
                title: (<div className='parentOrder-steps-title'>商品出库</div>),
                description:(<div className='parentOrder-steps-activeTitle'>
                                {sonDate.delivery_time}
                            </div>),
                icon : (<img src={require('./../../../image/newshangpingchuku1.png')} alt=''/>),
                iconActive : (<img src={require('./../../../image/newshangpingchuku.png')} alt=''/>)
            },
            {
                title: (<div className='parentOrder-steps-title'>收货</div>),
                description:(<div className='parentOrder-steps-activeTitle'>
                                {sonDate.complete_time}
                            </div>),
                icon : (<img src={require('./../../../image/newshouhuo1.png')} alt=''/>),
                iconActive : (<img src={require('./../../../image/newshouhuo.png')} alt=''/>)
            },
            {
                title: (<div className='parentOrder-steps-title'>交易完成</div>),
                description:(<div className='parentOrder-steps-activeTitle'>
                                {sonDate.complete_time}
                            </div>),
                icon : (<img src={require('./../../../image/newjiaoyiwancheng1.png')} alt=''/>),
                iconActive : (<img src={require('./../../../image/newjiaoyiwancheng.png')} alt=''/>)
            },
        ];
          

        // 气泡框
        const content = (
            <div style={{fontSize:'12px',color:'#666',width:'329px'}}>
              <p>开户银行：{invoice_info.bank}</p>
              <p>注册地址：{invoice_info.register_address}</p>
              <p>公司电话：{invoice_info.register_tel}</p>
              <p>收票信息：{invoice_info.taker_name} {invoice_info.taker_tel} {invoice_info.taker_address}  </p>
            </div>
            
                                    
        );
        
        return(
            <div className='parentOrder-box'>
                    <div className='parentOrder-container-title'>
                        <div className='mr105 parentOrder-container-title-img'>
                            {
                                sonDate.sub_state ==  '0'? <img src={require('./../../../image/newsubmit.png')} alt='' />
                                :sonDate.sub_state == '1'? <img src={require('./../../../image/newdaifukuan.png')} alt='' />
                                :sonDate.sub_state == '2'? <img src={require('./../../../image/newdaifahuo.png')} alt='' />
                                :sonDate.sub_state == '3'? <img src={require('./../../../image/newyifahuo.png')} alt='' />
                                :sonDate.sub_state == '4'? <img src={require('./../../../image/newyiwancheng.png')} alt='' />
                                :sonDate.sub_state == '-1'?<img src={require('./../../../image/newyiquxiao.png')} alt='' />
                                :sonDate.sub_state == '-2'?<img src={require('./../../../image/newyiguanbi.png')} alt='' />
                                :sonDate.sub_state == '-3'?<img src={require('./../../../image/newyibohui.png')} alt='' />
                                :sonDate.sub_state == '-101'?<img src={require('./../../../image/newyishanchu.png')} alt='' />
                                :''
                            }
                           
                            <div className='ft16 width48'>
                                {
                                    sonDate.sub_state ==  '0'?'待提交'
                                    :sonDate.sub_state == '1'?'待付款'
                                    :sonDate.sub_state == '2'?'待发货'
                                    :sonDate.sub_state == '3'?'已发货'
                                    :sonDate.sub_state == '4'?'已完成'
                                    :sonDate.sub_state == '-1'?'已取消'
                                    :sonDate.sub_state == '-2'?'已关闭'
                                    :sonDate.sub_state == '-3'?'已驳回'
                                    :sonDate.sub_state == '-101'?'删除'
                                    :''
                                }
                            </div>
                        </div>
                        <div className='parentOrder-number'>
                            <div>订单编号</div>
                            <div>{sonDate.sub_order_num}</div>
                        </div>
                        <div className='parentOrder-number width200'>
                            <div>下单时间</div>
                            <div>{sonDate.create_time}</div>
                        </div>
                        <div className='parentOrder-number'>
                            <Link to={`/BusinessAccount/ParentOrder?${sonDate.parent_order_num}`}>关联父订单</Link>
                            <Link to={`/BusinessAccount/ParentOrder?${sonDate.parent_order_num}`} className='color22'>{sonDate.parent_order_num}</Link>
                        </div>
                    </div>
                    <div className='parentOrder-container-content pt40'>
                        {/* 步骤条 */}
                        {
                            sonDate.sub_state == -1 || sonDate.sub_state == -2 || sonDate.sub_state == -3 || sonDate.sub_state == -101 ? '' :
                            
                            <div>
                                <Steps current={current} labelPlacement='vertical' className='parentOrder-container-steps'>
                                    {steps.map((item,index) => (
                                        <Step 
                                        key={item.title} 
                                        title={item.title} 
                                        description={current - index >=1 || current == index ? item.description : ''} 
                                        icon={current - index >=1 || current == index ? item.iconActive : item.icon}
                                        />
                                    ))}
                                </Steps>
                            </div>
                            
                        }
                        {
                            sonDate.sub_state == '-2' || sonDate.sub_state == '-3' ?
                            <div className ="ParentOrder-dismiss-reason">
                                <div>{sonDate.sub_state == -3 ?'驳回原因':'关闭原因'}</div>
                                <div>{sonDate.close_reason}</div>
                            </div>
                            :''
                        }
                        <div className='ft14'>商品信息</div>
                        <div className='sonOrder-container-header'>
                            <div>商品信息</div>
                            <div>单价</div>
                            <div>数量</div>
                            <div>小计</div>
                        </div>
                        <div className='parentOrder-product-box'>
                            {/* 头部 */}
                            <div className='parentOrder-product-title'>
                                <div className='parentOrder-product-title-left'>
                                    {/* <div className='ml15'>
                                        <span>下单时间：</span>
                                        <span>{sonDate.create_time}</span>
                                    </div>
                                    <div>
                                        <span>订单编号：</span>
                                        <span>{sonDate.sub_order_num}</span>
                                    </div> */}
                                    <div className='ml15'>
                                        <span>供应商名称：</span>
                                        <span>{order_info.merchant_name}</span>
                                    </div>
                                </div>
                                <div className='parentOrder-product-title-right'>
                                    {
                                        sonDate.sub_state ==  '0'?'待提交'
                                        :sonDate.sub_state == '1'?'待付款'
                                        :sonDate.sub_state == '2'?'待发货'
                                        :sonDate.sub_state == '3'?'已发货'
                                        :sonDate.sub_state == '4'?'已完成'
                                        :sonDate.sub_state == '-1'?'已取消'
                                        :sonDate.sub_state == '-2'?'已关闭'
                                        :sonDate.sub_state == '-3'?'已驳回'
                                        :''
                                    }
                                </div>
                            </div>
                            {/* 内容 */}
                            <div className='parentOrder-product-content'>
                                <div className='parentOrder-product-content-details'>
                                    <div>
                                        <div>

                                            <img src={order_info.type == 'jd' ? order_info.pic : prompt.imgUrl(order_info.merchant_id,order_info.product_id)} alt="" className='parentOrder-product-content-img'/>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='ft12 color66 mr14'>
                                            {
                                                order_info.type == 'jd' ? <Link to={`/AdminJDdetails?${order_info.product_id}`} target="_blank">{product_name}</Link>
                                                : <Link to={`/Admindetails?${order_info.product_id}+${order_info.sku}`} target="_blank">{product_name}</Link>
                                            }
                                        </div>
                                        <div className='ft12 color89 mt15'>
                                            {/* <span className='mr20'>商品编码：Z0043N</span>
                                            <span>颜色：黑色</span> */}
                                            <span className='mr20'>{order_info.product_standards}</span>
                                        </div>
                                       {/*  <div className='ft12 color89'>型号：1235446RT</div> */}
                                    </div>
                                </div>
                                <div className='width188'>￥{order_info.price}</div>
                                <div className='width188'>{order_info.count}{order_info.unit ? `/${order_info.unit}` : ""}</div>
                                <div className='width188'>
                                    <div className='red'>￥{order_info.order_price}</div>
                                    <div>(含运费：￥{order_info.freight})</div>
                                </div>
                            </div>
                            {/* 尾部 */}
                            <div className='parentOrder-product-footer'>
                                <span>备注：</span>
                                <span>{sonDate.order_remark}</span>
                            </div>
                        </div>

                        <div className='parentOrder-container-info'>
                            <div className='parentOrder-info-consignee'>
                                <div className='ft14 mb20'>收货信息</div>
                                <p>收 货 人 : {address_info.consignee}</p>
                                <p>联系方式 : {address_info.phone}</p>
                                <p>收货地址 : {address_info.address}</p>
                            </div>
                            <div className='parentOrder-info-consignee'>
                                <div className='ft14 mb20'>支付方式</div>
                                <p>支付方式：{sonDate.pay_type == '0'?'账期支付':''}</p>
                            </div>
                            <div className='parentOrder-info-invoice'>
                                <div className='ft14 mb20'>发票信息</div>
                                <p>
                                    发票类型：{
                                                invoice_info && invoice_info.invoice_type || invoice_info.invoice_type == 0 ? invoice_info.invoice_type == '0' ?"普通发票" : "增值税发票" : "集中开票"

                                             }
                                </p>
                                {
                                    invoice_info && invoice_info.invoice_type != undefined &&
                                    <p>企业名称：{invoice_info.company}</p>
                                }
                                {
                                    invoice_info && invoice_info.invoice_type != undefined &&
                                    <p>对公账户：{invoice_info.bank_account}</p>
                                }
                                {
                                    invoice_info && invoice_info.invoice_type != undefined &&
                                    <p>纳税人识别号：{invoice_info.taxpayer_identification_code}</p>
                                }
                                {
                                    invoice_info && invoice_info.invoice_type != undefined &&
                                    <Popover placement="bottomLeft" content={content} trigger="click">
                                        <p className='blue'>更多</p>
                                    </Popover>
                                }
                                
                            </div>
                        </div>

                        <div className='parentOrder-container-payment'>
                            <div>
                                商品件数：<span>{order_info.count}件</span>
                            </div>
                            <div>
                                商品总价：<span>￥{order_info.order_price}</span>
                            </div>
                            <div>
                                运费：
                                <span>￥{order_info.freight}</span>
                            </div>
                            <div>
                                应付总额：
                                <span className='ft18'>￥{sonDate.total_price}</span>
                            </div>
                            
                        </div>
                    </div>
            </div>
        )
    }
    componentDidMount(){
        this.setState({
            sonID : this.props.location.search.split('?')[1]
        },()=>{this.getSonList()})
    }

    // 获取子订单列表
    getSonList = e =>{
        const data = {
            id : this.state.sonID
        }
        api.axiosPost('subOrderDetails',data).then((res)=>{
            if(res.data.code === 1){

                let name = res.data.data.order_info.product_name
                name = name.length>35 ? name.substring(0,35)+'...' : name
                //console.log(name);
                this.setState({
                    invoice_info : res.data.data.invoice_info,
                    address_info : res.data.data.address_info,
                    order_info : res.data.data.order_info,
                    sonDate : res.data.data,
                    product_name : name,
                    current : res.data.data.sub_state == '0' ? 0 :
                              res.data.data.sub_state == '1' ? 1 :
                              res.data.data.sub_state == '2' ? 2 :
                              res.data.data.sub_state == '3' ? 3 :
                              res.data.data.sub_state == '4' ? 5 : ''
                })
            }
        })
    }
                            
}