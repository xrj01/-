import React from "react";
import {Link} from 'react-router-dom';
import Header from "./../../components/header";
import Footer from "./../../components/footer/newFootHelp/Footer";
import api from "./../../component/api";
import "./index.scss";
import {Icon,Button,Steps} from "antd";
const { Step } = Steps;
export default class AuditOrder extends React.Component{
    constructor(props) {
        const parent_order_id = window.location.hash.split("=")[1];
        super(props);
        this.state={
            parent_order_id,
            approval:[],
            buyer:[],
            current:0
        }
    }

    componentDidMount() {
        this.getApprovalById()
    }
    //获取审批流详情
    getApprovalById=()=>{
        const {parent_order_id} = this.state;
        const data={
            parent_order_id
        };
        api.axiosPost("order_approval_process",data).then((res)=>{
            if(res.data.code == 1){
                let current = 0;
                const approval = res.data.data.approval;
                approval.map((item,index)=>{
                    if(item.state == 0){
                        current = index + 1;
                    }
                });
                this.setState({
                    approval,
                    buyer:res.data.data.buyer,
                    current
                })
            }
        })
    };

    renderDescription=(item,index)=>{
        // console.log(item)
        let title1="审批发起人：";
        let title2="所属部门：";
        let title3="订单提交时间：";
        let time = "";
        let state = "";
        if(index !== 0){
            title1="审批人：";
            title2="所属部门：";
            title3="审批状态：";
            time = item.approval_time;
            switch (item.state) {
                case -1:
                    state="待审批";
                    break;
                case 0:
                    state="待审批";
                    break;
                case 1:
                    state="通过";
                    break;
                case -2:
                    state="已驳回";
                    break;
            }
        }else{
            time = item.create_time;
        }
        return(
            <div className='description-box'>
                <p>{title1}{item.name}</p>
                <p>{title2}{item.department}</p>
                {
                    index>0 ? <p>审批状态：{state}</p> : <p>{title3}{time}</p>
                }

            </div>
        )
    };
    render(){
        const {approval,buyer,current} = this.state;
        return(
            <div className='audit-order-warp'>
                <Header />
                <div className="audit-order-box">
                    <div className="audit-order-ok-box">
                        <Icon type="check-circle" theme="filled" />
                        <h4>订单已提交审批</h4>
                        <p>

                            {
                                approval.length > 0 ? "请及时联系上级审批人进行审批" : "免审批订单，已自动付款成功"
                            }
                        </p>
                    </div>
                    {
                        approval && approval.length>0 &&
                        <div className="audit-order-step">
                            <Steps current={current} >
                                {
                                    buyer && buyer.map((item)=>(
                                        <Step title="" description={this.renderDescription(item,0)}/>
                                    ))
                                }
                                {
                                    approval && approval.map((item,index)=>(
                                        <Step title="" description={this.renderDescription(item,index + 1)}/>
                                    ))
                                }
                            </Steps>
                        </div>
                    }


                    <div className="audit-order-button">
                        <Button type='primary'>
                            <Link to='/home'>进入首页</Link>
                        </Button>
                        <Button>
                            <Link to='/BuyerCenter/MyOrder'>查看订单</Link>
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

}