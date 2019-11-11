import React from "react";
import "./index.scss";
import { Pagination,Breadcrumb,Checkbox ,Button,Icon,Spin,message} from 'antd';
import api from './../component/api'
import Nav from "./../components/nav";
import Footer from './../components/footer/newFootHelp/Footer';
import Li from "./../home/componentLi";
import Null from "./../components/noList/null";
import PriceConponents from "./../components/priceComponents"


import Prompt from "./../component/prompt";

export default class ClassList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            list:[],
            class_name_1:"",
            class_name_2:"",
            class_name_3:"",
            
            //in_stock:0, //是否只显示有货  1是  0否
            //order:"asc", //排序 正序 asc 倒叙 desc
            //sort:"time", //排序 time按时间 price 安价格
            
            page_number:1,
            page_size:20,
            total:0,
            classInformation:null,
            isTrue:false,

            brands: [], // 后台返回品牌
            brand:'',//前端发送品牌
            price_min:'',
            price_max:'',
            isMore: false, // 是否展示更多
            text:'全部',
            spinning:true,
            isShow:true
            //text1:'全部'
        }
    }

    componentDidMount() {
        const classInformation = JSON.parse(sessionStorage.getItem("classInformation"));
        this.JDgoodlist()
    }
    
    //获取京东商品
    JDgoodlist(){
        const classInformation = JSON.parse(sessionStorage.getItem("classInformation"));
        const _this = this;
        const {brands} = this.state;
        const data={
            page_number : this.state.page_number,
            page_size : this.state.page_size,
            class_id:classInformation.class_level != 2 ? `${classInformation.class_id}` : '',
            cid1:"",
            cid2:classInformation.class_level == 2 ? `${classInformation.class_id}` : '',
            brand : this.state.brand,
            price_min:this.state.price_min, 	
            price_max:this.state.price_max,
            keyword:''
        };
        
        api.axiosPost('jd_product_list',data)
        .then((res)=>{
            if(res.data.code == 1){
                const list = res.data.data.list;

                list.map((item)=>{
                    item.class_id = item.product_id;
                    item.id = item.product_id;
                    item.merchant_id = item.product_id;
                    item.price = item.anmro_price;
                    item.type = "jd"
                });
                let {isShow} = this.state;
                if(res.data.data.brand && res.data.data.brand.length > 7){
                    isShow = false
                }

                this.setState({
                class_name_1 : res.data.data.class_name_1,
                class_name_2 : res.data.data.class_name_2,
                class_name_3 : res.data.data.class_name_3,
                brands : brands.length ? brands : res.data.data.brand,//品牌
                price : res.data.data.price,//价格
                list,//商品
                isShow,
                total: res.data.data.total_row,
                isTrue:true,
                
            })
            
            }else{
                message.error(res.data.msg)
            }
            this.setState({spinning:false})
        })
        .catch((err)=>{
            _this.setState({spinning:false})
            // console.log(err,"分类标签出错")
        }); 
    }
    // 点击品牌
    clickBrand(e){
        e.preventDefault();
        
        const t = e.target
        const text = t.innerText
        if(text === '全部'){
            this.setState({
                page_number:1,
                page_size:20,
                text,
                brand:''
            },()=>{
                this.JDgoodlist()
            })
        }else if(text != '全部' && text !='更多' && text !='收回' && text !='品牌：'){
            this.setState({
                page_number:1,
                page_size:20,
                brand:text
            },()=>{
                this.JDgoodlist()
            })
        }
        
        if(t.classList.contains('brandCell')) {
            if(text === '更多' || text === '收回') {
                this.setState({
                    isMore: !this.state.isMore,
                    text:''
                })
            } else if(text) {
                this.setState({text})
            }
        }
    }
    render(){
        const {list,total,page_size,page_number, brands, isMore, text,isTrue,spinning,isShow} = this.state;
        //分页
        const pagination={
            total:total,
            pageSize:page_size,
            hideOnSinglePage:true,
            current:page_number,
            onChange:(page)=>{
                this.setState({page_number:page,spinning:true},()=>{
                    this.JDgoodlist()
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        //console.log(this.state.list);
        return(
            <div className='new-class-list'>
                <Nav />
                <Spin tip="加载中..." spinning={spinning}>
                <div className="class-list-content">
                    {
                        total > 0 && 
                        <Breadcrumb className='breadcrumb' separator=">">
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="javascript:;">{this.state.class_name_1}</a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="javascript:;">{this.state.class_name_2}</a>
                            </Breadcrumb.Item>
                            {
                                this.state.class_name_3 &&
                                <Breadcrumb.Item>
                                    <a href="javascript:;">{this.state.class_name_3}</a>
                                </Breadcrumb.Item>
                            }
                        </Breadcrumb>
                    }
                    
                    <div className='attribute-list-box'>
                        <ul>
                            <li>
                                <div className='attribute-name'>品牌：</div>
                                <div className='attribute-list-title'>
                                    <div className='attribute-list-span-all'>
                                        <span className={text === '全部'?' active' : ''} onClick={this.clickBrand.bind(this)}>全部</span>
                                    </div>
                                    <div className="attribute-list-span">
                                        {
                                            brands && brands.map((item,index)=>{
                                                return(
                                                    <span 
                                                        style={{display: index > 6 && !isShow ? "none" : "block"}}
                                                        onClick={this.clickBrand.bind(this)}
                                                        className={'brandCell' + (text === item.name ? ' active' : '')} >{item.name}</span>
                                                )
                                            })
                                        }
                                    </div>
                                    {
                                        brands && brands.length > 6 &&
                                        <Button onClick={()=>{this.setState({isShow:!this.state.isShow})}}>
                                            {
                                                isShow ? <span>收起<Icon type="up"/></span>: <span>更多<Icon type="down"/></span>
                                            }
                                            
                                        </Button>
                                    }
                                </div>
                            </li>
                            {/* <li onClick={this.clickBrand.bind(this)} className='attribute-list-brand'>
                                <span className='attribute-name'>品牌：</span>
                                <span className={text === '全部'?' active' : ''}>全部</span>
                                {
                                    brandList && brandList.map((item,index)=>{
                                        return(
                                            <span className={'brandCell' + (text === item.name ? ' active' : '')} >{item.name}</span>
                                        )
                                    })
                                }
                               
                            </li> */}
                            {/* <li onClick={this.clickPrice.bind(this)}>
                                <span className='attribute-name'>价格：</span>
                                <span className={text === '全部'?' active' : ''}>全部</span>
                                {
                                    this.state.price && this.state.price.map((item,index)=>{
                                        return(
                                            <span className={text === item.name ? ' active' : ''}>{item.min}~{item.max}</span>
                                        )
                                    })
                                }
                            </li> */}
                        </ul>
                    </div>
                    <div className="class-content-list">
                            <div className="class-list-li-box" style={{ minHeight: "370px"}}>
                                <ul>
                                    {
                                        list && list.map((item)=>(
                                            <Li key={item.id} {...item} item={item}/>
                                        ))
                                    }
                                </ul>
                                {
                                    total == 0 && isTrue && <Null/>
                                }
                            </div>
                            {
                                total > 0 &&
                                <div className="class-pagination-box">
                                    <Pagination defaultCurrent={1} {...pagination} />
                                </div>
                            }
                        

                    </div>
                   
                </div>

                <PriceConponents />
                </Spin >
                <Footer />
            </div>
        )
    }

}