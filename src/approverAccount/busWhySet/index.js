import React from "react";
import {Table,Input,Select,Button,message,Switch,Modal,Pagination,Icon} from "antd"
import WhySetForm from './whySetForm'
import "./index.scss";
import api from "../../component/api";

class busWhySet extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            columns:[
                {
                    title: '序号',
                    dataIndex: 'serialnum',
                    align: 'center'
                },
                {
                    title: '通用驳回原因',
                    dataIndex: 'content',
                    //align: 'right'
                },
                {
                    title: '操作',
                    dataIndex: 'price',
                    align: 'center',
                    render: (text, record) => {
                        return (
                            <div className='table-btn'>
                                <span onClick={()=>{this.showEditModal(record)}}>编辑</span>
                                <span onClick={()=>{this.isDelete(record)}}>删除</span>
                            </div>
                        )
                    }
                },
                
            ],
            data:[],

            visible:false ,
            sum : 0,
            rowDate:''
        }
    }

    render(){
        const {columns,data,sum,rowData} = this.state
        
        return(
            <div className='busBill-box'>
                <div className='busBill-container'>
                    <div className='title'>
                        <span className='why-title'>原因列表</span>
                    </div>
                    <div className='table-title'>
                        <div className='table-title-font'>
                            {/* <i className='iconfont iconwj-zd'></i> */}
                            <img src={require('./../../image/why.png')} className='busDepartment-img busBill-img' alt=''/>
                            <div>原因总数：{sum}</div>
                        </div>
                        <div>
                            <Button className='btn-style' onClick={this.showModal}>新增通用驳回原因</Button>
                        </div>
                    </div>
                    {/* 表格 */}
                    <div className="table-box">
                        <Table 
                            columns={columns} 
                            dataSource={data} 
                            bordered
                            pagination={false}
                        />
                    </div>
                    {/* 新增部门弹窗 */}
                    <Modal
                        className='project-edit-model'
                        destroyOnClose //清空弹窗
                        width='560px'
                        centered = {true}
                        maskClosable = {false}
                        title= {rowData ? "编辑通用驳回原因" : "新增通用驳回原因"}
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <div className='busDepartment-edit-btn'>
                                <Button key="back" onClick={this.handleCancel} style={{width:'80px',height:'40px'}}>
                                    取消
                                </Button>
                                <Button key="submit" type="primary" onClick={this.handleOk} style={{width:'80px',height:'40px'}}>
                                    保存
                                </Button>
                            </div>
                        ]}
                    >
                        <WhySetForm wrappedComponentRef={(e)=>{this.addform = e}} row={rowData}/>
                    </Modal>
                </div>
            </div>
        )
    }
    componentDidMount(){
        this.whyList()
    }
    // 原因列表
    whyList = e =>{
        const data = {
            type : 1
        }
        api.axiosPost('approval_reason_model_list',data).then((res)=>{
            if(res.data.code === 1){
                res.data.data.local_model.map((item,index)=>{
                    item.serialnum = index + 1
                })
                this.setState({
                    data : res.data.data.local_model,
                    sum : res.data.data.local_model.length
                })
            }
        })
    }

    // 新增弹窗
    showModal = () => {
        this.setState({
            rowData : '',
            visible: true,
        });
    };
    handleCancel = e => {
        //console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleOk = (e) => {
        let addform = this.addform
        // 表单验证
        addform.props.form.validateFields((err, values) => {
            e.preventDefault();
            if (!err) {
                
                if(this.state.rowData){
                    // 编辑
                    const data = {
                        content : values.reason,
                        id : this.state.rowData.id
                    }
                    api.axiosPost('update_reason_model',data).then((res)=>{
                        if(res.data.code === 1){
                            message.success(res.data.msg)
                            this.setState({
                                visible: false,
                            },()=>{this.whyList()})
                            
                        }else{
                            message.error(res.data.msg)
                        }
                    })
                }else {
                    // 新增
                    const data = {
                        content : values.reason
                    }
                    api.axiosPost('add_reason_model',data).then((res)=>{
                        if(res.data.code === 1){
                            message.success(res.data.msg)
                            this.setState({
                                visible: false,
                            },()=>{this.whyList()})
                            
                        }else{
                            message.error(res.data.msg)
                        }
                    })
                }
                

            }   
        })
    }
    
    // 编辑弹窗
    showEditModal = (record) =>{
        this.setState({
            rowData : record,
            visible : true,
        })
    }

    
    // 删除按钮 ---确认删除
    isDelete=(record)=>{
        const _this = this;
        Modal.confirm({
            className:'resetPwd-modal',
            closable:true,
            content: '确认删除当前通用驳回原因吗？',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            centered:true,
            width:'440px',
            icon:<Icon type="exclamation-circle" className='yellow'></Icon>,
            onOk() {
                const data={ model_id : record.id };
                api.axiosPost("delete_reason_model",data).then((res)=>{
                    if(res.data.code == 1){
                        message.success(res.data.msg);
                        _this.whyList();
                    }else{
                        message.error(res.data.msg)
                    }
                })
            }
        });
    };
    
}

export default busWhySet