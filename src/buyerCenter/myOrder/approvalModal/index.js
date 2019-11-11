import React from "react";
import { Icon,Button,Pagination,Modal,message,Steps } from "antd";
import "./index.scss";
const { Step } = Steps;
export default class ApprovalModal extends React.Component{
    constructor(props) {
        super(props);
    }
    hideModal=()=>{
        this.props.isHideModal("approvalModal",false)
    };
    render(){
        const {stepData} = this.props;
        return(
            <Modal
                className='modal'
                visible={this.props.display}
                title='审批流程'
                onCancel={this.hideModal}
                maskClosable={false}
                bodyStyle={{ maxHeight: '580px', overflowY:'auto' }}
                footer={[<Button key="primary" onClick={this.hideModal} type='primary'>确定</Button>]}
            >

                <div className="approval-modal-box">
                    <Steps direction="vertical" size="small" current={0}>
                        {
                            stepData && stepData.buyer && stepData.buyer.map((item,index)=>{
                                return(
                                    <Step key={100} status="finish" title={`发起人：${item.name}`}
                                          description={<div className='approval-step'>
                                              <p>提交订单时间：{item.create_time}</p>
                                              <p>所属部门：{item.department}</p>
                                          </div>} />
                                )
                            })
                        }
                        {
                            stepData && stepData.approval && stepData.approval.map((item,index)=>{
                                let state = "待审批";
                                let status = "process ";
                                switch (item.state) {
                                    case -1:
                                        state = "待审批";
                                        status = "wait";
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
                                        state = "已驳回";
                                        status = "error";
                                        break;
                                }
                                return(
                                    <Step key={index} status={status} title={`审批人：${item.name}`} description={
                                        <div className='approval-step'>
                                            <p>审批状态：{state}</p>
                                            <p>所属部门：{item.department}</p>
                                            <p>操作时间：{item.approval_time}</p>
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