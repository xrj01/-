import React from "react";
import "./index.scss";
import api from "../../component/api";


export default class busPersonal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            data:{}
        }
    }

    render(){
        const {data} = this.state
        return(
            <div className='busPersonal-box'>
                <div className='busPersonal-container'>
                    <div className='busPersonal-first'>
                        <div>账户名称：{data.user_name}</div>
                        <div>项目信息：{data.project}</div>
                        <div>可用账期(元)：{data.remain_credit}</div>
                    </div>
                    <div>
                        <div>公司名称：{data.company_name}</div>
                        <div>部门信息：{data.department}</div>
                        <div>已用账期(元)：{data.done_credit}</div>
                    </div>
                    <div>
                        <div>子级账户：{data.sub_account}</div>
                        <div>审批流：{data.approval}</div>
                        <div>累计消费(元)：{data.expense}</div>
                    </div>
                    <div div className='busPersonal-end'>
                        <div>授信额度(元)：{data.credit}</div>
                        <div>累计已完成订单：{data.done_order}</div>
                        <div>累计还款(元)：{data.refund}</div>
                    </div>
                </div>
               {/* <div className='busPersonal-bottom'></div> */}
               <div className='busPersonal-busPersonal-bottom'>
                   <img src={require('./../../image/img_kzt.png')} alt=''/><span>暂无内容</span>
               </div>
            </div>
        )
    }
    componentDidMount(){
        this.getBuyerInfo()
    }
    // 获取个人中心信息
    getBuyerInfo = e =>{
        const data = {}
        api.axiosPost('buyer_info',data).then((res)=>{
            if(res.data.code ===1){
                this.setState({
                    data : res.data.data
                })
            }
        })
    }
}