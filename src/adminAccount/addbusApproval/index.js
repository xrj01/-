import React from "react";
import {Table,Input,Select,Button,message,Modal,Form,Radio} from "antd"
import "./index.scss";
import { Route ,Link} from 'react-router-dom';
import { createHashHistory } from 'history';

import api from "../../component/api";
const history = createHashHistory();
class busApproval extends React.Component{
    stepArr = ['一','二','三','四','五','六','七','八','九','十']
    constructor(props) {
        super(props);
        this.state={
            // 列表表头信息
            columns: [
                {
                    title: '审批环节',
                    dataIndex: 'approval-process',
                    align: 'center',
                    width: '98px',
                    render: (t, r, i) => `${this.stepArr[i]}级审批`
                },
                {
                    title: '审批人',
                    dataIndex: 'username',
                    align: 'center',
                    width: '127px',
                    //render: u => u ? u.join('、') : ''
                },
                {
                    title: '所属部门',
                    dataIndex: 'department',
                    align: 'center',
                    width: '127px',
                    //render: u => u ? u.join('、') : ''
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    align: 'center',
                    render: (text, record, index) => {
                        return (
                            
                            <div className='table-btn'>
                                <span onClick={()=>{this.showModal(index)}}>选择审批员</span> 
                                {
                                    this.stepArr[index] === '一' ? '' : <span onClick={this.showEditModal.bind(this, index)}>删除</span>
                                }
                                
                                
                            </div>
                            
                        )
                    }
                }
            ],
            modalColumns:[
                
                {
                    title: '审批用户',
                    dataIndex: 'username',
                    align: 'center',
                    width:'127px'
                },
                {
                    title: '所属部门',
                    dataIndex: 'department',
                    align: 'center',
                    width:'127px'
                },
            ],
            tableData : [{}],
            modalData : [],
            dataArr : [],  // 下拉数据
            radioNum : '0', // 单选默认数据
            current: '0',  
            selectedRows : [],  
            modalSelect : false   
        }
    }

    

    render(){
        // 动态加载下拉数据
        const { Option } = Select;
        const children = [];
        
        
        for (let i = 0; i < this.state.dataArr.length; i++) {
        children.push(<Option key={this.state.dataArr[i].id} value={this.state.dataArr[i].id}>{this.state.dataArr[i].project_name}</Option>);
        }
        //表单
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: {
              xs: { span: 3 },
              sm: { span: 3 },
            },
            wrapperCol: {
              xs: { span: 3 },
              sm: { span: 17 },
            },
        };
        const rowSelection = {
            type:'radio',
            columnTitle:"选择",
            onChange: (selectedRowKeys, selectedRows) => {
              //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
              this.setState({selectedRows})
            },
            /* getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }), */
            getCheckboxProps: record => {
                // console.log(record);
                //console.log(222,this.state.tableData);
                //console.log(333,this.state.modalData);
                let disabled = false;

                tableData.map((item)=>{
                    if(item.id == record.id){
                        disabled = true;
                    }
                })
                return{ disabled }
              
            },
        };
        const {columns,data,current,tableData,modalColumns,modalData,radioNum,} = this.state;
        
        return(
            <div className='busApproval-box'>
                <div className='busApproval-container'>
                    <div className='title'>
                        <span>新增审批流</span>
                    </div>
                    <div className='busApproval-form'>
                        <Form onSubmit={this.handleSubmit}  {...formItemLayout}>
                    
                            <Form.Item label="审批流名称：">
                                {getFieldDecorator('project_name', {
                                rules: [
                                    {required: true, message: '请输入审批流名称'},{max:20,message:'审批流名称不能超过20个字符'},
                                    {pattern: /^[\w\u4e00-\u9fa5\-_][\s\w\u4e00-\u9fa5\-_]*[\w\u4e00-\u9fa5\-_]$/, message: '审批流名称最少2个字符，首尾不能输入空格'}
                                ]
                                })(
                                <Input placeholder='请输入审批流名称'/>,
                                )}
                            </Form.Item>
                            <Form.Item label="所属项目：">
                                {getFieldDecorator('project_id', {
                                rules: [
                                    { required: true, message: '请选择项目信息' }
                                ]
                                })(
                                <Select placeholder="请选择项目信息" style={{ width: '508px'}}>
                                    {children}
                                </Select>,
                                )}
                            </Form.Item>
                            <Form.Item label="是否审批：">
                                {getFieldDecorator('radio', {
                                rules: [
                                    { required: true, message: '请选择是否审批' }
                                ],
                                initialValue : `${radioNum}`
                                })(
                                <Radio.Group buttonStyle="solid" onChange={this.handleFormLayoutChange}>
                                    <Radio.Button value="0" className='mr36'>需要审批</Radio.Button>
                                    <Radio.Button value="1" className='mr36'>不需要审批</Radio.Button>
                                </Radio.Group>
                                )}
                            </Form.Item>
                            {
                                radioNum == '0' ? 
                                <div className='approve-table' >
                                    <div className='color333'>审批步骤：</div>
                                    <div className="table-box">
                                        <Table 
                                            columns={columns} 
                                            dataSource={tableData} 
                                            bordered
                                            pagination = {false}
                                        />
                                        {/* <Button onClick={this.addform} className='approve-table-addbtn'>
                                            新增审批环节&emsp;+
                                        </Button> */}
                                        {
                                            tableData && tableData.length>9 ?'':
                                            <Button onClick={this.addform} className='approve-table-addbtn'>
                                                新增审批环节&emsp;+
                                            </Button>
                                        }
                                    </div>
                                </div>
                                :''
                            }
                            
                            <Form.Item wrapperCol={{ span: 12, offset: 3 }} className='approve-btn-box'>
                                <Button htmlType="submit" className='approve-backbtn'>
                                    <Link to='/AdminAccount/AdminBusApproval'>返回审批流列表</Link>
                                </Button>
                                <Button htmlType="submit" className='approve-savebtn'>
                                    保存
                                </Button>
                            </Form.Item>

                         </Form>
                        {/* 选择审批员弹窗 */}
                        <Modal
                            className='approve-add-model'
                            destroyOnClose //清空弹窗
                            title="选择审批员"
                            width='560px'
                            centered = {true}
                            maskClosable = {false}
                            visible={this.state.modalSelect}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                <div className='busUser-edit-btn'>
                                    <Button key="back" onClick={this.handleCancel} style={{width:'80px',height:'40px'}}>
                                        取消
                                    </Button>
                                    <Button key="submit" type="primary" onClick={this.handleOk} style={{width:'80px',height:'40px'}}>
                                        确认
                                    </Button>
                                </div>
                            ]}
                            >
                            <Table 
                                columns={modalColumns} 
                                rowSelection={rowSelection}
                                dataSource={modalData} 
                                bordered
                                pagination = {false}
                            />
                        </Modal>
                    </div>
                    
                </div>
               
            </div>
        )
    }
    componentDidMount(){
        this.getProjectList()

        // 编辑 数据回填
        let id = sessionStorage.getItem('id')
        if(id){
            this.getEditData(id)
        }
    }
    componentWillUnmount(){
        sessionStorage.removeItem('id')
    }
    // 获取所属项目下拉列表
    getProjectList = e =>{
        const data = {
            page_number : 1,
            page_size : 100,
            project_name :'',
            project_manager : '',
            begin_time : '',
            end_time : ''
        }
        api.axiosPost('projectList',data).then((res)=>{
            if(res.data.code ===1){
                let dataArr = []
                res.data.data.project_list.map((item)=>{
                    let obj ={
                        project_name : item.project_name,
                        id : item.id
                    }
                    dataArr.push(obj)
                })
                this.setState({dataArr})
            }
        })
    }
    // 弹窗
    showModal = (index) =>{
        
        this.setState({
            modalSelect : true,
            index
        })
        const data = {
            username : ''
        }
        api.axiosPost('approvalBuyer',data).then((res)=>{
            if(res.data.code === 1){
                this.setState({
                    modalData : res.data.data
                })
            }

        })
        
    }
    handleCancel = e =>{
        this.setState({
            modalSelect : false,
            selectedRows : []
        })
    }
    // 单选
    handleFormLayoutChange = e =>{
        //console.log(1111,e.target.value);
        this.setState({
            radioNum : e.target.value
        })
    }
    // 选择审批员弹窗 ---保存
    handleOk = e =>{
        let {modalData,tableData,selectedRows,index} = this.state
        //console.log(1,index,2,selectedRows);
        
        if(selectedRows.length === 0){
            message.error('请选择审批用户')
        }else{
            // 多选
            /* const username = [], department = [];
            (selectedRows || []).forEach(item => {
                username.push(item.username)
                department.push(item.department)
            })
            tableData[index].username = username
            tableData[index].department = department
            this.setState({
                tableData,
                modalSelect : false
            }) */

            // 单选
            
            tableData[index].username = selectedRows[0].username
            tableData[index].department = selectedRows[0].department
            tableData[index].id = selectedRows[0].id
            this.setState({
                tableData,
                modalSelect : false,
                selectedRows : []
            })
            
        }
        
    }
    // 删除当前行
    showEditModal(i) {
        let {tableData} = this.state
        tableData && tableData.splice(i, 1)
        this.setState({tableData})
    }
    // 增加下一行
    addform = e =>{
       
        let {tableData} = this.state

        if(tableData.length<11){
            tableData.push({})
            this.setState({
                tableData
            })
        }else{
            message.error('只能添加10级审批 ')
        }
        
    }
    
    // 表单提交
    handleSubmit = e => {
        e.preventDefault();
        const {tableData,radioNum} = this.state
        
        this.props.form.validateFields((err, values) => {
            
            if (!err) {
                console.log('Received values of form: ', values);
                
                if(tableData.length && !tableData[0].username && radioNum =='0'){
                    message.error('请选择审批员')
                }else{
                    let tableArr = []
                    tableData.map((item)=>{
                        if(item.id){
                            tableArr.push(item.id)
                        }
                        
                    })
                    console.log(tableData,tableArr);
                    let getid = sessionStorage.getItem('id')
                    if(getid){
                        // 编辑审批流请求
                        const editData ={
                            content : values.project_name,
                            project_id : values.project_id,
                            without_approval : values.radio,
                            approvaler : tableArr,
                            id : getid
                        }
                        api.axiosPost('editApproval',editData).then((res)=>{
                            if(res.data.code ===1){
                                message.success(res.data.msg)
                                history.push('/AdminAccount/AdminBusApproval')
                            }else{
                                message.error(res.data.msg)
                            }
                        })
                    }else{
                        // 创建审批流请求
                        const data = {
                            content : values.project_name,
                            project_id : values.project_id,
                            without_approval : values.radio,
                            approvaler : tableArr
                        }
                        api.axiosPost('createApproval',data).then((res)=>{
                            if(res.data.code ===1){
                                message.success(res.data.msg)
                                history.push('/AdminAccount/AdminBusApproval')
                            }else{
                                message.error(res.data.msg)
                            }
                        })
                    }
                    
                }
                
            }
        });
    }


    // 编辑 数据回填
    getEditData = getid =>{
        const data = {
            id : getid
        }
        api.axiosPost('getApprovalById',data).then((res)=>{
            if(res.data.code === 1){
                const obj = {
                    project_name : res.data.data.content,
                    project_id : res.data.data.project_id,
                }
                //表单回填
                this.props.form.setFieldsValue(obj)
                res.data.data.approval_step.map((item)=>{
                    item.id = item.user_id
                })
                this.setState({
                    radioNum : res.data.data.without_approval,
                    tableData : res.data.data.approval_step
                })
            }
        })
    }

   
}

export default Form.create()(busApproval)