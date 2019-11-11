import React from "react";
import {Link, Route} from 'react-router-dom';
import {Button,Pagination,Icon,message} from "antd";
import Nav from "./../components/nav"
import Li from "../home/componentLi";

import Footer from "./../components/footer/newFootHelp/Footer";
import ContrastModal from "./../components/contrastModal/";
import CompareBarModal from "./../components/compareBarModal";

import PriceComponents from "./../components/priceComponents/index"
import "./index.scss";
import api from "../component/api";
import prompt from "../component/prompt";

export default class SupplierDetails extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            companyName:'',
            tel:'',
            site:'',
            compareBarModal:false,
            isXin:false,
            introduce:"", // ← 商家介绍
            product_count:0,// ← 商品数量
            product_class:[],// ← 分类标签
            id:"",
            show:true,// ← 是否显示查看全部按钮

            // ↓ -------- 供应商详情数据 ---------
            // ↓ -------- 用于请求的数据 ---------
            class_id:"0", // ← 二级分类ID
            page_number:1, // ← 页码
            page_size:20,// 每页数量
            merchant_id:"",// ← 供应商编号

            // ↓ -------- 用于渲染的数据 ---------

            // ↓ ---------- 获取到的页码数据 ------------
            pageData:{
                res_page_number: 1, // ←当前页数
                res_page_size: 20, // 每页多少条
                res_total_page: 1, // 一共多少页
                res_total_row: 1 // 一共多少条数据
            },
            // ↓ ----------- 商品列表数据 ------------
            listData:[]

        }
        
    }
    // ↓ -------------------- 数据请求 -----------------------
    componentDidMount(){
        const id = this.props.location.search.split('?')[1];
        this.setState({id});
        const data = {
            merchants_id:id
        };
        api.axiosPost('getSupplierDetails_data',data)
            .then((res)=>{
                if(res.data.code == 1){
                    const data = res.data.data,
                        license_address = res.data.data.merchant.license_address; // ← 地址
                    this.setState({
                            companyName:data.merchant.company,
                            tel:data.merchant.contacter_phone,
                            site:`${license_address.province_name} ${license_address.city_name} ${license_address.country_name} ${data.merchant.license_address_info}`,
                            introduce:data.merchant.introduce,
                            product_count:data.merchant.product_count,
                            product_class:data.product_class,
                            id:data.merchant.id,
                            isXin:data.merchant.collection ? true : false
                        },
                    );
                }
            });

        this.getListData();
    }

    getListData=()=>{
        const id = this.props.location.search.split('?')[1];
        const goodData = {
            page_number:this.state.page_number,
            page_size:this.state.page_size,
            class_id:this.state.class_id,
            merchant_id:id
        };
        api.axiosPost('getSupplierDetails_goodData',goodData)
            .then((res)=>{
                // ↓ 处理
                if(res.data.code == 1){
                    const list = res.data.data.list;
                    let datas = [];
                    for (let i= 0; i<res.data.data.list.length;i++){
                        let data = {
                            title:list[i].title,
                            price:list[i].price,
                            id:list[i].id,
                            isShowNew:false,
                            class_id:list[i].class_id,
                            merchant_id:list[i].merchant_id
                        };
                        datas.push(data)
                    }
                    this.setState({listData:datas});
                    const data = res.data.data;
                    this.setState({
                        pageData:{
                            res_page_number: data.page_number, // ←当前页数
                            res_page_size: data.page_size, // 每页多少条
                            res_total_page: data.total_page, // 一共多少页
                            res_total_row: data.total_row // 一共多少条数据

                        }
                    })
                }
            })
    };
    // ↓ ----------- 按钮分类功能 ----------
    changeClassID(e){
        const id = e.currentTarget.id;
        this.setState({
            class_id:id
        },()=>{
            this.getListData();
        });
    }
    // ↓ ----------------- 设置简介显示全文 -------------------
    look_all(e){
        if(e.target.innerHTML ==="[查看详情]"){
            e.currentTarget.previousElementSibling.innerHTML = this.state.introduce;
            e.target.innerHTML = "[收起详情]"
        }
        else {
            var text ="";
            const maxWidth = 240;
            text = this.state.introduce.substr(0,maxWidth)+"...";
            e.currentTarget.previousElementSibling.innerHTML = text;
            e.target.innerHTML = "[查看详情]";
        }

    }
    isShowModal=(type,isTrue)=>{
        this.setState({
            [type]:isTrue
        })   
    };
    render(){
        const merchant_id = this.props.location.search.split('?')[1];
        const {listData,class_id} = this.state;
        // ↓ -------- 设置缩写文章 --------
        const maxWidth = 240;
        let text ="";
        if(this.state.introduce.length > maxWidth){
            text = this.state.introduce.substr(0,maxWidth)+"...";
        }
        else {
            text = this.state.introduce;
        }
        return(
            <div className='max-supplier'>
                <Nav />
                {/* 供应商版心 */}
                <div className='supplier-container'>
                    <div className='supplier-header'>
                        <Link to="/Home">首页 > </Link>
                        <Link>{this.state.companyName}</Link>
                    </div>
                    {/* 供应商详情 */}
                    <div className='supplier-details'>
                        <div className='supplier-details-header'>
                            <div className='supplier-details-left'>
                                <div className='supplier-img'>
                                    <img src={prompt.getGoodsImgUrl(merchant_id,merchant_id,"387",9)} alt="" onError={(e)=>{e.target.style.background = 'transparent'}}/>
                                </div>
                                <div className="supplier-brief">
                                    <p>{this.state.companyName}</p>
                                    <p className='supplier-site'>
                                        <i className='iconfont icondingwei'/>&nbsp;&nbsp;
                                        {this.state.site}
                                    </p>
                                </div>
                            </div>
                            <div className='supplier-details-right'>
                                {/*<div>*/}
                                    {/*<p>10000</p>*/}
                                    {/*<p className='ft12'>销量</p>*/}
                                {/*</div>*/}
                                <div className='supplier-allgoods'>
                                    <p>{this.state.product_count}</p>
                                    <p className='ft12'>所有商品</p>
                                </div>
                                <div className='supplier-xin' onClick={this.colorChange.bind(this)}>
                                    <p><i className={this.state.isXin ?'iconfont iconshoucang':'iconfont iconshoucang-copy'} style={{color:this.state.isXin ? "red" : "#000",fontSize:21}}/></p>
                                    <p className='ft12'>收藏</p>
                                </div>
                            </div>
                        </div>
                        {
                            this.state.show && text.length > 0 && <div className='supplier-intro'>简介</div>
                        }
                        {
                            this.state.show && text.length > 0 &&
                            <div className='supplier-intro-content'>
                                <div>{text}</div>
                                {
                                    text.length > 240 && <p onClick={this.look_all.bind(this)}>[查看详情]</p>
                                }
                            </div>
                        }
                    </div>
                    {/* 产品按钮 */}
                    <div className='supplier-btn clear'>
                        <p id={0}
                            onClick={this.changeClassID.bind(this)}
                            title={"全部"}
                           className={class_id == 0 ? "active" : ""}
                        >全部</p>
                        {this.state.product_class&&this.state.product_class.map((item,index) =>
                            <p
                                className={class_id == item.class_id ? "active" : ""}
                                key ={index}
                                id={item.class_id}
                                onClick={this.changeClassID.bind(this)}
                                title={item.class_name}
                            >{item.class_name}
                            </p>
                        )}
                    </div>
                    {/* 商品信息 */}
                    <div className='supplier-goods'>
                        <ul ref='home-good-ul' className='supplier-goods-list'>
                            {
                                listData && listData.map((item,index)=>(
                                    <Li key={index} {...item} item={item}/>
                                ))
                            }
                        </ul>
                        {/* 分页 */}
                        <div className="page">
                            <div className='supplier-goods-paging' style={{display:this.state.pageData.res_total_page>0 ? "block" : "none"}}>
                                <Pagination defaultCurrent={this.state.pageData.res_page_number}
                                            total={this.state.pageData.res_total_page}
                                            pageSize={1}// ← 每页条数
                                            onChange={this.pageChange.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
                <PriceComponents/>
            </div>
        )
    }
    //分页
    pageChange(cur,size){
        this.setState({
            page_number:cur
        },()=>{
            this.getListData()
        })
    }
    //点击收藏
    colorChange(){
        const {isXin,id} = this.state;
        const data={
            merchant_id:id,
            type: isXin ? 0 : 1
        };
        api.axiosPost("collection_merchant",data).then((res)=>{
            if(res.data.code == 1){
                message.success(res.data.msg);
                this.setState({isXin:!isXin});
            }else{
                message.error(res.data.msg)
            }
        });
    }
}
