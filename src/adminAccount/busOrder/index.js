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
                {
                    title: '序号',
                    dataIndex: 'num',
                    align: 'center'
                },
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
                    align: 'center'
                },
                {
                    title: '订单状态',
                    dataIndex: 'state',
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
                                    :text =='-3'?'-3已驳回'
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
                                <div className='table-btn'>
                                    <span onClick={()=>{this.showModal(record,true,'add')}}>查看订单</span> 
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
            stateArr:[],            //状态列表
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
        const {projectList,stateArr} = this.state
        const { Option } = Select;
        const children = [];
        const childrenOrder = [];
        
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
        const { page_number, page_size, total, dateRange, order_info, columns,tableData,} = this.state;
        // 分页配置
        const pagination={
            total:total,
            pageSize:page_size,
            current:page_number,
            onChange:(page)=>{
                this.setState({page_number:page,spinning:true},()=>{
                    this.getOrderList()
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
                            <i className='iconfont icondingdanguanli'></i>
                            <div className='mt20'>订单总数：{total}</div>
                        </div>
                        <div className="addNew">
                        </div>
                    </div>
                    {/* 表格 */}
                    <div className="table-box">
                        <Table 
                            columns={columns} 
                            dataSource={tableData} 
                            bordered
                            pagination = {false}
                            hideDefaultSelections={true}
                            loading={this.state.tableLoading}
                        />
                    </div>
                    <div className="class-pagination-box">
                        {/* <Pagination defaultCurrent={1} {...pagination} showQuickJumper/> */}
                        <Pagination defaultCurrent={1} total={total}  {...pagination} hideOnSinglePage={true}/>
                    </div>
                    
                </div>
            </div>
        )
    }
    componentDidMount(){
        this.getOrderList()
    }
    // 获取订单列表
    getOrderList = e =>{
        const {page_number,page_size,order_info,project_name,state,begin_time,end_time} = this.state
        const data = {
            page_number : page_number,
            page_size : page_size,
            order_info: order_info,
            project_name: project_name ? project_name : '',
            state: state || state == 0 ? `${state}`: '',
            begin_time:begin_time,
            end_time:end_time
        }
        api.axiosPost('orderManage',data).then((res)=>{
            // 下拉框项目数据
            let project = []
            let state =[]
            res.data.data.order_list.map((item)=>{
                state.push(item.state)
                project.push(item.project_name)
            })
            let arr = new Set(project)
            let projectList =[]
            arr.map((item)=>{
                let obj ={
                    project_name : item
                }
                projectList.push(obj)
            })
            // 下拉框状态数据
            let arr1 = new Set(state)
            let stateArr =[]
            arr1.map((item)=>{
                let obja ={
                    state : item
                }
                stateArr.push(obja)
            })
            
            
            if(res.data.code ===1){
                this.setState({
                    total : res.data.data.total_row,
                    tableData : res.data.data.order_list,
                    projectList,
                    stateArr
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
        this.getOrderList()
    }

    // 重置按钮
    resetBtn = () =>{
        this.setState({
            order_info : '',
            begin_time : '',
            end_time : '',
            dateRange : [null,null],
            project_name : undefined,
            state : undefined
        },()=>{this.getOrderList()})
        
    }
}