import React from "react";
import { Statistic, Icon, Table } from 'antd';
import "./index.scss";
import api from "../../component/api";

export default class busConsume extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allData : '',       // 所有数据
            tableData: [],    // 表格数据
            projectTableData: [],  // 项目统计表格数据
            columns: [
                {
                    title: '采购员',
                    dataIndex: 'real_name',
                    align: 'center'
                },
                {
                    title: '授信额度(元)',
                    dataIndex: 'sub_credit',
                    align: 'center'
                },
                {
                    title: '已用额度(元)',
                    dataIndex: 'have_used_credit',
                    align: 'center'
                },
                {
                    title: '可用额度(元)',
                    dataIndex: 'remain_credit',
                    align: 'center'
                },
                {
                    title: '累计使用总额(元)',
                    dataIndex: 'sub_used_credit',
                    align: 'center'
                },
                
            ],
            projectColumns: [
                {
                    title: '项目',
                    dataIndex: 'project_name',
                    align: 'center',
                    width: '473px'
                },
                {
                    title: '累计使用总额(元)',
                    dataIndex: 'priject_used_credit',
                    align: 'center',
                    width: '473px'
                }
            ]
        }
    }

    render() {
        const { columns, tableData, projectColumns, projectTableData ,allData} = this.state;
        return (
            <div className='consume-statistics-box'>
                <div className='consume-statistics-container'>
                    <div className='title'>
                        <span>消费统计</span>
                    </div>
                    <div className='table-title'>
                        <div className='table-title-font'>
                            {/* <i className='iconfont iconzhangqi'></i> */}
                            <img src={require('./../../image/xiaofeitongji.png')} className='busDepartment-img consume-img' alt=''/>
                            <div>账期总览</div>
                        </div>
                    </div>
                    <div className="consume-statistics-overview">
                        <div>
                            <Statistic
                                title="授信总额（元）"
                                value={allData.credit}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="剩余可用总额（元）"
                                value={allData.total_remain_credit}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="已用账期总额（元）"
                                value={allData.used_credit}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="待还账期总额（元）"
                                value={allData.wait_repayment_credit}
                                className="returned-money"
                            />
                        </div>
                        <div>
                            <Statistic
                                title="累计还款总额（元）"
                                value={allData.repayment_credit}
                            />
                        </div>
                    </div>
                    <div className="table-box margin-b-40">
                        <Table 
                            columns={columns}
                            dataSource={tableData}
                            bordered
                            pagination={false}
                        />
                    </div>
                    <div className="table-box padding-b-40">
                        <Table 
                            columns={projectColumns}
                            dataSource={projectTableData}
                            bordered
                            pagination={false}
                            // className=""
                        />
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount(){
        this.getconsumeStatistics()
    }
    // 获取消费统计列表
    getconsumeStatistics = e =>{
        const data ={}
        api.axiosPost('consumeStatistics',data).then((res)=>{
            if(res.data.code ===1){
                this.setState({
                    allData : res.data.data,
                    tableData : res.data.data.sub_list,
                    projectTableData : res.data.data.project_list,
                })
            }
            
        })
    }
    
}