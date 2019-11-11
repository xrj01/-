import React from "react";
import {Link} from "react-router-dom";
import api from "./../../../component/api";
import { Icon,Button,Pagination,Modal,message,Popover, Input, DatePicker, Select} from "antd";
import Null from "./../../../components/noList/nullMerchants";
import "./index.scss";
import prompt from "../../../component/prompt";

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD'; // 规定日期选择器的格式
const Option = Select.Option;

export default class ChildOrderList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            page_number:1,
            page_size:10,
            total:0,
            orderList:[],
            isNull:false,
            dateRange: [null, null],  // 日期范围
            sub_order_id: '0',         // 子订单id    没有请传0
            begin_time: '',           // 开始时间
            end_time: '',             // 结束时间
        }
    }
    componentDidMount() {
        this.getOrderList();
    }
    //页码改变
    paginationChange=(page)=>{
        window.document.getElementById('root').scrollIntoView(true)
        this.setState({
            page_number:page
        },()=>{
            this.getOrderList(false, false);
        })
    };
    //获取订单列表
    getOrderList=(isTAB = false,isCheckAll = true )=>{
        if(isTAB){
            this.setState({
                parent_order_id: '',
                project_id: undefined,
                dateRange: [null, null]
            })
        }
        const {page_size,page_number,begin_time,end_time, sub_order_id} = this.state;
        const data={
            page_number,
            page_size,
            sub_order_id:    isCheckAll? '0' : sub_order_id,
            begin_time:      isCheckAll? '' : begin_time,
            end_time:        isCheckAll? '' : end_time,
            state:this.props.state
        };
        api.axiosPost("order_sub_list",data).then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    orderList:res.data.data.list,
                    total:res.data.data.total_row,
                    isNull:true
                })
            }else{
                message.error(res.data.msg)
            }
        });
    };

    //确认收货
    confirm_goods=(orderId)=>{
        const data={sub_order_id:orderId};
        const _this = this;
        Modal.confirm({
            title: '是否确认收货?',
            okText: '确认',
            width: 440,
            centered: true,
            className : "confirm-order-modal",
            onOk() {
                api.axiosPost("confirm_goods",data).then((res)=>{
                    if(res.data.code == 1){
                        message.success(res.data.msg);
                        _this.getOrderList();
                    }else{
                        message.error(res.data.msg);
                    }
                })
            }
        });
    };
    // input ===> onChange
    handleOnchange = (type, val) => {
        // console.log('val', val);
        this.setState({
            [type]: val
        })
    }
    // 日期
    DateChange = (dates, dateStrings) => {
        this.setState({
            begin_time: dateStrings[0],
            end_time: dateStrings[1],
            dateRange: dates
        })
    }
    // 传递参数
    transmitParam = (param) => {
        sessionStorage.setItem('detailsSKU', param)
    }
    
    componentWillUnmount(){
        sessionStorage.removeItem('detailsSKU')
    }
    render(){
        const {orderList,isNull,total, dateRange, sub_order_id} = this.state;
        return(
            <div className='child-order-list-box'>
                {
                    orderList.length>0 ?
                    <div className="search-main-box">
                        <div className="input-box">
                            订单编号：
                            <Input placeholder="请输入订单编号" className="name"  onChange={(e) => { this.handleOnchange('sub_order_id', e.target.value) }} />
                        </div>
                        <div className="input-box">
                            下单时间：
                            <RangePicker
                                value={dateRange}
                                format={dateFormat}
                                className='date'
                                onChange={this.DateChange}
                            />
                        </div>
                        
                        <div className="btn-box">
                            <Button onClick={() => { this.getOrderList(false, false) }}>搜索</Button>
                            <Button onClick={() => { this.getOrderList(true, true) }}>重置</Button>
                        </div>
                    </div> : ''
                }
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
                    orderList && orderList.map((item)=>{
                        let state = "待发货";
                        switch (item.state) {
                            case 3:
                                state = "待收货";
                                break;
                            case 4:
                                state = "已完成";
                                break;
                        }
                        return(
                            <div className="child-order-list" key={item.id}>
                                <div className="child-order-head">
                                    <div className="time">下单时间：{item.create_time}</div>
                                    <div className="code">订单编号：{item.id}</div>
                                    <div title={item.merchant_name}>供应商名称：{item.merchant_name}</div>
                                    <div>{state}</div>
                                </div>
                                <div className="child-order-content">
                                    <div>
                                        <img src={item.type == "jd" ? item.pic : prompt.imgUrl(item.merchant_id,item.product_id)} alt=""/>
                                        <div className="child-order-goods">
                                            {/* <p>{item.product_name}</p> */}
                                            <p title={item.product_name}>
                                                <Link 
                                                    target='_blank' 
                                                    to={ item.type == 'jd' ? `/JDgoodsDetails?${item.product_id}` : `/GoodsDetails?${item.product_id}`} 
                                                    onClick={()=>{ if(item.type !== 'jd'){this.transmitParam(item.sku)}}}
                                                >
                                                    {item.product_name}
                                                </Link>
                                            </p>
                                            <p>{item.param}</p>
                                        </div>
                                    </div>
                                    <div>
                                        ￥{item.price}
                                    </div>
                                    <div>
                                        {item.count}{item.unit ? `/${item.unit}` : ""}
                                    </div>
                                    <div>
                                        ￥{item.order_price}
                                    </div>
                                    <div>
                                        {
                                            item.state == 3 && <Button type='primary' onClick={()=>{this.confirm_goods(item.id)}}>确认收货</Button>
                                        }
                                        {
                                            item.state != 2 &&
                                            <Popover placement="right" content={
                                                item.courier_name ?
                                                <div className=''>
                                                    <p>快递名称: {item.courier_name}</p>
                                                    <p>物流单号: {item.courier_id}</p>
                                                </div> : <p>正在等待揽件...</p>
                                            } >
                                                <p>追踪订单</p>
                                            </Popover>
                                        }
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

                {
                    orderList.length == 0 && isNull && <Null title="暂无订单" type='order'/>
                }

                {
                    total > 0 &&
                    <div className="pagination">
                        <Pagination current={this.state.page_number}
                                    pageSize={this.state.page_size}
                                    hideOnSinglePage={true}
                                    onChange={this.paginationChange}
                                    total={total}/>
                    </div>
                }
            </div>
        )
    }

}