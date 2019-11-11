import React from "react";
import { Route, Switch ,Link} from 'react-router-dom';
import {Tabs,Button,Table,Pagination,Modal, message, Icon} from "antd";
import Commonform from './commonform'
import Addtaxform from './addtaxform'
import "./index.scss"
import api from "../../component/api";
export default class InvoiceManagement extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            columns:[
                {
                    title: '序号',
                    dataIndex: 'num',
                    align: 'center',
                    className: 'th-font',
                    width: 50
                },
                {
                    title: '企业名称',
                    dataIndex: 'company',
                    // align: 'center',
                    className: 'th-font',
                    width: 78
                },
                {
                    title: '注册电话',
                    dataIndex: 'register_tel',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '纳税人识别号',
                    dataIndex: 'taxpayer_identification_code',
                    // align: 'center',
                    className: 'th-font'
                },
                {
                    title: '开户行',
                    dataIndex: 'bank',
                    // align: 'center',
                    className: 'th-font'
                },
                {
                    title: '收票人信息',
                    dataIndex: 'taker_name',
                    // align: 'center',
                    className: 'th-font',
                    render: (text, record) => {
                        return (
                            <div >
                                {`${text} | ${record.taker_tel} | ${record.taker_address}`}
                            </div>
                        )
                    }

                },
                {
                    title: '发票类型',
                    dataIndex: 'invoice_type',
                    // align: 'center',
                    width: '81px',
                    className: 'th-font',
                    render: (text, record) => {
                        return (
                            <div >
                                {text === 0?'普通发票':text === 1?'增值税发票':''}
                            </div>
                        )
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    align: 'center',
                    width: '80px',
                    render: (text, record) => {
                        return (
                            
                            <div className='user-table-btn'>
                                <span onClick={()=>{this.ShowEditModal(record)}}>编辑</span> 
                                <span onClick={()=>{this.showDeleteModal(record)}}>删除</span>
                            </div>
                        )
                    }
                }
            ],
            data:[],
            record:'',
            spinning: false,              // 当前加载状态
            tabskey:'0', // tab切换
            addCommon : false,  // 弹窗
            delete : false
            }
        
    

    }
   
    render(){
        const {columns,data,tabskey,record} = this.state;
        const { TabPane } = Tabs;
        return(
            <div className='user-invoice-management'>
                <Tabs defaultActiveKey="0" onChange={this.callback}>
                    <TabPane tab="发票列表" key="0">
                        {/* 表格 */}
                        <div className="user-invoice-table">
                            <Table 
                                columns={columns} 
                                dataSource={data} 
                                bordered
                                rowClassName='row-font'
                                className="tables"
                                pagination={false}
                            />
                        </div> 
                    </TabPane>
                    {/* <TabPane tab="增值税专票" key="1">
                        <div className="table-box">
                            <Table 
                                columns={addedcolumns} 
                                dataSource={data} 
                                bordered
                                rowClassName='row-font'
                            />
                        </div> 
                    </TabPane> */}
                    
                </Tabs>
                <Button onClick={this.isShowModal} className='user-invoice-btn'>新增发票</Button>
                    
                {/* 新增普通发票弹窗 */}
                <Modal
                    className='modal'
                    destroyOnClose //清空弹窗
                    title= {record?'编辑发票':"新增发票"}
                    width='610px'
                    maskClosable={false}
                    visible={this.state.addCommon}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        
                        <Button key="back" onClick={this.handleCancel} >
                            取消
                        </Button>,
                        <Button key="submit" type='primary' onClick={this.handleOk} >
                            保存
                        </Button>
                        
                    ]}
                    >
                        
                    <Commonform wrappedComponentRef={(e)=>{this.addform = e}} record={record}/>
                            
                </Modal>
                {/* 删除弹窗 */}
                <Modal
                    className='modal delete-modal'
                    destroyOnClose //清空弹窗
                    title=''
                    width='440px'
                    visible={this.state.delete}
                    onOk={this.deletehandleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <div className='user-edit-btn'>
                            <Button key="back" onClick={this.handleCancel}>
                                取消
                            </Button>,
                            <Button key="submit" type='primary' onClick={this.deletehandleOk}>
                                确定
                            </Button>
                        </div>
                    ]}
                    >
                    <div className="delet-title"><Icon type="exclamation-circle" />&nbsp;&nbsp;确定删除发票吗？</div>
                </Modal>
                
            </div>
        )
    }
    componentDidMount(){
        this.getInvoiceList()
    }
    // 获取发票列表
    getInvoiceList = e =>{
        const data = {
            //invoice_type : this.state.tabskey
        }
        api.axiosPost('invoiceList',data).then((res)=>{
            if(res.data.code ===1){
                this.setState({
                    data : res.data.data
                })
            }
        })
    }
    // tabs切换
    callback =(key)=> {
        // console.log(key);
        
        this.setState({
            tabskey : key
        })
    }
    // 弹窗
    handleCancel = e => {
        //console.log(e);
        this.setState({
            addCommon : false,
            delete : false
        });
    };
    isShowModal = e =>{
        
        this.setState({
            addCommon : true,
            record : ''
        })
    }
    showDeleteModal = (record) =>{
        this.setState({
            delete : true,
            record
        })
    }
    ShowEditModal = (record) =>{
        this.setState({
            addCommon : true,
            record
        })
    }
    // 新增发票 ---保存按钮
    handleOk = e =>{
        
        
        let addform = this.addform
        
        const {record} = this.state
        if(!record){
            // 新增发票
            addform.props.form.validateFields((err, values) => {
                // console.log(1111,values);
                
                e.preventDefault();
                if (!err) {
                    const addData = {
                        company : values.companyName,
                        register_tel : values.regTel,
                        register_address : values.regAdd,
                        taxpayer_identification_code : values.taxpayerNumber,
                        bank : values.depositBank,
                        bank_account : values.bankAccount,
                        taker_name : values.checktakerName,
                        taker_address : values.ticketSite,
                        taker_tel : values.ticketTel,
                        invoice_type : values.invoice_type
                    }
                    api.axiosPost('addInvoice',addData).then((res)=>{
                        if(res.data.code ===1){
                            message.success(res.data.msg)
                            
                            this.setState({
                                addCommon:false,
                            })
                            this.getInvoiceList()
                        }else{
                            message.error(res.data.msg)
                        }
                    })
                    
                } 
            })   
        }else{
            // 编辑发票
            addform.props.form.validateFields((err, values) => {
                //console.log(1111,values);
                
                e.preventDefault();
                if (!err) {
                    const editData = {
                        id : record.id,
                        company : values.companyName,
                        register_tel : values.regTel,
                        register_address : values.regAdd,
                        taxpayer_identification_code : values.taxpayerNumber,
                        bank : values.depositBank,
                        bank_account : values.bankAccount,
                        taker_name : values.checktakerName,
                        taker_address : values.ticketSite,
                        taker_tel : `${values.ticketTel}`,
                        invoice_type : values.invoice_type == 0 || values.invoice_type =='普通发票' ? 0 : 1
                    }
                    api.axiosPost('editInvoice',editData).then((res)=>{
                        if(res.data.code ===1){
                            message.success(res.data.msg)
                            
                            this.setState({
                                addCommon:false,
                            })
                            this.getInvoiceList()
                        }else{
                            message.error(res.data.msg)
                        }
                    })
                    
                } 
            })   
            
        }
        
    }
        
    // 删除发票
    deletehandleOk = e =>{
        //console.log(this.state.record);
        const data = {
            id : this.state.record.id
        }
        api.axiosPost('delInvoice',data).then((res)=>{
            if(res.data.code ===1){
                message.success(res.data.msg)
                this.setState({
                    delete : false
                })
                this.getInvoiceList()
            }else{
                message.error(res.data.msg)
            }
        })
        
    }
}