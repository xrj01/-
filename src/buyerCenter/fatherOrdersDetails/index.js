import React from "react";
import {Link} from "react-router-dom";
import api from "./../../component/api";
import {createHashHistory} from "history";
import {Icon, Button, message, Popover, Modal} from "antd";
import ApprovalModal from "./../myOrder/approvalModal";
import prompt from "../../component/prompt";
import "./index.scss";
const history = createHashHistory();

export default class FatherOrdersDetails extends React.Component{
    constructor(props) {
        super(props);
        const order_id = window.location.hash.split("=")[1];
        this.state={
            orderList:[],
            order_id,
            orderData:{},
            stepData:{},
            time_limit:"",
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
            parent_order_id:this.state.order_id
        };
        api.axiosPost("order_info",data).then((res)=>{
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
                time = `${h}:${m}:${s}`
                time_limit -=1000;
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
        clearInterval(this.interval)
        sessionStorage.removeItem('detailsSKU')
    };

    //获取审批流详情
    orderApprovalProcess=()=>{
        const data={parent_order_id:this.state.order_id,type:1};
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
            width: 440,
            centered: true,
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
    //再次购买
    buyAgain=()=>{
        const data={parent_order_id:this.state.order_id};
        api.axiosPost("buy_again",data).then((res)=>{
            if(res.data.code == 1){
                message.success(res.data.msg);
                history.push('/ShoppingCart')
            }else{
                message.error(res.data.msg)
            }
        })
    };
    /*//提醒发货
    remindDelivery=()=>{
        api.axiosPost("remind_delivery",data).then((res)=>{
            console.log(res)
        });
    };*/

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
                            <h3>运输中</h3>
                        </div>  }
                        { order_info && order_info.state == 4 &&
                        <div className='deal'>
                            <em className='deal'> </em>
                            <h3>已完成</h3>
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
                            <h6>父订单编号</h6>
                            <p>{order_id}</p>
                        </div>
                        <div className={order_info && (order_info.state == 3 || order_info.state == 2) ? 'flex3' : ""}>
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

                        {
                            order_info && order_info.state == 0 &&
                            <div>
                                <Button type='primary'>
                                    <Link to={`/payOrder?order_id=${order_id}`}>提交审核</Link>
                                </Button> &emsp;
                                <Button onClick={this.cancel_order}>取消订单</Button>
                            </div>
                        }
                        {
                            order_info && order_info.state == 1 &&
                            <div>
                                <Button onClick={this.orderApprovalProcess}>审批流程</Button>
                            </div>
                        }
                        {
                            order_info && (order_info.state == 4 || order_info.state == -1 || order_info.state == -3 || order_info.state == -2) &&
                            <div>
                                <Button onClick={this.buyAgain}>再次购买</Button>
                            </div>
                        }

                        {
                            order_info && order_info.state == 3 && orderData.sub_order_list && orderData.sub_order_list.length>1 &&
                            <p className='transport-title'>
                                <Icon type="exclamation-circle" theme="filled" /> &nbsp;
                                您的订单商品分属于不同库房，故已为您分开配送，给您带来不便敬请谅解。
                            </p>
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
                    <h3>商品信息</h3>
                    <div className="common-title">
                        <ul>
                            <li className="w1">商品信息</li>
                            <li className="w2">单价</li>
                            <li className="w3">数量</li>
                            <li className="w4">小计</li>
                            <li className="w5">操作</li>
                        </ul>
                    </div>
                    {
                        orderData.sub_order_list && orderData.sub_order_list.map((item)=>{
                            let state = "待发货";
                            switch (item.state) {
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
                                case -3:
                                    state = "已驳回";
                                    break;
                            }
                            return(
                                <div className="child-order-list" key={item.id}>
                                    <div className="child-order-head">
                                        <div title={item.create_time}>下单时间：{item.create_time}</div>
                                        <div title={item.id}>订单编号：{item.id}</div>
                                        <div className="supplier-name" title={item.merchant_name}>供应商名称：{item.merchant_name}</div>
                                        <div>{state}</div>
                                    </div>
                                    <div className="child-order-content">
                                        <div>
                                            <img src={item.type == 'jd' ? item.pic : prompt.imgUrl(item.merchant_id,item.product_id)} alt=""/>
                                            <div className="child-order-goods father-order-goods">
                                                <p title={item.product_name}>
                                                    <Link 
                                                        target='_blank' 
                                                        to={ item.type == 'jd' ? `/JDgoodsDetails?${item.product_id}` : `/GoodsDetails?${item.product_id}`}
                                                        onClick={()=>{ if(item.type !== 'jd'){this.transmitParam(item.sku)}}}
                                                    >
                                                        {item.product_name}
                                                    </Link>
                                                </p>
                                                <p title={item.param}>{item.param}</p>
                                            </div>
                                        </div>
                                        <div>
                                            ￥{item.price}
                                        </div>
                                        <div>
                                            {item.count}{item.unit ? `/${item.unit}` : ""}
                                        </div>
                                        <div>
                                            ￥{item.order_price} <br />
                                        </div>
                                        <div>
                                            <Link to={`/BuyerCenter/ChildOrderDetails?order_id=${item.id}`}>订单详情</Link>
                                        </div>
                                    </div>
                                    <div className='child-order-note'>
                                        <span>备注：</span>
                                        <p>{item.remark}</p>
                                    </div>
                                </div>
                            )
                        })
                    }

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
                            order_info && order_info.state !=0 && order_info && order_info.project_name && <div className='father-order-address-box'>
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
                            商品件数：<span>{order_info && order_info.product_sum}件</span>
                        </p>
                        <p>
                            商品总价：<span>￥{order_info && order_info.order_price_without_all_freight}</span>
                        </p>
                        <p>
                            运&emsp;&emsp;费：<span>￥{order_info && order_info.all_freight}</span>
                        </p>
                        <p>
                            应付总额：<b>￥{order_info && order_info.all_order_price}</b>
                        </p>
                    </div>
                </div>


                <ApprovalModal {...approvalData}/>
            </div>
        )
    }

}