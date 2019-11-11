import React from "react";
import {Link} from "react-router-dom";
import api from "./../../component/api";
import {createHashHistory} from "history";
import {Icon, Button, message, Popover, Modal,Steps} from "antd";
import ApprovalModal from "./../myOrder/approvalModal";
import prompt from "../../component/prompt";
import "./index.scss";
const history = createHashHistory();
const { Step } = Steps;
export default class FatherOrdersDetails extends React.Component{
    constructor(props) {
        super(props);
        const order_id = window.location.hash.split("=")[1];
        this.state={
            orderList:[],
            order_id,
            time_limit:"",
            orderData:{},
            stepData:{},
            approvalModal:false,
            time:"03:00:00"
        }
    }

    componentDidMount() {
        this.getOrderInfo();
    }
    //获取订单详情
    getOrderInfo=()=>{
        const data={
            sub_order_id:this.state.order_id
        };
        api.axiosPost("sub_order_info",data).then((res)=>{
            // console.log(res)
            if(res.data.code == 1){
                this.setState({
                    orderData:res.data.data,
                    time_limit:res.data.data.order_info.time_limit
                },()=>{
                    this.orderSetInterval()
                })
            }else{
                message.error(res.data.msg)
            }
        })
    };
    orderSetInterval=()=>{
        let {time_limit} = this.state;
        if(!time_limit){return false};
        this.interval = setInterval(()=>{
            let date = new Date();
            let now = date.getTime();
            let endDate = new Date(Number(time_limit));//设置截止时间
            let end = endDate.getTime();
            // let leftTime = end - now; //时间差
            let leftTime = time_limit; //时间差
            let h, m, s,time;
            if(leftTime >= 0) {
                // d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                h = Math.floor(leftTime / 1000 / 60 / 60);
                m = Math.floor(leftTime / 1000 / 60 % 60);
                s = Math.floor(leftTime / 1000 % 60);
                if(s < 10) { s = "0" + s;  }
                if(m < 10) { m = "0" + m; }
                if(h < 10) { h = "0" + h; }
                time = `${h}:${m}:${s}`;
                time_limit -= 1000;
            } else {
                time = "已超时"
                this.getOrderInfo()
                clearInterval(this.interval);
                this.interval = undefined
            }
            this.setState({time,time_limit});
        },1000)

    };
    componentWillUnmount=()=>{
        clearInterval(this.interval);
        sessionStorage.removeItem('detailsSKU')
    };
    //获取审批流详情
    orderApprovalProcess=(parent_order_id)=>{
        const data={parent_order_id,type:1};
        api.axiosPost("order_approval_process",data).then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    stepData:res.data.data,
                    approvalModal:true
                });
            }else{
                message.error(res.data.msg)
            }
        })
    };
    //气泡提示
    renderPopover=(order_invoice_info)=>{
        return <div className='order-invoice-info-more'>
            <p>开户银行：{order_invoice_info && order_invoice_info.bank}</p>
            <p>注册地址：{order_invoice_info && order_invoice_info.register_address}</p>
            <p>公司电话：{order_invoice_info && order_invoice_info.register_tel}</p>
            <p>收票信息：
                {order_invoice_info && order_invoice_info.taker_name} &emsp;
                {order_invoice_info && order_invoice_info.taker_tel} &emsp;
                {order_invoice_info && order_invoice_info.taker_address} &emsp;
            </p>
        </div>
    };
    //取消订单
    cancel_order=()=>{
        const data={parent_order_id:this.state.order_id};
        const _this = this;
        Modal.confirm({
            title: '是否取消当前订单?',
            okText: '确定',
            cancelText: '再想想',
            okType: 'default',
            className : "confirm-order-modal cancel-modal",
            onOk() {
                api.axiosPost("cancel_order",data).then((res)=>{
                    if(res.data.code == 1){
                        message.success(res.data.msg);
                        _this.getOrderInfo();
                    }else{
                        message.error(res.data.msg);
                    }
                })
            }
        });
    };
    //隐藏弹出层
    isHideModal=(type,isTrue)=>{
        this.setState({
            [type]:isTrue
        })
    };
    //提醒发货
    remindDelivery=()=>{
        const data={
            sub_order_id:this.state.order_id
        };
        api.axiosPost("remind_delivery",data).then((res)=>{
            if(res.data.code == 1){
                message.success(res.data.msg)
            }else{
                message.error(res.data.msg)
            }
        });
    };
    //确认收货
    confirm_goods=()=>{
        const data={sub_order_id:this.state.order_id};
        const _this = this;
        Modal.confirm({
            title: '是否确认收货?',
            okText: '确认',
            cancelText: '取消',
            width: 440,
            centered: true,
            className : "confirm-order-modal",
            onOk() {
                api.axiosPost("confirm_goods",data).then((res)=>{
                    if(res.data.code == 1){
                        message.success(res.data.msg);
                        _this.getOrderInfo();
                    }else{
                        message.error(res.data.msg);
                    }
                })
            }
        });
    };
    //步骤条图标状态
    renderStepIcon=(index,type)=>{
        return(
            <div className='order-step-icon'>
                <img src={require(`./../../image/step${index}${type == 1 ? '' : '-1'}.png`)} alt=""/>
            </div>
        )
    };
    //查看附件
    fileLink=(item)=>{
        const data={
            file_name:item
        };
        api.axiosGet("getProductLookSign",data).then((res)=>{
            if(res.status == 200){
                window.open(res.data.url)
            }
        })
    };
    //步骤条说明
    renderStepDescription=(title,time)=>{
        return(
            <div className='order-step-title'>
                {/* <p style={{paddingLeft: title.length>2 ? "0" : "12px"}}>{title}</p> */}
                <p>{title}</p>
                {
                    time && <p className='font-time'>{time}</p>
                }
            </div>
        )
    };

    // 传递参数
    transmitParam = (param) => {
        sessionStorage.setItem('detailsSKU', param)
    }
    render(){
        const {orderData,order_id,approvalModal,stepData,time} = this.state;
        const order_address_info = orderData.order_address_info;  //地址信息
        const order_invoice_info = orderData.order_invoice_info;  //发票信息
        const order_info = orderData.order_info;  //订单信息
        const approvalData={
            display:approvalModal,
            stepData,
            isHideModal:this.isHideModal
        };
        let state = "待发货";
        switch (order_info && order_info.state) {
            case 0:
                state = "待提交";
                break;
            case 1:
                state = "待付款";
                break;
            case 2:
                state = "待发货";
                break;
            case 3:
                state = "待收货";
                break;
            case 4:
                state = "已完成";
                break;
            case -1:
                state = "已取消";
                break;
            case -2:
                state = "已关闭";
                break;
            case -4:
                state = "已驳回";
                break;
        }
        return(
            <div className='father-orders-details-warp'>
                <div className="father-order-head-box">
                    <div className="father-order-head">
                        { order_info && order_info.state == 0 &&
                        <div>
                            <em> </em>
                            <h3>待提交</h3>
                        </div>  }
                        {  order_info && order_info.state == 1 &&
                        <div>
                            <em className='payment'> </em>
                            <h3>待付款</h3>
                        </div>  }
                        { order_info && order_info.state == 2 &&
                        <div>
                            <em className='delivery'> </em>
                            <h3>待发货</h3>
                        </div>  }
                        { order_info && order_info.state == 3 &&
                        <div>
                            <em className='transport'> </em>
                            <h3>待收货</h3>
                        </div>  }
                        { order_info && order_info.state == 4 &&
                        <div className='deal'>
                            <em className='deal'> </em>
                            <h3>交易完成</h3>
                        </div>  }
                        { order_info && order_info.state == -1 &&
                        <div className='red'>
                            <em className='cancel'> </em>
                            <h3>已取消</h3>
                        </div>  }
                        { order_info && order_info.state == -3 &&
                        <div className='red'>
                            <em className='rejected'> </em>
                            <h3>已驳回</h3>
                        </div>  }
                        { order_info && order_info.state == -2 &&
                        <div className='red'>
                            <em className='down'> </em>
                            <h3>已关闭</h3>
                        </div>  }
                        <div>
                            <h6>订单编号</h6>
                            <p>{order_id}</p>
                        </div>
                        <div>
                            <h6>下单时间</h6>
                            <p>{order_info && order_info.create_time}</p>
                        </div>
                        {
                            order_info && (order_info.state == 1 || order_info.state == 0) &&
                            <div>
                                <h6>待付款截止</h6>
                                <p>
                                    <span>{time}</span>
                                </p>
                            </div>
                        }
                        <div style={{textAlign:"left"}} className='associated-box'>
                            <h6>关联父订单</h6>
                            <p><Link to={`/BuyerCenter/FatherOrdersDetails?order_id=${order_info && order_info.parent_order_id}`}>
                                {
                                    order_info && order_info.parent_order_id
                                }
                            </Link></p>
                        </div>
                        {
                            order_info && order_info.state == 1 &&
                            <div>
                                <Button onClick={()=>{this.orderApprovalProcess(order_info.parent_order_id)}}>审批流程</Button>
                            </div>
                        }
                        {
                            order_info && order_info.state == 2 &&
                            <div>
                                <Button onClick={this.remindDelivery}>提醒发货</Button>
                            </div>
                        }
                        {
                            order_info && order_info.state == 3 &&
                            <div>
                                <Button onClick={this.confirm_goods}>确认收货</Button>
                            </div>
                        }

                    </div>

                    {
                        order_info &&  (order_info.state == -2 || order_info.state == -3) &&
                        <div className="failure-why-box">
                            <h3>{order_info.state == -2 ? "关闭" : "驳回"}原因</h3>
                            <div className="failure-why-content">
                                { order_info.close_reason }
                            </div>
                        </div>
                    }
                </div>
                <div className="father-order-details-information">
                    <div className="child-step-box">
                        {
                            order_info && (order_info.state == 0 || order_info.state == 1 || order_info.state == 2 || order_info.state == 3 || order_info.state == 4) &&
                            <Steps>
                                <Step status={order_info && order_info.time_info["0"] ? "finish" : "wait"}
                                      description={this.renderStepDescription("提交订单",order_info && order_info.time_info["0"])}
                                      icon={this.renderStepIcon(1,order_info && order_info.time_info["0"] ? 1 : 0)} />
                                <Step status={order_info && order_info.time_info["1"] ? "finish" : "wait"}
                                      description={this.renderStepDescription("提交审批",order_info && order_info.time_info["1"])}
                                      icon={this.renderStepIcon(2,order_info && order_info.time_info["1"] ? 1 : 0)} />
                                <Step status={order_info && order_info.time_info["2"] ? "finish" : "wait"}
                                      description={this.renderStepDescription("付款成功",order_info && order_info.time_info["2"])}
                                      icon={this.renderStepIcon(3,order_info && order_info.time_info["2"] ? 1 : 0)} />
                                <Step status={order_info && order_info.time_info["3"] ? "finish" : "wait"}
                                      description={this.renderStepDescription("商品出库",order_info && order_info.time_info["3"])}
                                      icon={this.renderStepIcon(4,order_info && order_info.time_info["3"] ? 1 : 0)} />
                                <Step status={order_info && order_info.time_info["4"] ? "finish" : "wait"}
                                      description={this.renderStepDescription("收货",order_info && order_info.time_info["4"])}
                                      icon={this.renderStepIcon(5,order_info && order_info.time_info["4"] ? 1 : 0)} />
                                <Step status={order_info && order_info.time_info["4"] ? "finish" : "wait"}
                                      description={this.renderStepDescription("交易完成",order_info && order_info.time_info["4"])}
                                      icon={this.renderStepIcon(6,order_info && order_info.time_info["4"] ? 1 : 0)} />
                            </Steps>
                        }
                    </div>
                    <h3>商品信息</h3>
                    <div style={{textAlign:"left",marginBottom:10}}><span style={{color: '#333'}}>供应商名称：</span>{order_info && order_info.merchant_name}</div>
                    <div className="child-order-list">
                        {/* <div className="child-order-head">
                            <div style={{textAlign:"left"}}>供应商名称：{order_info && order_info.merchant_name}</div>
                        </div> */}
                         
                        <div className="common-title">
                            <ul>
                                <li className="w1">商品信息</li>
                                <li className="w2">单价</li>
                                <li className="w3">数量</li>
                                <li className="w4">小计</li>
                            </ul>
                        </div>
                        <div className="child-order-content">
                            <div>
                                <img src={order_info && order_info.type == "jd" ? order_info.pic : prompt.imgUrl(order_info && order_info.merchant_id,order_info && order_info.product_id)} alt=""/>
                                <div className="child-order-goods">
                                    <p title={order_info && order_info.product_name}>
                                        <Link 
                                            target='_blank'
                                            to={ order_info &&order_info.type == 'jd' ? `/JDgoodsDetails?${order_info &&order_info.product_id}` : `/GoodsDetails?${order_info &&order_info.product_id}`}
                                            onClick={()=>{ if(order_info.type !== 'jd'){this.transmitParam(order_info.sku)}}}
                                        >
                                            {order_info && order_info.product_name}
                                        </Link>
                                    </p>
                                    <p title={order_info && order_info.param}>{order_info && order_info.param}</p>
                                </div>
                            </div>
                            <div>
                                ￥{order_info && order_info.price}
                            </div>
                            <div>
                                {order_info && order_info.count}{order_info && order_info.unit ? `/${order_info.unit}` : ""}
                            </div>
                            <div>
                                ￥{order_info && order_info.order_price}
                            </div>
                        </div>
                        <div className='child-order-note'>
                            <span>备注：</span>
                            <p>{order_info && order_info.remark}</p>
                        </div>
                    </div>

                    <div className='father-order-details-address-information'>
                        <div className='father-order-address-box'>
                            <h2>收货信息</h2>
                            <div className='p'>
                                <span>收&nbsp;货&nbsp;人:</span>
                                <p>
                                    {order_address_info && order_address_info.consignee}
                                </p>
                            </div>
                            <div className='p'>
                                <span>联系方式:</span>
                                <p>
                                    {order_address_info && order_address_info.phone}
                                </p>
                            </div>
                            <div className='p'>
                                <span>收货地址:</span>
                                <p>
                                    {order_address_info && order_address_info.address_1}
                                    {order_address_info && order_address_info.address_2}
                                    {order_address_info && order_address_info.address_3}
                                    {order_address_info && order_address_info.address_info}
                                </p>
                            </div>
                        </div>
                        <div className='father-order-address-box'>
                            <h2>支付信息</h2>
                            <div className='p'>
                                <span>支付方式:</span>
                                <p>账期支付</p>
                            </div>
                        </div>
                        <div className='father-order-address-box'>
                            <h2>发票信息</h2>
                            <div className='p'>
                                <span>发票类型：</span>
                                <p>
                                    {
                                        order_invoice_info &&
                                        (order_invoice_info.invoice_type || order_invoice_info.invoice_type==0) ? order_invoice_info.invoice_type == 0 ? "普通发票" : "增值税发票" : "集中开票"
                                    }
                                </p>
                            </div>
                            {
                                order_invoice_info && order_invoice_info.invoice_type != undefined &&
                                <div className='p'>
                                    <span>企业名称：</span>
                                    <p> { order_invoice_info && order_invoice_info.company} </p>
                                </div>
                            }
                            {
                                order_invoice_info && order_invoice_info.invoice_type != undefined &&
                                <div className='p'>
                                    <span>银行账户：</span>
                                    <p>{order_invoice_info && order_invoice_info.bank_account}</p>
                                </div>
                            }
                            {
                                order_invoice_info && order_invoice_info.invoice_type != undefined &&
                                <div className='p'>
                                    <span>纳税人识别号：</span>
                                    <p>{order_invoice_info && order_invoice_info.taxpayer_identification_code}</p>
                                </div>
                            }
                            {
                                order_invoice_info && order_invoice_info.invoice_type != undefined &&
                                <div className="p">
                                    <Popover placement="bottomLeft" content={this.renderPopover(order_invoice_info)} trigger="click">
                                        <a href="javascript:;">更多></a>
                                    </Popover>
                                </div>
                            }
                        </div>

                        {
                            order_info && order_info.project_name  &&
                            <div className='father-order-address-box'>
                                <h2>项目信息</h2>
                                <div className='p'>
                                    <span>项目名称：</span>
                                    <p>{order_info && order_info.project_name}</p>
                                </div>
                                <div className='p'>
                                    <span>项目经理：</span>
                                    <p>{order_info && order_info.project_manager}</p>
                                </div>
                            </div>
                        }
                    </div>
                    {
                        order_info && order_info.order_file.length > 0 &&
                        <div>
                            <h3>附件</h3>
                            <div className="father-order-file-list">
                                {order_info.order_file.map((item,index)=>{
                                    const fileType = item.substring(item.lastIndexOf(".")+1);
                                    let typeIcon = null;
                                    switch (fileType) {
                                        case "ppt":
                                            typeIcon = "img_ppt.png";
                                            break;
                                        case "word":
                                            typeIcon = "img_word.png";
                                            break;
                                        case "pdf":
                                            typeIcon = "img_pdf.png";
                                            break;
                                        case "xlsx":
                                            typeIcon = "img_exl.png";
                                            break;
                                        case "xls":
                                            typeIcon = "img_exl.png";
                                            break;
                                        case "doc":
                                            typeIcon = "img_word.png";
                                            break;
                                    }
                                    return(
                                        <div className='file-list'>
                                            <div className="file-list-img">
                                                <span>
                                                    {typeIcon && <img src={require(`./../../image/${typeIcon}`)} alt=""/>}
                                                </span>
                                            </div>
                                            <p title={item.substring(item.indexOf("-")+1)}>
                                                {item.substring(item.indexOf("-")+1)}
                                            </p>
                                            <a href='javascript:;' onClick={()=>{this.fileLink(item)}}>查看文件</a>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    }

                    <div className="father-order_info">
                        <p>
                            商品件数：<span>{order_info && order_info.count}件</span>
                        </p>
                        <p>
                            商品总价：<span>￥{order_info && order_info.order_price_without_all_freight}</span>
                        </p>
                        <p>
                            应付总额：<b>￥{order_info && order_info.order_price}</b>
                        </p>
                    </div>
                </div>
                <ApprovalModal {...approvalData}/>
            </div>
        )
    }

}