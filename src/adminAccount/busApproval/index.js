import React from "react";
import {Table,Input,Select,Button,message,Switch,Modal,Pagination,Popover,Icon} from "antd"
import { Route ,Link} from 'react-router-dom';
import { createHashHistory } from 'history';
import "./index.scss";

import api from "../../component/api";

const history = createHashHistory();
export default class busApproval extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            columns:[
                /* {
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center'
                }, */
                {
                    title: '审批流程名称',
                    dataIndex: 'content',
                    align: 'center'
                },
                {
                    title: '所属项目',
                    dataIndex: 'project_name',
                    align: 'center'
                },
                {
                    title: '是否审批',
                    dataIndex: 'without_approval',
                    align: 'center'
                },
                {
                    title: '审批流程',
                    dataIndex: 'approval_step',
                    align: 'center',
                    render:(text,record)=>{
                        var arr = ['一','二','三','四','五','六','七','八','九','十']
                        const content = (
                            <div>
                                {
                                    text && text.map((item,index)=>{
                                        return(
                                            <p>审批{arr[index]} : {item}</p>
                                        )
                                        
                                    })
                                }
                            </div>
                        );
                        return( 
                            text.length > 1 ? 
                            <Popover content={content}>
                                <div style={{cursor:'pointer'}}>
                                    审批一 : {text[0]+'...'}
                                </div>
                            </Popover>
                            :text.length === 1 ?
                            <div>
                                审批一 : {text[0]}
                            </div>
                            :'-'
                        )
                    }
                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    align: 'center',
                    render:(text,record)=>{
                        return(
                            <div className='table-btn'>
                                <span onClick={()=>{this.editApproval(record,false,'edit')}}>编辑</span>
                                <span onClick={()=>{this.showDelete(record)}}>删除</span>
                            </div>
                        )
                    }
                }
            ],
            data:[],
            delete:false,
            record:'',  // 删除行数据
            page_number: 1,        //  当前页码
            page_size: 10,         //  每页显示数量
            total:0,
        }
    }

    render(){
        const {columns,data,page_size,total,page_number,record} = this.state;
        // 分页配置
        const pagination={
            total:total,
            pageSize:page_size,
            current:page_number,
            onChange:(page,size)=>{
                this.setState({page_number:page,age_size:size,spinning:true},()=>{
                    this.getApprovalList()
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        return(
            <div className='busApproval-box'>
                <div className='busApproval-container'>
                    <div className='title'>
                        <span>审批流列表</span>
                    </div>
                    <div className='table-title'>
                        <div className='table-title-font'>
                            {/* <i className='iconfont iconshenpi'></i> */}
                            <img src={require('./../../image/shenpiliuguanli.png')} className='busDepartment-img' alt=''/>
                            <div>审批流总数：{total}</div>
                        </div>
                        <div>
                            <Button className='btn-style' style={{width:'100px'}} onClick={this.addApproval}>新增审批流</Button>
                        </div>
                    </div>
                    {/* 表格 */}
                    <div className="table-box">
                        <Table 
                            columns={columns} 
                            dataSource={data} 
                            bordered
                            pagination = {false}
                        />
                    </div>
                    {
                        data.length === 0?'':
                        <div className="class-pagination-box">
                            {/* <Pagination defaultCurrent={1} {...pagination} showQuickJumper/> */}
                            <Pagination 
                                defaultCurrent={1} 
                                total={total}  
                                {...pagination} 
                                hideOnSinglePage={true} 
                                showSizeChanger 
                                showQuickJumper={{goButton: <Button className='pagination-btn'>确定</Button>}}
                                onShowSizeChange={this.onShowSizeChange}/>
                        </div>
                    }  
                </div>
                {/* 删除弹窗 */}
                <Modal
                    className='busUser-open-model'
                    destroyOnClose //清空弹窗
                    width='440px'
                    centered = {true}
                    closable = {false}
                    maskClosable = {false}
                    //title='删除部门'
                    visible={this.state.delete}
                    onOk={this.handleDeleteOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <div className='busUser-open-btn'>
                            <Button key="back" onClick={this.handleCancel} style={{width:'70px',height:'32px'}}>
                                取消
                            </Button>
                            <Button key="submit" type="primary" onClick={this.handleDeleteOk} style={{width:'70px',height:'32px'}}>
                                确定
                            </Button>
                        </div>
                    ]}
                >
                    {
                        <div className='delet-box'>
                            <Icon type="exclamation-circle" className="delet-icon"></Icon>
                            <div>确认删除{record.content}？</div>
                        </div>
                    } 
                    {/* <div>确认删除{record.content}？</div> */}
                    
                </Modal>

            </div>
        )
    }
    componentDidMount(){
        this.getApprovalList()
    }
    // 获取审批流列表
    getApprovalList = e =>{
        const data = {
            page_number : this.state.page_number,
            page_size : this.state.page_size
        }
        api.axiosPost('approvalList',data).then((res)=>{
            if(res.data.code ===1){
                res.data.data.approval_list.map((item,index)=>{
                    item.index = index+1
                    if(item.without_approval == 1){
                        item.without_approval = '否'
                    }else if(item.without_approval == 0){
                        item.without_approval = '是'
                    }
                })
                this.setState({
                    data : res.data.data.approval_list,
                    total : res.data.data.total_row
                })
            }
        })
    }
    // 新增审批流
    addApproval = e =>{
        history.push('/AdminAccount/AdminAdd')
    }
    // 编辑审批流
    editApproval = record =>{
        //console.log(111,record);
        const data = {
            id : record.id
        }
        api.axiosPost('getApprovalById',data).then((res)=>{
            if(res.data.code === 1){
                sessionStorage.setItem('id',record.id)
                history.push('/AdminAccount/AdminEdit')
            }else{
                message.error(res.data.msg)
            }
                
            }
        )
        
    }
    // 删除按钮
    /* delete = record =>{
        //console.log(record);
        const data = {
            id : record.id
        }
        api.axiosPost('delApproval',data).then((res)=>{
            if(res.data.code === 1){
                message.success(res.data.msg)
                this.getApprovalList()
            }else{
                message.error(res.data.msg)
            }
                
            }
        )
    } */
    handleCancel = e =>{
        this.setState({
            delete : false
        })
    }
    showDelete = (record) =>{
        this.setState({
            delete : true,
            record
        })
    }
    handleDeleteOk = e =>{
        const data = {
            id : this.state.record.id
        }
        api.axiosPost('delApproval',data).then((res)=>{
            if(res.data.code === 1){
                message.success(res.data.msg)
                this.setState({
                    delete : false,
                })
                this.getApprovalList()
            }else{
                message.error(res.data.msg)
            }
                
            }
        )
    }
    // 分页数量切换
    onShowSizeChange = (number,size) =>{
        this.setState({
            page_number:number,
            page_size:size
        },()=>{this.getApprovalList()})
    }
    
}