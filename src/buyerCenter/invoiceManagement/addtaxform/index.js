import React from "react";
import {Form,Input} from 'antd';
import api from '../../../component/api'
import "./index.scss";

class addtaxform extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            
        }
    }
    
    render(){
        //表单
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: {
              xs: { span: 6 },
              sm: { span: 6 },
            },
            wrapperCol: {
              xs: { span: 6 },
              sm: { span: 16 },
            },
        };
        
        
        const {administrator} = this.props
        return(
            
            <Form onSubmit={this.handleSubmit} className='addtaxform' {...formItemLayout}>
                
                <Form.Item label="企业名称：">
                    {getFieldDecorator('companyName', {
                    rules: [
                        { required: true, message: '请输入企业名称' },
                    ]
                    })(
                    <Input placeholder='请输入企业名称'/>
                    )}
                </Form.Item>
                
                <Form.Item label="纳税人识别号：">
                    {getFieldDecorator('taxpayerNumber', {
                    rules: [
                        { required: true, message: '请输入纳税人识别号' },
                    ]
                    })(
                    <Input placeholder='请输入纳税人识别号'/>,
                    )}
                </Form.Item>
                <Form.Item label="注册地址：">
                    {getFieldDecorator('regAdd', {
                        rules: [
                            { required: true, message: '请输入注册地址' },
                        ]
                        })(
                        <Input placeholder='请输入注册地址'/>
                    )}
                </Form.Item>
                <Form.Item label="注册电话：">
                    {getFieldDecorator('regTel', {
                    rules: [
                        { required: true, message: '请输入注册电话' },{pattern:/^1[345789]\d{9}$/,message:'手机号不正确，请仔细检查' },
                        
                    ],
                    validateTrigger: 'onBlur'
                    })(
                    <Input placeholder='请输入注册电话'/>,
                    )}
                </Form.Item>
            
                <Form.Item label="开户银行：">
                    {getFieldDecorator('depositBank', {
                        rules: [
                            { required: true, message: '请输入开户银行' },
                        ]
                        })(
                        <Input placeholder='请输入开户银行'/>,
                    )}
                </Form.Item>
                <Form.Item label="银行账户：">
                    {getFieldDecorator('bankAccount', {
                        rules: [
                            { required: true, message: '请输入银行账户' },
                        ]
                        })(
                        <Input placeholder='请输入银行账户'/>,
                    )}
                </Form.Item>

                <Form.Item label="收票人姓名：">
                    {getFieldDecorator('checktakerName', {
                    rules: [
                        { required: true, message: '请输入收票人姓名!' },
                    ]
                    })(
                    <Input placeholder='请输入收票人姓名'/>,
                    )}
                </Form.Item>
                <Form.Item label="收票电话 :">
                    {getFieldDecorator('ticketTel', {
                        rules: [
                            { required: true, message: '请输入收票人电话!' },
                        ]
                        })(
                        <Input placeholder='请输入收票人电话'/>,
                    )}
                </Form.Item>
                
                <Form.Item label="收票地址：">
                    {getFieldDecorator('ticketSite', {
                        rules:[
                            {required:true,message:'请输入收票人地址'}
                        ]
                    })(
                    <Input placeholder='请输入收票人地址'/>,
                    )}
                </Form.Item>
            </Form>
        )
        
    }
    componentDidMount(){
        

    }
   
}

export default Form.create()(addtaxform)