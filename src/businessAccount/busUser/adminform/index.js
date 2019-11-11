import React from "react";
import {Form,Input} from 'antd';
import api from '../../../component/api'
import "./index.scss";

class adminform extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            confirmDirty: false,
            areaOption: [],   // 级联选择器数据
        }
    }
    
    render(){
        //表单
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: {
              xs: { span: 4 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 4 },
              sm: { span: 17 },
            },
        };
        
        
        const {administrator,editRecord,} = this.props
        return(
            
            <Form onSubmit={this.handleSubmit} className='edit-form' {...formItemLayout}>
                
                <Form.Item label="账户名称：">
                    {getFieldDecorator('username', {
                    rules: [
                        { required: true, message: '请填写账户名称' },{ pattern: /^([a-z0-9\.\@\!\#\$\%\^\&\*\(\)]){4,20}$/i, message: '账户名称长度范围为4-20位字符(不能输入中文)!'}
                    ]
                    })(
                    <Input placeholder='请输入账户名称'/>
                    )}
                </Form.Item>
                
                
                <Form.Item label="真实姓名：">
                    {getFieldDecorator('name', {
                    rules: [
                        { required: true, message: '请填写真实姓名' },{pattern:  /^[a-zA-Z\u4E00-\u9FA5]{1,20}$/, message: '请输入中文或英文名字，最长20位字符!'},
                    ]
                    })(
                    <Input placeholder='请输入真实姓名'/>,
                    )}
                </Form.Item>
                {
                    administrator ?
                    <Form.Item label="手机号码：">
                        {getFieldDecorator('tel', {
                        rules: [
                            { required: true, message: '请输入手机号!' },{pattern: /^((\+)?86|((\+)?86)?)0?1[345789]\d{9}$/, message: '请输入正确的手机号!'},
                        ]
                        })(
                        <Input placeholder='请输入手机号码，可用于登录'/>,
                        )}
                    </Form.Item>:
                    <Form.Item label="手机号码：">
                        <span>{editRecord.phone}</span>
                    </Form.Item>
                }
                
                {
                    administrator ? 
                    <Form.Item label="登录密码：">
                        <span>默认初始密码123456</span>
                    </Form.Item> : ''
                    // <Form.Item label="登录密码：">
                    //     {getFieldDecorator('password', {
                    //     rules: [
                    //         { required: true, message: '请输入登录密码' },
                    //         { message: '请填写6-8位数字和字母组成的密码' , pattern : /^([a-z0-9A-Z)]){6,8}$/i},
                    //         { validator: this.validateToNextPassword },
                    //     ]
                    //     })(
                    //     <Input.Password name='password'/>,
                    //     )}
                    // </Form.Item>
                }
                {/* {
                    administrator ? "" :
                    <Form.Item label="确认密码：">
                        {getFieldDecorator('confirmpwd', {
                        rules: [
                            { required: true,message: '请再次确认密码' },
                            { validator: this.compareToFirstPassword },
                        ]
                        })(
                        <Input.Password 
                            name='confirmpwd'
                            onBlur={this.handleConfirmBlur}
                        />,
                        )}
                    </Form.Item>
                } */}
                <Form.Item label="邮箱账户：">
                    {getFieldDecorator('mailbox', {
                        rules:[
                            {type:'email',message:'请输入正确邮箱'}
                        ]
                    })(
                    <Input />,
                    )}
                </Form.Item>
            </Form>
        )
        
    }
    componentDidMount(){
        //console.log(222,this.props.administrator);
        
        if(!this.props.administrator){
            // 编辑数据回填
            this.props.form.setFieldsValue({
                username : this.props.editRecord.user_name,
                name : this.props.editRecord.real_name,
                //tel : this.props.editRecord.phone,
                mailbox : this.props.editRecord.email  ? this.props.editRecord.email : '',
            })
        }
        

    }
   
}

export default Form.create()(adminform)