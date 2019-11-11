import React from "react";
import {Table,Input,Select,Button,message,Switch,Modal,Pagination} from "antd"
import "./index.scss";
import WinButton from "../../components/winButton/index"

export default class busBill extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            columns:[
                {
                    title: '操作人',
                    dataIndex: 'level',
                    align: 'center'
                },
                {
                    title: '恢复日期',
                    dataIndex: 'department',
                    align: 'center'
                },
                {
                    title: '恢复金额',
                    dataIndex: 'member_count',
                    align: 'center'
                },
                {
                    title: '恢复后可用账期',
                    dataIndex: 'create_time',
                    align: 'center'
                },
                {
                    title: '账期状态',
                    dataIndex: 'create_time',
                    align: 'center'
                },
                
            ],
            data:[],

            page_number: 1,        //  当前页码
            page_size: 10,         //  每页显示数量
            total:0,
        }
    }

    render(){
        const {columns,data,total,page_size,page_number} = this.state
        // 分页配置
        const pagination={
            total:total,
            pageSize:page_size,
            current:page_number,
            onChange:(page)=>{
                this.setState({page_number:page,spinning:true},()=>{
                    //this.getUserList()
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
                            <i className='iconfont iconwj-zd'></i>
                            <div>帐期恢复次数：</div>
                        </div>
                    </div>
                    {/* 表格 */}
                    <div className="table-box">
                        <Table 
                            columns={columns} 
                            dataSource={data} 
                            bordered
                        />
                    </div>
                    <div className="class-pagination-box">
                        <Pagination defaultCurrent={1} total={total}  {...pagination} hideOnSinglePage={true}/>
                    </div>
                </div>
            </div>
        )
    }
}