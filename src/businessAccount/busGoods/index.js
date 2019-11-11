import React from "react";
import { Input, Button, Cascader, Table, Pagination,Select } from 'antd';
import api from './../../component/api'
import "./index.scss";


export default class busGoods extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                /* {
                    title: '序号',
                    dataIndex: 'num',
                    align: 'center'
                }, */
                {
                    title: '商品名称',
                    dataIndex: 'product_name',
                    //align: 'center'
                },
                {
                    title: '供应商',
                    dataIndex: 'merchant_name',
                    //align: 'center'
                },
                /* {
                    title: '商品货号',
                    dataIndex: 'article_number',
                    align: 'center'
                }, */
                {
                    title: '商品规格',
                    dataIndex: 'product_standards',
                    align: 'center',
                    width:'92px'
                },
                {
                    title: '所属分类',
                    dataIndex: 'class_name',
                    align: 'center',
                    width:'83px'
                },
                {
                    title: '单位',
                    dataIndex: 'unit',
                    align: 'center',
                    width:'49px'
                },
                {
                    title: '采购总量',
                    dataIndex: 'purchase_count',
                    align: 'center',
                    width:'77px'
                },
                {
                    title: '金额小计',
                    dataIndex: 'subtotal_price',
                    align: 'center',
                    width:'77px'
                },
            ],
            tableData: [],                // 表格数据
            page_number: 1,               // 页码
            spinning: false,              // 当前加载状态
            page_size: 10,                // 当前一页数据量
            total: 0,
            // ------------------- 搜索关键词
            product:'',
            projectList:[],
            project_name:undefined,       //  项目名称
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

    render() {
        const { columns, tableData, total, page_number, product, page_size,projectList,isSearch } = this.state;
        // 分页配置
        const pagination = {
            total: total,
            pageSize: page_size,
            current: page_number,
            onChange: (page,size) => {
                this.setState({ page_number: page,page_size:size, spinning: true }, () => {
                    if(isSearch){
                        this.getGoodsList(true)
                    }else{
                        this.getGoodsList(false)
                    }
                    
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        const { Option } = Select;
        const children = [];
        for (let i = 0; i < projectList.length; i++) {
            children.push(<Option key={i} value={projectList[i].class_id}>{projectList[i].class_name}</Option>);
        }
        return (
            <div className='goods-statistics-box'>
                <div className='goods-statistics-container'>
                    <div className='title'>
                        <span>商品统计</span>
                    </div>
                    <div className="statistics-search-box">
                        <div className="statistics-search-input">
                            <div className="input-box">
                                <Input placeholder="请输入商品名称" onChange={(e) => { this.handleInputOnchange('product', e.target.value) }} value={product} />
                            </div>
                            <div className="input-box">
                                {/* <Cascader 
                                    placeholder="所属分类"
                                    options={options}
                                    onChange={this.classifyOnChange}
                                /> */}
                                <Select placeholder="请选择所属分类" className="width-250" onChange={this.onChangeProject} value = {this.state.project_name}>
                                    {children}
                                </Select>
                            </div>
                        </div>
                        <div className="statistics-search-btn">
                            <Button type="primary" onClick={() => { this.searchBtn() }}>搜索</Button>
                            <Button type="primary" onClick={() => { this.resetBtn() }}>重置</Button>
                        </div>
                    </div>
                    <div className='table-title'>
                        <div className='table-title-font'>
                            {/* <i className='iconfont icondingdanguanli'></i> */}
                            <img src={require('./../../image/shangpitongji.png')} className='busDepartment-img goods-img' alt=''/>
                            <div className='mt20'>商品总数：{total}</div>
                        </div>
                    </div>
                    <div className="table-box goods-table-box">
                        <Table
                            columns={columns}
                            dataSource={tableData}
                            bordered
                            pagination={false}
                            className='text-center'
                        />
                    </div>
                    {
                        tableData.length === 0?'':
                        <div className="statistics-page">
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
            </div>
        )
        
    }
    
    componentDidMount(){
        this.getCategory()
        this.getGoodsList(false)
    }
    // 获取商品统计列表
    getGoodsList = (overall) =>{
        const {page_number,page_size,product,project_name} = this.state
        const data = {
            page_number : page_number,
            page_size : page_size,
            product : overall && product ? product : '',
            class_id : overall && project_name ? `${project_name}` :'',
        }
        api.axiosPost('productStatistics',data).then((res)=>{
            if(res.data.code ===1){
                this.setState({
                    tableData : res.data.data.statistics_list,
                    total : res.data.data.total_row
                })
            }
        })
    }
    // 获取商品统计 所属分类
    getCategory = (e) =>{
        const data = {}
        api.axiosPost('getOrderGoodsClass',data).then((res)=>{
            if(res.data.code ===1){
                this.setState({
                    projectList : res.data.data
                })
            }
        })
    }
    // 获取所属分类 下拉框
    onChangeProject = (value) =>{
        //console.log(`selected ${value}`);
        this.setState({project_name : value})
    }
    // 获取商品名称
    handleInputOnchange = (type, val) => {

        this.setState({
            [type]: val
        })
        
    }
    
    // 搜索按钮
    searchBtn = () => {
        this.setState({
            page_number:1,
            page_size : 10,
            isSearch : true
        },()=>{this.getGoodsList(true)})
        
    }

    // 重置按钮
    resetBtn = () =>{
        this.setState({
            page_number:1,
            page_size : 10,
            isSearch : false,
            product:'',
            project_name:undefined,
        },()=>{this.getGoodsList()})
        
    }
    // 分页数量切换
    onShowSizeChange = (number,size) =>{
        this.setState({
            page_number:number,
            page_size:size
        },()=>{this.getGoodsList()})
    }
}