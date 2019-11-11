import React from "react";
import { Input, Button, DatePicker,Pagination, Select , Icon, Table, Divider, Cascader, message, Empty, Modal ,Tree} from "antd";
import { Link } from "react-router-dom";
import api from "../../component/api";
import "./index.scss";
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD'; // 规定日期选择器的格式
export default class busOrder extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            // 列表表头信息
            columns: [
                /* {
                    title: '序号',
                    dataIndex: 'num',
                    align: 'center'
                }, */
                {
                    title: '子订单编号',
                    dataIndex: 'sub_order_num',
                    align: 'center',
                    render: (text)=>{
                        return(
                            <Link to={`/BusinessAccount/SonOrder?${text}`}>{text}</Link>
                        )
                    }
                },
                {
                    title: '关联父订单编号',
                    dataIndex: 'parent_order_num',
                    align: 'center',
                    render: (text)=>{
                        return(
                            <Link to={`/BusinessAccount/ParentOrder?${text}`}>{text}</Link>
                        )
                    }
                },
                {
                    title: '下单时间',
                    dataIndex: 'create_time',
                    width: '105px',
                    align: 'center'
                },
                {
                    title: '所属项目',
                    dataIndex: 'project_name',
                    align: 'center',
                    render:(text,record)=>{
                        return(
                            <div>
                                {
                                    text ? text : '-'
                                }
                            </div>
                        )
                    }
                },
                {
                    title: '下单人',
                    dataIndex: 'buyer_name',
                    align: 'center'
                },
                {
                    title: '订单金额',
                    dataIndex: 'order_price',
                    width: '83px',
                    align: 'center'
                },
                {
                    title: '订单状态',
                    dataIndex: 'state',
                    width: '83px',
                    align: 'center',
                    render:(text,record) => {
                        return(
                            <div>
                                { 
                                    text =='0'?'待提交'
                                    :text =='1'?'待付款'
                                    :text =='2'?'待发货'
                                    :text =='3'?'已发货'
                                    :text =='4'?'已完成'
                                    :text =='-1'?'已取消'
                                    :text =='-2'?'已关闭'
                                    :text =='-3'?'已驳回'
                                    :''
                                }
                            </div>
                        )
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    align: 'center',
                    width: '100px',
                    render: (text, record) => {
                        return (
                            <div>
                                <div className='table-btn table-check-order'>
                                    <Link to={`/BusinessAccount/SonOrder?${record.sub_order_num}`}>查看订单</Link> 
                                </div>
                            </div>
                        )
                    }
                }
            ],
            // 表格数据
            tableData: [],

            page_number: 1,        //  当前页码
            page_size: 10,         //  每页显示数量
            total:0,
            
            select : undefined,
            dateRange: [null, null],         //  时间范围
            // ------------------- 搜索关键词
            //stateArr:[],            //状态列表
            projectList:[],         //项目列表
            order_info: '',              //  下单人、订单编号
            address: '',           //  地址
            begin_time: '',        //  开始时间
            end_time: '',          //  结束时间
            state:undefined,              //  订单状态
            project_name:undefined,       //  项目名称
        }
    }

    render(){
        // 动态加载下拉数据
        const {projectList} = this.state
        const { Option } = Select;
        const children = [];
        const childrenOrder = [];
        //状态下拉框数据
        const stateArr = [{state:0},{state:1},{state:2},{state:3},{state:4},{state:-1},{state:-2},{state:-3},]

        for (let i = 0; i < projectList.length; i++) {
            children.push(<Option key={i} value={projectList[i].project_name}>{projectList[i].project_name}</Option>);
        }
        for (let i = 0; i < stateArr.length; i++) {
            childrenOrder.push( <Option key={i} value={stateArr[i].state}>
                                    {
                                        stateArr[i].state == '0'?'待提交'
                                        :stateArr[i].state == '1'?'待付款'
                                        :stateArr[i].state == '2'?'待发货'
                                        :stateArr[i].state == '3'?'已发货'
                                        :stateArr[i].state == '4'?'已完成'
                                        :stateArr[i].state == '-1'?'已取消'
                                        :stateArr[i].state == '-2'?'已关闭'
                                        :stateArr[i].state == '-3'?'已驳回'
                                        :''
                                    }
                                </Option>);
        }
        const { page_number, page_size, total, dateRange, order_info, columns,tableData,isSearch} = this.state;
        // 分页配置
        const pagination={
            total:total,
            pageSize:page_size,
            current:page_number,
            onChange:(page,size)=>{
                this.setState({page_number:page,page_size:size,spinning:true},()=>{
                    if(isSearch){
                        this.getOrderList(true)
                    }else{
                        this.getOrderList(false)
                    }
                    
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        return(
            <div className='busOrder-box'>
                <div className='busOrder-container'>
                    <div className='title'>
                        <span>订单管理</span>
                    </div>
                    <div className='busOrder-nav'>
                        <div className='busOrder-nav-input'>
                            <div className='marginR'>   
                                <Input className="width-152" onChange={(e) => { this.handleInputOnchange('order_info', e.target.value) }} value={order_info} placeholder="下单人/订单编号"></Input>
                            </div>
                            <div className='marginR'>
                                <Select placeholder="项目名称" className="width-168" onChange={this.onChangeProject} value = {this.state.project_name}>
                                    {children}
                                </Select>
                            </div>
                            <div className='marginR'>
                                <Select placeholder="订单状态" className="width-100" onChange={this.onChangeOrder} value = {this.state.state}>
                                    {childrenOrder}
                                </Select>
                            </div>
                            <div className='marginR'>
                                下单时间：
                                <RangePicker
                                    style={{width:230}}
                                    value={dateRange}
                                    format={dateFormat}
                                    onChange={this.DateChange}
                                />
                            </div>
                        </div>
                        <div className='busOrder-nav-btn'>
                            <Button type="primary" onClick={() => { this.searchBtn() }}>搜索</Button>
                            <Button type="primary" onClick={() => { this.resetBtn() }}>重置</Button>
                        </div>
                    </div>
                    <div className='table-title'>
                        <div className='table-title-font'>
                            {/* <i className='iconfont icondingdanguanli'></i> */}
                            <img src={require('./../../image/shangpitongji.png')} className='busDepartment-img goods-img' alt=''/>
                            <div className='mt20'>订单总数：{total}</div>
                        </div>
                        <div className="addNew">
                        </div>
                    </div>
                    {/* 表格 */}
                    <div className="busOrder-table-box">
                        <Table 
                            columns={columns} 
                            dataSource={tableData} 
                            bordered
                            pagination = {false}
                            hideDefaultSelections={true}
                            loading={this.state.tableLoading}
                        />
                    </div>
                    {
                        tableData.length === 0 ?"":
                        <div className="class-pagination-box">
                            <Pagination 
                                defaultCurrent={1}  
                                {...pagination} 
                                hideOnSinglePage={true} 
                                showSizeChanger 
                                showQuickJumper={{goButton: <Button className='pagination-btn'>确定</Button>}} 
                                onShowSizeChange={this.onShowSizeChange}
                            />
                        </div>
                    }
                    
                    
                </div>
            </div>
        )
    }
    componentDidMount(){
        this.getProjectList()
        this.getOrderList(false)
    }
    // 获取订单列表
    getOrderList = (overall) =>{
        const {page_number,page_size,order_info,project_name,state,begin_time,end_time} = this.state
        const data = {
            page_number : page_number,
            page_size : page_size,
            order_info: overall && order_info ? order_info : '',
            project_name: overall && project_name ? project_name : '',
            state: overall && (state || state == 0) ? `${state}`: '',
            begin_time: overall && begin_time ? begin_time :'',
            end_time: overall && end_time ? end_time : ''
        }
        api.axiosPost('orderManage',data).then((res)=>{
            
            if(res.data.code ===1){
                this.setState({
                    total : res.data.data.total_row,
                    tableData : res.data.data.order_list,

                })
            }
        })
    }
    // 获取项目名称 下拉数据
    getProjectList = e =>{
        const data = {}
        api.axiosPost('projectAll',data).then((res)=>{
            if(res.data.code === 1){
                this.setState({
                    projectList : res.data.data
                })
            }
        })
    }
    // 获取订单状态 下拉框
    onChangeOrder = (value) => {
        // console.log(`selected ${value}`);
        this.setState({state : value})
    }
    // 获取项目名称 下拉框
    onChangeProject = (value) =>{
        //console.log(`selected ${value}`);
        this.setState({project_name : value})
    }
    // 获取下单人、订单编号信息
    handleInputOnchange = (type, val) => {

        this.setState({
            [type]: val
        })
        
    }
    // 日期
    DateChange = (dates, dateStrings) => {
        this.setState({
            begin_time: dateStrings[0],
            end_time: dateStrings[1],
            dateRange: dates
        })
    }
    // 搜索按钮
    searchBtn = () => {
        const {state,project_name,order_info,begin_time,end_time} = this.state
        if(order_info ==='' && begin_time ==='' && end_time ==='' && state ===undefined && project_name ===undefined){
            message.error('您尚未设置搜索条件')
        }else{
            this.setState({
                page_number:1,
                page_size : 10,
                isSearch : true
            },()=>{this.getOrderList(true)})
        }
        
        
    }

    // 重置按钮
    resetBtn = () =>{
        this.setState({
            page_number:1,
            page_size : 10,
            isSearch : false,
            order_info : '',
            begin_time : '',
            end_time : '',
            dateRange : [null,null],
            project_name : undefined,
            state : undefined
        },()=>{this.getOrderList()})
        
    }
    // 分页数量切换
    onShowSizeChange = (number,size) =>{
        this.setState({
            page_number:number,
            page_size:size
        },()=>{this.getOrderList()})
    }
}