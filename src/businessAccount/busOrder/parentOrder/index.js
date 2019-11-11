import React from "react";
import { Popover } from "antd";
import { Link } from "react-router-dom";
import "./index.scss";
import api from "../../../component/api";
import prompt from './../../../component/prompt'
import Item from "antd/lib/list/Item";

export default class parentOrder extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            fid : '',
            parentDate : '',    // 父订单所有数据
            invoice_info : [], // 发票信息
            address_info : [], // 收货人信息
            order_list : [], // 订单列表

        }
    }

    render(){
        
        
        
        const {invoice_info,parentDate,address_info,order_list,fid} = this.state
        // console.log(invoice_info.invoice_type);
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
                                 parentDate.parent_state == '0'? <img src={require('./../../../image/newsubmit.png')} alt='' />
                                :parentDate.parent_state == '1'? <img src={require('./../../../image/newdaifukuan.png')} alt='' />
                                :parentDate.parent_state == '2'? <img src={require('./../../../image/newdaifahuo.png')} alt='' />
                                :parentDate.parent_state == '3'? <img src={require('./../../../image/newyifahuo.png')} alt='' />
                                :parentDate.parent_state == '4'? <img src={require('./../../../image/newyiwancheng.png')} alt='' />
                                :parentDate.parent_state == '-1'?<img src={require('./../../../image/newyiquxiao.png')} alt='' />
                                :parentDate.parent_state == '-2'?<img src={require('./../../../image/newyiguanbi.png')} alt='' />
                                :parentDate.parent_state == '-3'?<img src={require('./../../../image/newyibohui.png')} alt=''/>
                                :''
                            }
                            <div className='ft16'>
                                {
                                    parentDate.parent_state ==  '0'?'待提交'
                                    :parentDate.parent_state == '1'?'待付款'
                                    :parentDate.parent_state == '2'?'待发货'
                                    :parentDate.parent_state == '3'?'已发货'
                                    :parentDate.parent_state == '4'?'已完成'
                                    :parentDate.parent_state == '-1'?'已取消'
                                    :parentDate.parent_state == '-2'?'已关闭'
                                    :parentDate.parent_state == '-3'?'已驳回'
                                    :''
                                }
                            </div>
                        </div>
                        <div className='parentOrder-number'>
                            <div>父订单编号</div>
                            <div>{fid}</div>
                        </div>
                        <div className='parentOrder-number'>
                            <div>下单时间</div>
                            <div>{parentDate.create_time}</div>
                        </div>
                    </div>
                    <div className='parentOrder-container-content'>
                        {
                            parentDate.parent_state == '-2' || parentDate.parent_state == '-3' ?
                            <div className ="ParentOrder-dismiss-reason">
                                <div>{parentDate.parent_state == '-3' ?'驳回原因':'关闭原因'}</div>
                                <div>{parentDate.close_reason}</div>
                            </div>
                            :''
                        }
                        
                        <div className='ft14'>商品信息</div>
                        <div className='ParentOrder-container-header'>
                            <div>商品信息</div>
                            <div>单价</div>
                            <div>数量</div>
                            <div>小计</div>
                            <div>操作</div>
                        </div>
                        {
                            order_list && order_list.map((item,index)=>(
                                <div className='parentOrder-product-box' key={index}>
                                    {/* 头部 */}
                                    <div className='parentOrder-product-title'>
                                        <div className='parentOrder-product-title-left'>
                                            <div className='ml15'>
                                                <span>下单时间：</span>
                                                <span>{item.create_time}</span>
                                            </div>
                                            <div>
                                                <span>订单编号：</span>
                                                <span>{item.sub_order_num}</span>
                                            </div>
                                            <div>
                                                <span>供应商名称：</span>
                                                <span>{item.merchant_name}</span>
                                            </div>
                                        </div>
                                        <div className='parentOrder-product-title-right'>
                                            {
                                                item.sub_state  == '0'?'待提交'
                                                :item.sub_state == '1'?'待付款'
                                                :item.sub_state == '2'?'待发货'
                                                :item.sub_state == '3'?'已发货'
                                                :item.sub_state == '4'?'已完成'
                                                :item.sub_state == '-1'?'已取消'
                                                :item.sub_state == '-2'?'已关闭'
                                                :item.sub_state == '-3'?'已驳回'
                                                :item.sub_state == '-101'?'删除'
                                                :''
                                            }
                                        </div>
                                    </div>
                                    {/* 内容 */}
                                    <div className='parentOrder-product-content'>
                                        <div className='parentOrder-product-content-details'>
                                            <div>
                                                
                                                <img src={item.type == 'jd' ? item.pic : prompt.imgUrl(item.merchant_id,item.product_id)} alt="" className='parentOrder-product-content-img'/>
                                            </div>
                                            <div>
                                                <div className='ft12 color66 mr14'>
                                                    {
                                                        item.type == 'jd' ? <Link to={`/AdminJDdetails?${item.product_id}`} target="_blank">{item.product_name.length>35?item.product_name.substring(0,35)+'...':item.product_name}</Link>
                                                        : <Link to={`/Admindetails?${item.product_id}+${item.sku}`} target="_blank">{item.product_name.length>35?item.product_name.substring(0,35)+'...':item.product_name}</Link>
                                                    }
                                                    
                                                </div>
                                                <div className='ft12 color89 mt15 mr14'>
                                                    <span className='mr20'>{item.product_standards}</span>
                                                    {/* <span>颜色：黑色</span> */}
                                                </div>
                                                {/* <div className='ft12 color89'>型号：1235446RT</div> */}
                                            </div>
                                        </div>
                                        <div className='width188 width150'>￥{item.price}</div>
                                        <div className='width188 width120'>{item.count}{item.unit ? `/${item.unit}` : ""}</div>
                                        <div className='width188 width150'>
                                            <div className='red'>￥{item.order_price}</div>
                                            <div>(含运费：￥{item.freight})</div>
                                        </div>
                                        <div className='width188 width141'><Link to={`/BusinessAccount/SonOrder?${item.sub_order_num}`}>订单详情</Link></div>
                                    </div>
                                    {/* 尾部 */}
                                    <div className='parentOrder-product-footer'>
                                        <span>备注：</span>
                                        <span>{item.remark}</span>
                                    </div>
                                </div>
                            ))
                        }
                       

                        <div className='parentOrder-container-info'>
                            <div className='parentOrder-info-consignee'>
                                <div className='ft14 mb20'>收货信息</div>
                                <p>收 货 人 : {address_info.consignee}</p>
                                <p>联系方式 : {address_info.phone}</p>
                                <p>收货地址 : {address_info.address}</p>
                            </div>
                            <div className='parentOrder-info-consignee'>
                                <div className='ft14 mb20'>支付方式</div>
                                <p>
                                    支付方式：{parentDate.pay_type =='0' ? '账期支付':''}
                                </p>
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
                                商品件数：<span>{parentDate.total_count}件</span>
                            </div>
                            <div>
                                商品总价：<span>￥{parentDate.total_order_price}</span>
                            </div>
                            <div>
                                运费：
                                <span>￥{parentDate.total_freight}</span>
                            </div>
                            <div>
                                应付总额：
                                <span className='ft18'>￥{parentDate.total_price}</span>
                            </div>
                            
                        </div>
                    </div>

                   
                    
                                     
                        
                        
             
            </div>
        )
    }
    componentDidMount(){
        const fid = this.props.location.search.split('?')[1]
        this.setState({
            fid
        },()=>{this.getParent()})
    }

    // 获取父订单详情
    getParent = e =>{
        const data = {
            id : this.state.fid
        }
        api.axiosPost('parentOrderDetails',data).then((res)=>{
            if(res.data.code === 1){
                this.setState({
                    invoice_info : res.data.data.invoice_info,
                    address_info : res.data.data.address_info,
                    order_list : res.data.data.order_list,
                    parentDate : res.data.data
                })
            }
        })
    }
                            
}