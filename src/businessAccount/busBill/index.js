import React from "react";
import {Table,Input,Select,Button,message,Switch,Modal,Pagination} from "antd"
import "./index.scss";
import WinButton from "../../components/winButton/index"
import api from "../../component/api";

export default class busBill extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            columns:[
                {
                    title: '操作人',
                    dataIndex: 'operator',
                    align: 'center'
                },
                {
                    title: '恢复日期',
                    dataIndex: 'create_time',
                    align: 'center'
                },
                {
                    title: '恢复金额',
                    dataIndex: 'price',
                    align: 'center'
                },
                {
                    title: '恢复后可用账期(元)',
                    dataIndex: 'remain_amount',
                    align: 'center'
                },
                {
                    title: '账期状态',
                    dataIndex: 'bill_state',
                    align: 'center'
                },
                
            ],
            data:[],
            allData:'',             //  所有数据
            page_number: 1,        //  当前页码
            page_size: 10,         //  每页显示数量
            total:0,
        }
    }

    render(){
        const {columns,data,total,page_size,page_number,allData} = this.state
        // 分页配置
        const pagination={
            total:total,
            pageSize:page_size,
            current:page_number,
            onChange:(page,size)=>{
                this.setState({page_number:page,page_size:size,spinning:true},()=>{
                    this.getBillStatistics()
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        return(
            <div className='busBill-box'>
                <div className='busBill-container'>
                    <div className='title'>
                        <span>账单管理</span>
                    </div>
                    <div className='table-title'>
                        <div className='table-title-font'>
                            {/* <i className='iconfont iconwj-zd'></i> */}
                            <img src={require('./../../image/zhangdangguanli.png')} className='busDepartment-img busBill-img' alt=''/>
                            <div>帐期恢复次数：{allData.total_row}</div>
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
                    {
                        data.length === 0 ?"":
                        <div className="class-pagination-box">
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
            </div>
        )
    }
    componentDidMount(){
        this.getBillStatistics()
    }
    // 账单统计列表
    getBillStatistics = e =>{
        const {page_size,page_number} = this.state
        const data = {
            page_number : page_number,
            page_size : page_size
        }
        api.axiosPost('billStatistics',data).then((res)=>{
            if(res.data.code === 1){
                this.setState({
                    data : res.data.data.bill_list,
                    allData : res.data.data,
                    total : res.data.data.total_row
                })
            }
        })
    }
    // 分页数量切换
    onShowSizeChange = (number,size) =>{
        this.setState({
            page_number:number,
            page_size:size
        },()=>{this.getBillStatistics()})
    }
}