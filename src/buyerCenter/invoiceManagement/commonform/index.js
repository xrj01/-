import React from "react";
import {Form,Input,Select} from 'antd';
import api from '../../../component/api'
import "./index.scss";

class commonform extends React.PureComponent {
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
              sm: { span: 5 },
            },
            wrapperCol: {
              xs: { span: 6 },
              sm: { span: 19 },
            },
        };
        const { Option } = Select;
        
        
        return(
            
            <Form onSubmit={this.handleSubmit} className='commonform' {...formItemLayout}>
            
                <Form.Item label="企业名称：">
                    {getFieldDecorator('companyName', {
                    rules: [
                        { required: true, message: '请输入企业名称' },{max:20,message:"企业名称最长20位字符数"}
                    ]
                    })(
                    <Input placeholder='请输入企业名称'/>
                    )}
                </Form.Item>
                
                <Form.Item label="纳税人识别号：">
                    {getFieldDecorator('taxpayerNumber', {
                    rules: [
                        { required: true, message: '请输入纳税人识别号' },{pattern:/^[0-9a-zA-Z]+$/,message:'请输入正确的纳税人识别号' },{max:20,message:"纳税人识别号最长20位字符数"}
                    ]
                    })(
                    <Input placeholder='请输入纳税人识别号'/>,
                    )}
                </Form.Item>
                <Form.Item label="注册地址：">
                    {getFieldDecorator('regAdd', {
                        rules: [
                            { required: true, message: '请输入注册地址' },{max:30,message:"注册地址最长30位字符数"}
                        ]
                        })(
                        <Input placeholder='请输入注册地址'/>
                    )}
                </Form.Item>
                <Form.Item label="注册电话：">
                    {getFieldDecorator('regTel', {
                    rules: [
                        { required: true, message: '请输入注册电话' },{pattern:/^((0\d{2,3}-\d{7,8})|(1[345789]\d{9}))$/,message:'手机号不正确，请仔细检查' },
                        
                    ],
                    /* validateTrigger: 'onBlur' */
                    })(
                    <Input placeholder='请输入注册电话'/>,
                    )}
                </Form.Item>
            
                <Form.Item label="开户银行：">
                    {getFieldDecorator('depositBank', {
                        rules: [
                            { required: true, message: '请输入开户银行' },{max:20,message:"开户银行最长20位字符数"}
                        ]
                        })(
                        <Input placeholder='请输入开户银行'/>,
                    )}
                </Form.Item>
                <Form.Item label="银行账户：">
                    {getFieldDecorator('bankAccount', {
                        rules: [
                            { required: true, message: '请输入银行账户' },{max:20,message:"银行账户最长20位字符数"}
                        ]
                        })(
                        <Input placeholder='请输入银行账户'/>,
                    )}
                </Form.Item>

                <Form.Item label="收票人姓名：">
                    {getFieldDecorator('checktakerName', {
                    rules: [
                        { required: true, message: '请输入收票人姓名!' },{pattern: /^[a-zA-Z\u4E00-\u9FA5]{1,20}$/, message: '请输入中文或英文名字，最长20位字符!'},
                    ]
                    })(
                    <Input placeholder='请输入收票人姓名'/>,
                    )}
                </Form.Item>
                <Form.Item label="收票电话 :">
                    {getFieldDecorator('ticketTel', {
                        rules: [
                            { required: true, message: '请输入收票人电话!' },{pattern: /^((\+)?86|((\+)?86)?)0?1[345789]\d{9}$/, message: '请输入正确的手机号!'}
                        ]
                        })(
                        <Input placeholder='请输入收票人电话'/>,
                    )}
                </Form.Item>
                
                <Form.Item label="收票地址：">
                    {getFieldDecorator('ticketSite', {
                        rules:[
                            {required:true,message:'请输入收票人地址'},{max:50,message:"收票人地址最长50位字符数"}
                        ]
                    })(
                    <Input placeholder='请输入收票人地址'/>,
                    )}
                </Form.Item>
                <Form.Item label="发票类型：">
                    {getFieldDecorator('invoice_type', {
                        rules:[
                            {required:true,message:'请选择发票类型'}
                        ]
                    })(
                    <Select
                        // style={{width:"290px"}}
                        placeholder="请选择发票类型"
                        onChange={this.handleSelectChange}
                    >
                        <Option value="0">普通发票</Option>
                        <Option value="1">增值税发票</Option>
                    </Select>
                    )}
                </Form.Item>
            </Form>
        )
        
    }
    componentDidMount(){
        const {record} = this.props
        // console.log(record);
        if(record){
            // 编辑数据回填
            this.props.form.setFieldsValue({
                companyName : record.company,
                regTel : record.register_tel,
                regAdd : record.register_address,
                taxpayerNumber : record.taxpayer_identification_code,
                depositBank : record.bank,
                bankAccount : record.bank_account,
                checktakerName : record.taker_name,
                ticketSite : record.taker_address,
                ticketTel : record.taker_tel,
                invoice_type : record.invoice_type === 0 ? '普通发票':'增值税发票'
            })
        }

    }
   
}

export default Form.create()(commonform)