import React from "react";
import {Form,Input} from 'antd';
import api from '../../../component/api'
import "./index.scss";

class projectform extends React.PureComponent {
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
        
        
        const {} = this.props
        return(
            
            <Form onSubmit={this.handleSubmit} className='addform' {...formItemLayout}>
                
                <Form.Item label="项目名称：">
                    {getFieldDecorator('project_name', {
                    rules: [
                        { required: true, message: '请填写项目名称' },{max:30, message:'项目名称不能超过30个字符'},{pattern: /^[\w\u4e00-\u9fa5\-_][\s\w\u4e00-\u9fa5\-_]*[\w\u4e00-\u9fa5\-_]$/, message: '项目名称最少2个字符，首尾不能输入空格'}
                    ]
                    })(
                    <Input placeholder='请输入项目名称' autocomplete="off"/>,
                    )}
                </Form.Item>
                <Form.Item label="项目经理：">
                    {getFieldDecorator('project_manager', {
                    rules: [
                        { required: true, message: '请填写项目经理' },{pattern:  /^[a-zA-Z\u4E00-\u9FA5]{1,20}$/, message: '请输入中文或英文，最长20位字符!'}
                    ]
                    })(
                    <Input placeholder='请输入项目经理' autocomplete="off"/>,
                    )}
                </Form.Item>

            </Form>
        )
        
    }
    componentDidMount(){
        if(this.props.rowData){
            // 编辑数据回填
            this.props.form.setFieldsValue({
                project_name : this.props.rowData.project_name,
                project_manager : this.props.rowData.project_manager,
            })
        }
        

    }
   
}

export default Form.create()(projectform)