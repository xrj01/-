import React from "react";
import "./index.scss";
import api from "../../component/api";

export default class busPersonal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            data:''
        }
    }

    render(){
        const {data} = this.state
        return(
            <div className='admin-busPersonal-box'>
                <div className='admin-busPersonal-container'>
                    <div className='admin-busPersonal-first'>
                        <div>账户名称：{data.user_name}</div>
                        <div>项目信息：{data.project}</div>
                    </div>
                    <div>
                        <div>真实姓名：{data.real_name}</div>
                        <div>部门信息：{data.department}</div>
                    </div>
                    <div>
                        <div>公司名称：{data.company_name}</div>
                        <div>审批流：{data.approval}</div>
                    </div>
                    <div div className='admin-busPersonal-end'>
                        <div>子级账户：{data.sub_account}</div>
                    </div>
                </div>
               <div className='admin-busPersonal-bottom'>
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
