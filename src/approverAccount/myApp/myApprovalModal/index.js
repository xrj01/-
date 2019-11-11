import React from "react";
import { Icon,Button,Pagination,Modal,message,Steps } from "antd";
import "./index.scss";
const { Step } = Steps;
export default class ApprovalModal extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            current : 0
        }
    }
    hideModal=()=>{
        this.props.isHideModal("approvalModal",false)
    };
    getTabledata = (data) => {
        // console.log(data,'--------------');
        /* data && data.approval.map((item,index)=>{
            
            if(item.state == -2){
                
                console.log(111,index);
                
                this.setState({current:index+1})
                return false
            }else{
                this.setState({current:index+1})
            }
        }) */
    }
    componentDidMount(){
        //console.log(2222,this.props.stepData);
        
    }
    render(){
        //const {current} = this.state
        const {stepData} = this.props;
        return(
            <Modal
                className='dismiss-model'
                destroyOnClose //清空弹窗
                width='560px'
                centered = {true}
                visible={this.props.display}
                title='审批流程'
                onCancel={this.hideModal}
                maskClosable={false}
                footer={[<Button onClick={this.hideModal} type='primary' style={{width:'80px',height:'40px'}}>确定</Button>]}
            >

                <div className='appProcess-steps'>
                    <Steps direction="vertical" size="small" current={1}> 
                        {
                            stepData && stepData.buyer && stepData.buyer.map((item,index)=>{
                                return(
                                    <Step title={`审批发起人：${item.name}`}
                                          description={<div className='appProcess-steps-activeTitle'>
                                              <p>提交时间：{item.create_time}</p>
                                              <p>所属部门：{item.department}</p>
                                          </div>} />
                                )
                            })
                        }
                        {
                            stepData && stepData.approval && stepData.approval.map((item,index)=>{
                                let state = "待审批";
                                let status = "wait"    
                                switch (item.state) {
                                    case -1:
                                        state = "待审批";
                                        break;
                                    case 0:
                                        state = "待审批";
                                        status = "process";    
                                        break;
                                    case 1:
                                        state = "通过";
                                        status = "finish"; 
                                        break;
                                    case -2:
                                        state = "驳回";
                                        status = "error"; 
                                        break;
                                    case -3:
                                        state = "审批超时";
                                        status = "error"; 
                                        break;
                                    case -4:
                                        state = "审批关闭";
                                        status = "error"; 
                                        break;
                                }
                                return(
                                    <Step status={status} title={`审批人：${item.name}`} description={
                                        <div className='appProcess-steps-activeTitle'>
                                            <p>审批状态：{state}</p>
                                            <p>所属部门：{item.department}</p>
                                            {
                                                item.approval_time ? <p>操作时间：{item.approval_time}</p> : ''
                                            }
                                            {
                                                item.reason !="" ? <p style={{color:'red'}}>驳回原因：{item.reason}</p> : ''
                                            }
                                        </div>
                                    } />
                                )
                            })
                        }
                    </Steps>

                </div>
            </Modal>
        )
    }

}