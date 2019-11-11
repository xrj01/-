import React from "react";
import { Statistic, Icon, Table } from 'antd';
import "./index.scss";
import WinButton from "../../components/winButton/index"

export default class busConsume extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [],    // 表格数据
            projectTableData: [],  // 项目统计表格数据
            columns: [
                {
                    title: '采购员',
                    dataIndex: '',
                    align: 'center'
                },
                {
                    title: '授信额度(元)',
                    dataIndex: '',
                    align: 'center'
                },
                {
                    title: '已用额度(元)',
                    dataIndex: '',
                    align: 'center'
                },
                {
                    title: '可用额度(元)',
                    dataIndex: '',
                    align: 'center'
                },
                {
                    title: '累计使用总额(元)',
                    dataIndex: '',
                    align: 'center'
                },
                
            ],
            projectColumns: [
                {
                    title: '项目',
                    dataIndex: '',
                    align: 'center',
                    width: '473px'
                },
                {
                    title: '累计使用总额(元)',
                    dataIndex: '',
                    align: 'center',
                    width: '473px'
                }
            ]
        }
    }

    render() {
        const { columns, tableData, projectColumns, projectTableData } = this.state;
        return (
            <div className='consume-statistics-box'>
                <div className='consume-statistics-container'>
                    <div className='title'>
                        <span>消费统计</span>
                    </div>
                    <div className='table-title'>
                        <div className='table-title-font'>
                            <i className='iconfont iconzhangqi'></i>
                            <div>账期总览</div>
                        </div>
                    </div>
                    <div className="consume-statistics-overview">
                        <div>
                            <Statistic
                                title="授信总额（元）"
                                value={112893}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="剩余可用总额（元）"
                                value={112893}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="已用账期总额（元）"
                                value={112893}
                            />
                        </div>
                        <div>
                            <Statistic
                                title="待还账期总额（元）"
                                value={112893}
                                className="returned-money"
                            />
                        </div>
                        <div>
                            <Statistic
                                title="累计还款总额（元）"
                                value={112893}
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
                <WinButton />
            </div>
        )
    }
}