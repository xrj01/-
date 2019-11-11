import React from "react";
import {Form,Input} from 'antd';
import "./index.scss";

class ChangePwdForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            confirmDirty: false,
        }
    }

    render(){
        //表单
        const {getFieldDecorator} = this.props.form
        
        const { TextArea } = Input;
        return(
            
            <Form onSubmit={this.handleSubmit} className='busWhySet-form' hideRequiredMark={true}>
                
                <Form.Item>
                    {getFieldDecorator('reason', {
                        rules: [
                            { required: true, message: '请输入驳回原因' },{max:20,message:'驳回原因不能超过20个字符'}
                        ]
                        })(
                        <TextArea  style={{width:'480px',height:'100px'}} placeholder='请输入驳回原因，最多输入20字符~'/>
                    )}
                </Form.Item> 
                
            </Form>
        )
    }
    
    componentDidMount(){
        //console.log(222,this.props.row);
        // 编辑数据回填
        if(this.props.row){
            this.props.form.setFieldsValue({
                reason : this.props.row.content,
            })
        }
    }

}

export default Form.create()(ChangePwdForm)