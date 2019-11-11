import React from "react";
import {Button, Modal, Input, Row, Col, Form, Select,message} from "antd";
import api from "./../../component/api";
import prompt from "./../../component/prompt";
import "./index.scss";

class InvoiceModal extends React.Component{
    constructor(props) {
        super(props);
    }
    hideModal=()=>{
        this.props.isShowModal("invoiceModal",false)
    };
    //点击确定按钮
    handleSubmit=(e)=>{
        e.preventDefault();
        // console.log(e)
        this.props.form.validateFields((err, values) => {
            // console.log(err);
            if (!err) {
                values.invoice_type = this.props.addInvoiceType;
                // console.log(values);
                api.axiosPost("addInvoice",values).then((res)=>{
                    if(res.data.code == 1){
                        message.success(res.data.msg);
                        this.hideModal();
                        this.props.getInvoiceList()
                    }else{
                        message.error(res.data.msg);
                    }
                })
            }
        });
    };
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return(
            <Modal
                visible={this.props.invoiceModal}
                className="modal user-add-modal-boxs"
                title="新增发票"
                destroyOnClose={true}
                footer={[
                    <Button onClick={this.hideModal}>取消</Button>,
                    <Button htmlType="submit" onClick={this.handleSubmit} type='primary'>确定</Button>
                ]}
                onCancel={this.hideModal}
                maskClosable={false}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="企业名称">
                        {getFieldDecorator('company', {
                            rules: [
                                {
                                    required: true,
                                    message: '企业名称不能为空',
                                },
                            ],
                        })(<Input placeholder='请输入企业名称'/>)}
                    </Form.Item>
                    <Form.Item label="纳税人识别号">
                        {getFieldDecorator('taxpayer_identification_code', {
                            rules: [
                                {
                                    required: true,
                                    message: '纳税人识别号不能为空',
                                },
                            ],
                        })(<Input placeholder='请输入纳税人识别号'/>)}
                    </Form.Item>
                    <Form.Item label="注册地址">
                        {getFieldDecorator('register_address', {
                            rules: [
                                {
                                    required: true,
                                    message: '注册地址不能为空',
                                },
                            ],
                        })(<Input placeholder='请输入注册地址'/>)}
                    </Form.Item>
                    <Form.Item label="注册电话">
                        {getFieldDecorator('register_tel', {
                            rules: [
                                {
                                    required: true,
                                    validator:(rule,value,callback)=>{
                                        if(!prompt.checkTelAndPhone(value)){
                                            callback("电话格式不对");
                                            return
                                        }
                                        callback();
                                    },
                                    message: '注册电话格式不对，支持座机、手机格式',
                                },
                            ],
                        })(<Input placeholder='请输入注册电话'/>)}
                    </Form.Item>
                    <Form.Item label="开户银行">
                        {getFieldDecorator('bank', {
                            rules: [
                                {
                                    required: true,
                                    message: '企业名称开户银行',
                                },
                            ],
                        })(<Input placeholder='请输入开户银行'/>)}
                    </Form.Item>
                    <Form.Item label="银行账户">
                        {getFieldDecorator('bank_account', {
                            rules: [
                                {
                                    required: true,
                                    message: '银行账户不能为空',
                                },
                            ],
                        })(<Input placeholder='请输入银行账户'/>)}
                    </Form.Item>
                    <Form.Item label="收票人姓名">
                        {getFieldDecorator('taker_name', {
                            rules: [
                                {
                                    required: true,
                                    message: '收票人姓名不能为空',
                                },
                            ],
                        })(<Input placeholder='请输入收票人姓名'/>)}
                    </Form.Item>
                    <Form.Item label="收票人电话">
                        {getFieldDecorator('taker_tel', {
                            rules: [
                                {
                                    required: true,
                                    validator:(rule,value,callback)=>{
                                        if(!prompt.checkPhone(value)){
                                            callback("电话格式不对");
                                            return
                                        }
                                        callback();
                                    },
                                    message: '收票人电话格式不正确',
                                },
                            ],
                        })(<Input placeholder='请输入收票人电话'/>)}
                    </Form.Item>
                    <Form.Item label="收票人地址">
                        {getFieldDecorator('taker_address', {
                            rules: [
                                {
                                    required: true,
                                    message: '收票地址人不能为空',
                                },
                            ],
                        })(<Input placeholder='请输入收票人地址'/>)}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
const InvoiceModalForm = Form.create({ name: 'register' })(InvoiceModal);
export default InvoiceModalForm;