import React from "react";
import "./index.scss";
import Nav from "./../components/nav";
import { observer,inject } from 'mobx-react';
import { Pagination , Spin } from "antd";
import SeaechListL from "./searchListList/SearchListL"
import PriceComponents from "./../components/priceComponents/index"
import SearchNull from "./../components/noList/null";
import Head_Breadcrumb from "./head_Breadcrumb/head_Breadcrumb";
import Footer from './../components/footer/newFootHelp/Footer';
import "./index.scss"
@inject("store")
@observer
// ↓ ---------------------- 搜索页面接口数据 ----------------------------
 class SearchList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            page_number:1,
            page_size:20,
            total:0,
            value:"",
        }
    }
    // ↓ ------------ 搜索页面请求数据 ---------------------
    getServerList=(value,page_number,page_size)=>{
        const {store} = this.props;
        store.seachDataBus.getSearchList(value,page_number,page_size);
    };

    componentDidMount(){
        const value = sessionStorage.getItem('SL-inputData');
        this.getServerList(value);
        this.setState({
            searchValue:value
        })
    }

    render(){
        const {store} = this.props;
        const {searchValue} = this.state;
        const listData = store.seachDataBus.serverListData;
        const total = store.seachDataBus.serverListTotal;
        const isNull = store.seachDataBus.isNull;
        const page_number = store.seachDataBus.page_number;
        const spinning = store.seachDataBus.spinning;
        const pagination={
            current:page_number,
            pageSize:this.state.page_size,
            total:total,
            hideOnSinglePage:true,
            onChange:(page)=>{
                this.setState({
                    page_number:page
                },()=>{
                    const {page_number} = this.state;
                    const value = sessionStorage.getItem('SL-inputData');
                    this.getServerList(value,page_number)
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        return(
            <div className="searchList_box">
                <Nav searchValue={searchValue} isFixed={true}/>
                <Spin tip="数据加载中..." spinning={spinning}>
                    <div className="search-list-box">
                        <Head_Breadcrumb data = {store.searchBus.inputer_data}/>
                        <SeaechListL listData={listData}/>
                        {
                            listData && listData.length == 0 && isNull && <div style={{height:380,marginBottom:20,background:'#fff'}}><SearchNull data={store.searchBus.inputer_data}/></div>
                        }
                        {
                            total > 0 &&
                            <div className="search-pagination-box">
                                <Pagination {...pagination}/>
                            </div>
                        }
                        <PriceComponents/>
                    </div>
                </Spin>
                <Footer/>
            </div>
        )
    }
}export default SearchList