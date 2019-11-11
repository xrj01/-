import React from "react";
import {Form,Input,Cascader} from 'antd';
import api from '../../../component/api'
import "./index.scss";

class approveform extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state={
            confirmDirty: false,
            areaOption: [],   // 级联选择器数据
            getId:[],//级联默认值
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
        
        
        const {partapproval,editRecord,} = this.props
        //级联
        const fieldNames = {label: 'department', value: 'id', children: 'child'};
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
                        { required: true, message: '请填写真实姓名' },{pattern:  /^[a-zA-Z\u4E00-\u9FA5]{1,20}$/, message: '请输入中文或英文名字，最长20位字符!'}
                    ]
                    })(
                    <Input placeholder='请输入真实姓名'/>,
                    )}
                </Form.Item>
                <Form.Item label="所属部门：">
                    {getFieldDecorator('superiorDepartment', {
                    rules: [
                        { required: true, message: '请选择所属部门' },
                    ],
                    initialValue : this.state.getId
                    })(
                        <Cascader 
                            placeholder="请选择" 
                            style={{width:'398px'}}
                            options={this.state.areaOption}
                            fieldNames={fieldNames}
                            loadData={this.loadData}
                            onChange={this.onChange}
                            changeOnSelect
                            // displayRender={displayRender}
                        />
                    )}
                </Form.Item>
                {
                    partapproval ?
                    <Form.Item label="手机号码：">
                        {getFieldDecorator('tel', {
                        rules: [
                            { required: true, message: '请输入手机号!' },{pattern: /^((\+)?86|((\+)?86)?)0?1[34589]\d{9}$/, message: '请输入正确的手机号!'},
                        ]
                        })(
                        <Input placeholder='请输入手机号码，可用于登录'/>,
                        )}
                    </Form.Item> :
                    <Form.Item label="手机号码：">
                        <span>{editRecord.phone}</span>
                    </Form.Item>
                }
                
                {
                    partapproval ? 
                    <Form.Item label="登录密码：">
                        <span>默认初始密码123456</span>
                    </Form.Item> : ''
                    
                }
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
        // console.log(3333,this.props.editRecord);
        
        if(!this.props.partapproval){
            //获取回填数据ID
            let getId = []
            for(let item in this.props.editRecord.department){

                if(item != 'count'){
                    getId.push(this.props.editRecord.department[item].id)
                }
            }
            // 数组排序
            getId = getId.sort(this.sortNumber);
            this.setState({getId})
            this.props.form.setFieldsValue({
                username : this.props.editRecord.user_name,
                name : this.props.editRecord.real_name,
                //tel : this.props.editRecord.phone,
                mailbox : this.props.editRecord.email  ? this.props.editRecord.email : '',
            })
        }
        
        
        this.getDepartment()

    }
    // 数组排序
    sortNumber(a,b){return a - b}
    // 获取下拉数据
    getDepartment = () => {
        const data = {
            type : 'people',
        }
        api.axiosPost('get_department',data).then( (res) => {
          
            if(res.data.code === 1){

                /* res.data.data.map((oneItem)=>{
                    if(oneItem.child.length == '0'){
                        delete oneItem.child
                    }else{
                        oneItem.child.map((twoItem)=>{
                            if(twoItem.child.length == '0'){
                                delete twoItem.child
                            }else{
                                twoItem.child.map((threeItem)=>{
                                    if(threeItem.child.length == '0'){
                                        delete threeItem.child
                                    }else{
                                        threeItem.child.map((fourItem)=>{
                                            if(fourItem.child.length == '0'){
                                                delete fourItem.child
                                            }else{
                                                fourItem.child.map((fiveItem)=>{
                                                    if(fiveItem.child.length == '0'){
                                                        delete fiveItem.child
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                    
                }) */
                this.deletTree(res.data.data)
                
                this.setState({
                    areaOption:res.data.data
                })
            }
        }) 
    }
    deletTree = (data) =>{
        data && data.map((item)=>{
            if(item.child.length === 0){
                delete item.child
            }else{
                this.deletTree(item.child)
            }
        })
    }
   
}

export default Form.create()(approveform)