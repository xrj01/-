import React from "react";
import {Form,Input} from 'antd';

import "./index.scss";

class turnform extends React.PureComponent {
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
              xs: { span: 24 },
              sm: { span: 24 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 24 },
            },
        };
        const { TextArea } = Input;
        
        return(
            
            <Form onSubmit={this.handleSubmit} className='turnform' >
                
                
                <Form.Item label="请输入驳回原因：">
                    {getFieldDecorator('reason', {
                    rules: [
                        { required: true, message: '请输入驳回原因' },{max:100,message:'驳回原因不能超过100个字符'}
                    ]
                    })(
                    <TextArea  style={{width:'480px',height:'200px'}}/>
                    )}
                </Form.Item> 
            </Form>
        )
        
    }
    componentDidMount(){
        
        

    }
   
}

export default Form.create()(turnform)