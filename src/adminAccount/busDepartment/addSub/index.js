import React from "react";
import {Form,Input,Cascader} from 'antd';
import api from '../../../component/api'
import "./index.scss";

class addSub extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            confirmDirty: false,
            areaOption: [],   // 级联选择器数据
            areaOptionDefault:[],//级联默认值
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
        //级联
        const fieldNames = {label: 'department', value: 'id', children: 'child'};
        return(
            
            <Form onSubmit={this.handleSubmit} className='addDepartmentForm' {...formItemLayout}>
                {
                    this.props.editsub ? '' : 
                    <Form.Item label="上级部门">
                        {getFieldDecorator('superiorDepartment', {
                        /* rules: [
                            { required: true, message: '请选择上级部门' },
                        ], */
                        })(
                            <div>
                                {this.props.department1.map((item,index,arr)=>{
                                    let items = `${item} /`
                                    if(index == arr.length-1){
                                        items = item
                                    }
                                    return(
                                        <span>{items}&nbsp;</span>
                                    )
                                    
                                })}
                            </div>
                        )}
                    </Form.Item>
                }
                {
                    this.props.addSub || this.props.singlrRowData.level === 1 ? '' : 
                    <Form.Item label="上级部门">
                        {getFieldDecorator('superiorDepartment', {
                        /* rules: [
                            { required: true, message: '请选择上级部门' },
                        ], */
                        initialValue : this.state.areaOptionDefault
                        })(
                            <Cascader 
                                placeholder="请选择" 
                                allowClear={false}
                                options={this.state.areaOption}
                                fieldNames={fieldNames}
                                loadData={this.loadData}
                                onChange={this.onChange}
                                changeOnSelect
                                // displayRender={displayRender}
                            />
                        )}
                    </Form.Item>
                }
                <Form.Item label="部门名称">
                    {getFieldDecorator('department', {
                    rules: [
                        { required: true, message: '请填写部门名称' },{max:20,message: '部门名称不能超过20个字符！'},{pattern: /^[\w\u4e00-\u9fa5\-_][\s\w\u4e00-\u9fa5\-_]*[\w\u4e00-\u9fa5\-_]$/, message: '部门名称最少2个字符，首尾不能输入空格'}
                    ]
                    })(
                    <Input placeholder="请填写部门名称" style={{borderRadius:'4px',height:'42px'}}/>,
                    )}
                </Form.Item>
            </Form>
        )
        
    }
    componentDidMount(){
        this.getData()
        this.getDepartment(0)
       
        this.cascadeBackfill()
        // console.log(this.props.department1);
        
    }
    // 获取回填部门
    getData(){
        this.props.form.setFieldsValue({department:this.props.department})
    }
    // 获取下拉数据
    getDepartment = (id,tar) => {
        const data = {
            fid	: id,
        }
        api.axiosPost('get_department',data).then( (res) => {
        if(res.data.code === 1){
            this.deleteTree(res.data.data)
            this.setState({
                areaOption:res.data.data
            })
        }
        })
        
    }
    // 级联回填
    cascadeBackfill(){
        /* let defaultValue = []
        for(let item in this.props.editData.data.data){

            if(item != 'count'){
                defaultValue.push(this.props.editData.data.data[item].id)
            }
        }
        // 数组排序
        defaultValue = defaultValue.sort(this.sortNumber); */
        //console.log(defaultValue,'---')
        this.setState({
            areaOptionDefault: this.props.getId
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

export default Form.create()(addSub)