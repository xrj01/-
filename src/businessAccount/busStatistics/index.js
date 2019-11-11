
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
                    dataIndex: 'order_date',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '订单总数',
                    dataIndex: 'total_order',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '订单总额',
                    dataIndex: 'total_order_price',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '有效订单总数',
                    dataIndex: 'total_valid_order',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '有效订单总额',
                    dataIndex: 'total_valid_price',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '取消订单总数',
                    dataIndex: 'cancel_order',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '取消订单总额',
                    dataIndex: 'cancel_order_price',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '已完成订单总数',
                    dataIndex: 'done_order',
                    align: 'center',
                    className: 'th-font'
                },
                {
                    title: '已完成订单总额',
                    dataIndex: 'done_order_price',
                    align: 'center',
                    className: 'th-font'
                },
                
                
            ],
            orderData:{},
            data:[],
            date_seven:'',
            date_month:'',
            date_ninety:'',
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
        const {columns,data,page_number,spinning,page_size, total,orderData} = this.state;
        // 分页配置
        const pagination = {
            total: total,
            pageSize: page_size,
            current: page_number,
            onChange: (page,size) => {
                this.setState({ page_number: page,page_size:size, spinning: true }, () => {
                    this.getOrderList()
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
                            <Radio.Button onClick={this.all}>全部</Radio.Button>
                            <Radio.Button value="a" onClick={this.seven}>最近7天</Radio.Button>
                            <Radio.Button value="default" onClick={this.thirty}>最近30天</Radio.Button>
                            <Radio.Button value="small" onClick={this.ninety}>最近90天</Radio.Button>
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
                                value={orderData.total_order_price}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="有效订单总额"
                                value={orderData.total_valid_price}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="取消订单总额"
                                value={orderData.cancel_order_price}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="已完成订单总额"
                                value={orderData.done_order_price}
                                className="returned-money"
                            />
                        </div>
                        <div>
                            <Statistic
                                title="驳回订单总额"
                                value={orderData.reject_order_price}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="订单总数 /人"
                                value={orderData.total_order_count}
                                suffix={`/ ${orderData.user_count?orderData.user_count:0}`}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="有效订单总数"
                                value={orderData.total_valid_count}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="取消订单总数"
                                value={orderData.cancel_order_count}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="已完成订单总数"
                                value={orderData.done_order_count}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="驳回订单总数"
                                value={orderData.reject_order_count}
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
                            pagination = {false}
                        />
                    </div>
                    {/* 分页 */}
                    {
                        data.length === 0 ? <div className="busStatistics-page"></div>: 
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
        const {page_number,page_size,total,date_ninety,date_seven,date_month} = this.state
        const data = {
            page_number : page_number,
            page_size : page_size,
            date_seven : date_seven,
            date_month : date_month,
            date_ninety : date_ninety
        }
        api.axiosPost('orderStatistics',data).then((res)=>{
            if(res.data.code ===1){
                this.setState({
                    orderData : res.data.data,
                    total : res.data.data.total_row,
                    data : res.data.data.order_statistics
                })
            }
        })
    }
    all = () =>{
        this.setState({
            date_seven :'',
            date_month:'',
            date_ninety:''
        },()=>{this.getOrderList()})
        
    }
    seven = () =>{
        this.setState({
            date_seven :'7',
            date_month:'',
            date_ninety:''
        },()=>{this.getOrderList()})
        
    }
    thirty = () =>{
        // console.log(1111);
        
        this.setState({
            date_seven :'',
            date_month:'30',
            date_ninety:''
        },()=>{this.getOrderList()})
    }
    ninety = () =>{
        this.setState({
            date_seven : '',
            date_month:'',
            date_ninety:'90'
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