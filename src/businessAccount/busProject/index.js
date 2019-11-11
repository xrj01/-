import React from "react";
import { Input, Button, Table, Pagination,DatePicker,Modal,message,Icon } from 'antd';
import "./index.scss";
import Projectform from './projectform'
import api from './../../component/api'
import WinButton from "../../components/winButton/index";

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD'; // 规定日期选择器的格式
export default class busProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                /* {
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center'
                }, */
                {
                    title: '项目名称',
                    dataIndex: 'project_name',
                    align: 'center'
                },
                {
                    title: '项目经理',
                    dataIndex: 'project_manager',
                    align: 'center'
                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    align: 'center'
                },
                {
                    title: '操作',
                    dataIndex: 'zzz',
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
            addProject: false,               // 控制弹窗的显示
            delete : false,
            tableData: [],  // 表格数据
            rowData:'',// 当前行数据
            page_number: 1,               // 页码
            spinning: false,              // 当前加载状态
            page_size: 10,                // 当前一页数据量
            total: 0,                     // 总数据条数
            dateRange: [null,null],       // 创建时间的范围
            start_time : '',
            end_time : '',
            project_name : '',
            project_manager : ''
        }
    }
    componentDidMount(){
        this.getUserList(false)
    }
    // 获取项目列表
    getUserList(overall){
        const data = {
            page_number : this.state.page_number,
            page_size : this.state.page_size,
            project_name : overall && this.state.project_name ? this.state.project_name :'',
            project_manager : overall && this.state.project_manager ? this.state.project_manager : '',
            begin_time : overall && this.state.start_time ? this.state.start_time :'',
            end_time : overall && this.state.end_time ? this.state.end_time :''

        }
        api.axiosPost('projectList',data).then((res)=>{
            if(res.data.code === 1){
                res.data.data.project_list && res.data.data.project_list.map((item,index)=>{
                    item.index = index+1
                    item.key = item.id
                })
                this.setState({
                    tableData : res.data.data.project_list,
                    total: res.data.data.total_row,
                })
            }
            
        })
    }
    
    // 控制弹窗的显示与隐藏
    handleCancel = e => {
        //console.log(e);
        this.setState({
            addProject : false,
            delete : false
        });
    };
    // 新建项目弹窗
    isShowModal = e =>{
        this.setState({
            addProject : true,
            rowData : ''
        })
    }
    // 编辑弹窗
    showEditModal = (record) =>{
        this.setState({
            addProject : true,
            rowData : record
        })
    }
    // 新建、编辑 ---保存按钮
    handleOk = e =>{
        let projectform = this.projectform
        projectform.props.form.validateFields((err, values) => {
            e.preventDefault();
            if (!err) {
                if(this.state.rowData){
                    // 编辑
                    const editDate = {
                        project_name : values.project_name,
                        project_manager : values.project_manager,
                        id : this.state.rowData.id
                    }
                    api.axiosPost('editProject',editDate).then((res)=>{
                        if(res.data.code ===1){
                            message.success(res.data.msg)
                            this.setState({
                                addProject : false
                            })
                            this.getUserList()
                        }else{
                            message.error(res.data.msg)
                        }
                    })
                }else{
                    // 新建
                    const addDate = {
                        project_name : values.project_name,
                        project_manager : values.project_manager,
                    }
                    api.axiosPost('createProject',addDate).then((res)=>{
                        if(res.data.code ===1){
                            message.success(res.data.msg)
                            this.setState({
                                addProject : false
                            })
                            this.getUserList()
                        }else{
                            message.error(res.data.msg)
                        }
                        
                    })
                }
                
            }
        })
    }
    // 删除弹窗
    isDelete = (record) =>{
        // console.log(record);
        
        this.setState({
            delete :true,
            rowData : record
        })
    }
    // 删除按钮 ---确认删除
    deleteOk = e =>{
        const deletDate = {
            id : this.state.rowData.id
        }
        api.axiosPost('delProject',deletDate).then((res)=>{
            if(res.data.code ===1){
                message.success(res.data.msg)
                this.setState({
                    delete : false
                })
                this.getUserList()
            }else{
                message.error(res.data.msg)
            }
        })
    } 
    // 日期
    DateChange = (dates, dateStrings) => {
        this.setState({
            start_time: dateStrings[0],
            end_time: dateStrings[1],
            dateRange: dates
        })
    }
    // input ===> onChange
    handleInputOnchange = (type, val) => {
        this.setState({
            [type]: val
        })
    }
    // input ===> onChange
    handleOnchange = (type, val) => {
        this.setState({
            [type]: val
        })
    }
    // 搜索按钮
    searchBtn = () => {
        const {project_name,project_manager,start_time,end_time} = this.state
        if(project_name === '' && project_manager === '' && start_time === '' && end_time === ''){
            message.error('您尚未设置筛选条件')
        }else{
            this.setState({
                page_number:1,
                page_size : 10,
                isSearch:true
            },()=>{this.getUserList(true)})
            
        }
    }
    // 分页数量切换
    onShowSizeChange = (number,size) =>{
        this.setState({
            page_number:number,
            page_size:size
        },()=>{this.getUserList()})
    }
    // 自定义分页结构
    /* itemRender = (current, type, originalElement) => {
        if (type === 'prev') {
            return <a className="ant-pagination-item-link">上一页</a>;
        }
        if (type === 'next') {
            return <a className="ant-pagination-item-link">下一页</a>;
        }
        return originalElement;
    } */
    render() {
        const { columns, tableData, page_number, spinning, page_size, total, dateRange,rowData,isSearch } = this.state;
        // 分页配置
        const pagination = {
            total: total,
            pageSize: page_size,
            current: page_number,
            onChange: (page,size) => {
                this.setState({ page_number: page,page_size:size, spinning: true }, () => {
                    if(isSearch){
                        this.getUserList(true)
                    }else{
                        this.getUserList(false)
                    }
                    
                })
                document.getElementById('root').scrollIntoView(true)
            }
        }
        return (
            <div className='project-main-box'>
                <div className='project-main-container'>
                    <div className='title'>
                        <span>项目列表</span>
                    </div>
                    <div className="project-search-box">
                        <div className="project-search-input">
                            <div className="input-box">
                    
                                &nbsp;项目名称：<Input className="name" placeholder="请输入项目名称" onChange={(e) => { this.handleInputOnchange('project_name', e.target.value) }}/>
                            </div>
                            <div className="input-box">
                                项目经理：<Input className="manager" placeholder="请输入经理名称"  onChange={(e) => { this.handleOnchange('project_manager', e.target.value) }}/>
                            </div>
                            <div className="input-box">
                                创建时间：
                                <RangePicker
                                    className="data"
                                    value={dateRange}
                                    format={dateFormat}
                                    onChange={this.DateChange}
                                />
                            </div>
                        </div>
                        <div className="project-search-btn">
                            <Button type="primary" onClick={() => { this.searchBtn() }}>搜索</Button>
                        </div>
                    </div>

                    {/* 数据明细 */}
                    <div className='table-title'>
                        <div className='table-title-font'>
                            {/* <i className='iconfont iconxiangmu'></i> */}
                            <img src={require('./../../image/xiangmuguanli.png')} className='busDepartment-img' alt=''/>
                            <div>项目总数：{this.state.total}</div>
                        </div>
                        <div className="addNew">
                            <Button className='btn-style' onClick={() => { this.isShowModal() }} style={{width:'100px'}}>新增项目</Button>
                        </div>
                    </div>
                    {/* 表格 */}
                    <div className="table-box">
                        <Table
                            columns={columns}
                            dataSource={tableData}
                            bordered
                            pagination={false}
                            rowClassName='th-font'
                        />
                    </div>
                    
                </div>
                {/* 分页 */}
                {
                    tableData.length === 0 ?'':
                    <div className="class-pagination-box">
                        <Pagination 
                            defaultCurrent={1} 
                            itemRender={this.itemRender} 
                            total={total}  
                            {...pagination} 
                            hideOnSinglePage={true} 
                            showSizeChanger 
                            showQuickJumper={{goButton: <Button className='pagination-btn'>确定</Button>}} 
                            onShowSizeChange={this.onShowSizeChange}
                        />
                    </div>
                }
                {/* 新建项目弹窗 */}
                <Modal
                    className='project-edit-model'
                    destroyOnClose //清空弹窗
                    title= {rowData ?"编辑项目":"新增项目"}
                    width='520px'
                    centered = {true}
                    maskClosable = {false}
                    visible={this.state.addProject}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <div className='project-btn'>
                            <Button key="back" onClick={this.handleCancel} style={{width:'80px',height:'40px'}}>
                                取消
                            </Button>
                            <Button key="submit" type="primary" onClick={this.handleOk} style={{width:'80px',height:'40px'}}>
                                保存
                            </Button>
                        </div>
                    ]}
                    >
                    <Projectform wrappedComponentRef={(e)=>{this.projectform = e}} rowData={rowData}/>
                </Modal>
                {/* 删除弹窗 */}
                <Modal
                    className='busUser-open-model'
                    destroyOnClose //清空弹窗
                    width='440px'
                    centered = {true}
                    closable = {false}
                    maskClosable = {false}
                    //title='删除项目'
                    visible={this.state.delete}
                    onOk={this.deleteOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <div className='busUser-edit-btn'>
                            <Button key="back" onClick={this.handleCancel} style={{width:'70px',height:'32px'}}>
                                取消
                            </Button>
                            <Button key="submit" type="primary" onClick={this.deleteOk} style={{width:'70px',height:'32px'}}>
                                确定
                            </Button>
                        </div>
                    ]}
                >   
                    {
                        <div className='delet-box'>
                            <Icon type="exclamation-circle" className="delet-icon"></Icon>
                            <span>确定删除项目"{rowData.project_name}"？</span>
                        </div>
                    }
                    {/* <div>确定删除项目"{rowData.project_name}"？</div> */}
                </Modal>
            </div>
        )
    }
}