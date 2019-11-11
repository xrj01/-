import React from "react";
import {Form,Input,Select,Cascader } from 'antd';
import api from '../../../component/api'
import "./index.scss";

class addform extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            confirmDirty: false,
            areaOption: [],   // 级联选择器数据
            fid:0, //父级ID
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
        const { Option } = Select;
        //级联
        const fieldNames = {label: 'department', value: 'id', children: 'child'};
        return(
            
            <Form onSubmit={this.handleSubmit} className='addDepartmentForm' {...formItemLayout}>
                {/* <Form.Item label="上级部门" extra="如未选择，即默认为顶级部门">
                    {getFieldDecorator('superiorDepartment', {
                        
                    })(
                        <Cascader 
                            placeholder="请选择上级部门" 
                            options={this.state.areaOption}
                            fieldNames={fieldNames}
                            onChange={this.onChange}
                            changeOnSelect
                        />
                    )}
                </Form.Item> */}

                <Form.Item label="部门名称">
                    {getFieldDecorator('industryTitle', {
                    rules: [
                        { required: true, message: '请填写部门名称' },{max:20,message: '部门名称不能超过20个字符！'},{pattern: /^[\w\u4e00-\u9fa5\-_][\s\w\u4e00-\u9fa5\-_]*[\w\u4e00-\u9fa5\-_]$/, message: '部门名称最少2个字符，首尾不能输入空格'}
        
                    ]
                    })(
                    <Input placeholder="请输入部门名称"/>,
                    )}
                </Form.Item>
            </Form>
        )
        
    }
    componentDidMount(){
        this.getDepartment(0)

    }
    // 获取下拉数据
    getDepartment = (id,tar) => {
        const data = {
            fid	: id,
        }
        api.axiosPost('get_department',data).then( (res) => {
          
          if(res.data.code === 1){
            /* res.data.data && res.data.data.map((item,index,data)=>{
                if(item.children =[]){
                    item.children = null
                }
            }) */
            this.deleteTree(res.data.data)
            this.setState({
                areaOption:res.data.data
            })
          }
        }) 
    }
    deleteTree = (data) =>{
        data && data.map((item)=>{
            if(item.child && item.child.length === 0){
                delete item.child
            }else{
                this.deleteTree(item.child)
            }
        })
    }
    
}

export default Form.create()(addform)