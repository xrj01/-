import React from "react";
import { Input, Button, Cascader, Table, Pagination } from 'antd';
import "./index.scss";
import WinButton from "../../components/winButton/index"

export default class busGoods extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '序号',
                    dataIndex: 'a',
                    align: 'center'
                },
                {
                    title: '商品货号',
                    dataIndex: 'b',
                    align: 'center'
                },
                {
                    title: '商品名称',
                    dataIndex: 'c',
                    align: 'center'
                },
                {
                    title: '商品规格',
                    dataIndex: 'd',
                    align: 'center'
                },
                {
                    title: '所属分类',
                    dataIndex: 'e',
                    align: 'center'
                },
                {
                    title: '单位',
                    dataIndex: 'f',
                    align: 'center'
                },
                {
                    title: '价格',
                    dataIndex: 'h',
                    align: 'center'
                },
                {
                    title: '采购总量',
                    dataIndex: 'g',
                    align: 'center'
                },
                {
                    title: '金额小计',
                    dataIndex: 'q',
                    align: 'center'
                },
            ],
            tableData: [],                // 表格数据
            page_number: 0,               // 页码
            spinning: false,              // 当前加载状态
            page_size: 10,                // 当前一页数据量
            total: 0,

        }
    }
    // 自定义分页结构
    itemRender = (current, type, originalElement) => {
        if (type === 'prev') {
            return <a className="ant-pagination-item-link">上一页</a>;
        }
        if (type === 'next') {
            return <a className="ant-pagination-item-link">下一页</a>;
        }
        return originalElement;
    }

    render() {
        const { columns, tableData, total, page_number, spinning, page_size } = this.state;
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
        return (
            <div className='goods-statistics-box'>
                <div className='goods-statistics-container'>
                    <div className='title'>
                        <span>商品统计</span>
                    </div>
                    <div className="statistics-search-box">
                        <div className="statistics-search-input">
                            <div className="input-box">
                                <Input placeholder="商品名称" />
                            </div>
                            <div className="input-box">
                                <Cascader placeholder="所属分类" />
                            </div>
                        </div>
                        <div className="statistics-search-btn">
                            <Button type="primary" onClick={() => { }}>搜索</Button>
                            <Button type="primary" onClick={() => { }}>重置</Button>
                        </div>
                    </div>
                    <div className='table-title'>
                        <div className='table-title-font'>
                            <i className='iconfont icondingdanguanli'></i>
                            <div className='mt20'>用户总数：200</div>
                        </div>
                    </div>
                    <div className="table-box">
                        <Table
                            columns={columns}
                            dataSource={tableData}
                            bordered
                            pagination={false}
                        />
                    </div>
                    <div className="statistics-page">
                        <Pagination defaultCurrent={1} itemRender={this.itemRender} total={total}  {...pagination} hideOnSinglePage={true}/>
                    </div>
                    <WinButton />
                </div>
            </div>
        )
    }
}