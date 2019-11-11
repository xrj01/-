
import React from "react";
import {Table,Input,Select,Button,message,Switch,Modal,Radio,Statistic,Pagination} from "antd"
import "./index.scss";
import WinButton from "../../components/winButton/index"
import api from "../../component/api";

export default class busStatistics extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            columns:[
                {
                    title: '日期',
                    dataIndex: 'level',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '订单总数',
                    dataIndex: 'department',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '订单总额',
                    dataIndex: 'member_count',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '有效订单总数',
                    dataIndex: 'create_time',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '有效订单总额',
                    dataIndex: 'create_time',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '取消订单总数',
                    dataIndex: 'create_time',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '取消订单总额',
                    dataIndex: 'create_time',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '已完成订单总数',
                    dataIndex: 'create_time',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '已完成订单总额',
                    dataIndex: 'create_time',
                    align: 'center',
                    className: 'th-font'
                },
                
                
            ],
            data:[],
            page_number: 1,               // 页码
            spinning: false,              // 当前加载状态
            page_size: 10,                // 当前一页数据量
            total: 0,
        }
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

    render(){
        const {columns,data,page_number,spinning,page_size, total} = this.state;
        // 分页配置
        const pagination = {
            total: total,
            pageSize: page_size,
            current: page_number,
            onChange: (page) => {
                this.setState({ page_number: page, spinning: true }, () => {
                    // this.getUserList()
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        return(
            <div className='busStatistics-box'>
                <div className='busStatistics-container'>
                    <div className='title'>
                        <span>订单统计</span>
                    </div>
                    <div className="data-filter-btn-box">
                        <Radio.Group className='busStatistics-container-box'>
                            <Radio.Button onClick={this.seven}>最近7天</Radio.Button>
                            <Radio.Button value="default" onClick={this.thirty}>最近30天</Radio.Button>
                            <Radio.Button value="small">最近90天</Radio.Button>
                        </Radio.Group>
                    </div>
                    {/* 订单总览 */}
                    <div className='table-title'>
                        <div>
                            <div>订单总览</div>
                        </div>
                    </div>
                    <div className="busStatistics-overview margin-b-20">
                        <div>
                            <Statistic
                                title="订单总额"
                                value={112893}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="有效订单总额"
                                value={112893}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="取消订单总额"
                                value={112893}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="已完成订单总额"
                                value={112893}
                                className="returned-money"
                            />
                        </div>
                        <div>
                            <Statistic
                                title="驳回订单总额"
                                value={112893}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="订单总数 /人"
                                value={112893}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="有效订单总数"
                                value={112893}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="取消订单总数"
                                value={112893}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="已完成订单总数"
                                value={112893}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="驳回订单总数"
                                value={112893}
                            />
                        </div>
                    </div>
                    {/* 数据明细 */}
                    <div className='table-title'>
                        <div>
                            <div>数据明细</div>
                        </div>
                    </div>
                    {/* 表格 */}
                    <div className="table-box">
                        <Table 
                            columns={columns} 
                            dataSource={data} 
                            bordered
                            rowClassName='th-font'
                        />
                    </div>
                    {/* 分页 */}
                    <div className="busStatistics-page">
                        <Pagination defaultCurrent={1} itemRender={this.itemRender} total={total}  {...pagination} hideOnSinglePage={true} />
                    </div>
            </div>
               <WinButton/>
            </div>
        )
    }
    componentDidMount(){
        this.getOrderList()
    }
    // 获取订单列表
    getOrderList = e =>{
        const {page_number,page_size,total} = this.state
        const data = {
            page_number : page_number,
            page_size : page_size,
            order_info:'',
            project_name:'',
            state:'',
            begin_time:'',
            end_time:''
        }
        api.axiosPost('orderManage',data).then((res)=>{
            if(res.data.code ===1){
                this.setState({
                    total : res.data.data.total_row
                })
            }
        })
    }
    seven(){
        // console.log(111);
        
    }
    thirty(){
        // console.log(222);
        
    }
}