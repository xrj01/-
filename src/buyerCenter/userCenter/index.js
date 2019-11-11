import React from "react";
import { Route, Switch ,Link} from 'react-router-dom';
import {Button,Icon} from "antd";
import OrderList from "./../myOrder/orderList";
import api from "./../../component/api";
import Li from "./../../home/componentLi";
import "./index.scss";
import PriceConponents from "../../components/priceComponents";
export default class UserCenter extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            browseList:[],
            userInfo:{},
            orderLength: 0,    // 当前订单条数
        }
    }
    componentDidMount() {
        this.getScanProductLog();
        this.buyer_info();
    }
    //获取个人中心信息
    buyer_info=()=>{
        api.axiosPost("buyer_info").then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    userInfo:res.data.data
                })
            }
        })
    };
    //获取浏览过的商品
    getScanProductLog=()=>{
        api.axiosPost("get_scan_product_log").then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    browseList:res.data.data
                })
            }
        });
    };
    // 获得当前订单条数
    getOrderLength = (length) => {
        this.setState({
            orderLength: length
        })
    }
    render(){
        const {browseList,userInfo, orderLength} = this.state;
        return(
            <div className='user-center-box'>
                <div className="user-center-general-box">
                    <div className="user-center-div">
                        <p>账户名称：{userInfo.user_name}</p>
                        <p>真实姓名：{userInfo.real_name}</p>
                        <p title={userInfo.company_name}>所属公司：{userInfo.company_name}</p>
                        <p>所属部门：{userInfo.department}</p>
                    </div>
                    <div className="user-center-div">
                        <p>账期总额(元)：<span>{userInfo.sub_credit}</span></p>
                        <p>可用账期(元)：<span>{userInfo.remain_credit}</span></p>
                        <p>已用账期(元)：<span>{userInfo.done_credit}</span></p>
                    </div>
                    <div className="user-center-div">
                        <p>累计已完成订单：<span>{userInfo.done_order}</span>单</p>
                        <p>累计消费：<span>{userInfo.expense}</span>元</p>
                    </div>
                </div>

                <div className="user-my-order-box">
                    <div className="user-my-order-title">
                        <p>我的订单</p>
                        {
                            orderLength>0 ? <Link to="/BuyerCenter/MyOrder">查看全部</Link> : ''
                        }
                    </div>
                    <div className='user-my-order-box-title'>
                        <OrderList user_page_size={2} state={-101} paging={true} getOrderLength={this.getOrderLength}/>
                    </div>
                </div>


                <div className="user-my-order-box">
                    <div className="user-my-order-title">
                        <p>浏览过的商品</p>
                    </div>
                    <div className="browse-list-box">
                        <ul>
                            {
                                browseList && browseList.map((item)=>{
                                    return(
                                        <Li key={item.id} {...item} item={item}/>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>

                <PriceConponents />
            </div>
        )
    }

}