import React from "react";
import "./index.scss";
import { Pagination,Breadcrumb,Checkbox,Icon ,Spin} from 'antd';
import {Link} from "react-router-dom";
import Nav from "./../components/nav";
import Footer from './../components/footer/newFootHelp/Footer';
import Attribute from "./attributeList";
import Li from "../home/componentLi";
import Prompt from "./../component/prompt";
import api from "./../component/api";
import PriceConponents from "./../components/priceComponents";
import NoList from "./../components/noList/null";
import "./newIndex.scss";
export default class ClassList extends React.Component{
    constructor(props) {
        super(props);
        const url = window.location.host;
        this.state={
            list:[],
            class_name_1:"",
            class_name_2:"",
            class_name_3:"",
            level:2,
            url:url,
            typeClass:[],
            classInformation:null,

            in_stock:0, //是否只显示有货  1是  0否
            order:"asc", //排序 正序 asc 倒叙 desc
            sort:"time", //排序 time按时间 price 安价格
            sku_like:[],
            page_number:1,
            page_size:20,
            total:0,
            isList:false,
            spinning:false
        };
        this.attribute = React.createRef();
    }

    componentDidMount() {
        this.getClassId();
    }

    //获取分类id
    getClassId=()=>{
        const classInformation = Prompt.getSession("classInformation") && JSON.parse(Prompt.getSession("classInformation")) || null;
        this.setState({ classInformation });
        this.getTypeList(classInformation.class_id);
    };
    //获取属性列表
    getTypeList=(class_id)=>{
        const data={class_id};
        api.axiosPost("gitClassList_selectorData",data).then((res)=>{
            if(res.data.code == 1){
                const data = res.data.data[0];
                let sku_like = [];
                if(data.level == 3){
                    sku_like = [class_id + "__________"];
                }
                this.setState({
                    class_name_1:data.class_name_1,
                    class_name_2:data.class_name_2,
                    class_name_3:data.class_name_3,
                    typeClass:data.data,
                    level:data.level,
                    sku_like
                },()=>{
                    this.getClassList(class_id);
                })
            }
        })
    };
    //获取商品列表
    getClassList=()=>{
        this.setState({
            spinning:true
        },()=>{
            const {classInformation,in_stock,order,sort,sku_like,page_number,page_size} = this.state;
            const data={
                in_stock,order,sort,sku_like,page_number,page_size,class_id:classInformation.class_id
            };
            api.axiosPost("getClass_goods_data",data).then((res)=>{
                if(res.data.code == 1){
                    this.setState({
                        list:res.data.data.list ? res.data.data.list : [],
                        total:res.data.data.total_row,
                        isList:true,
                        spinning:false
                    })
                }
            })
        });
    };
    //sku改变
    skuChange=(sku_like)=>{
        this.setState({
            sku_like,
            page_number:1
        },()=>{ this.getClassList(); })
    };
    //是否有货
    inStock=(e)=>{
        const checked = e.target.checked;
        this.setState({
            in_stock:checked ? 1 : 0
        },()=>{
            this.getClassList();
        })
    };
    //排序方式
    typeSort=(type)=>{
        let {order} = this.state;
        if(type == "time"){
            order = "asc"
        }else{
            order = order == "asc" ? "desc" : "asc"
        }
        this.setState({
            sort:type,
            order
        },()=>{
            this.getClassList()
        })
    };

    //从新进入初始化数据
    newDate=()=>{
        this.attribute.current.newDate();
        this.setState({
            in_stock:0, //是否只显示有货  1是  0否
            order:"asc", //排序 正序 asc 倒叙 desc
            sort:"time", //排序 time按时间 price 安价格
            sku_like:[],
            page_number:1,
            page_size:20,
            total:0
        },()=>{
            this.getClassId();
        })
    };
    //二级分类点击跳转页面
    levelClassClick=()=>{
        const {class_name_2,url,level,classInformation} = this.state;
        if(level == 3){
            const class_id = classInformation.class_id / 1000;
            const classInformationSecction={ class_id, class_name:class_name_2 };
            Prompt.setSession("classInformation",JSON.stringify(classInformationSecction));
            window.open(`http://${url}/#/classList?v=${Math.random()*10000}`, '_blank');
        }
    };
    render(){
        const {spinning,isList,list,class_name_1,class_name_2,class_name_3,level,typeClass,classInformation,total,page_size,page_number,sort,order} = this.state;
        const attributeData={
            level,
            typeClass,
            class_name_2,
            classId:classInformation && classInformation.class_id,
            skuChange:this.skuChange
        };
        const pagination={
            total:total,
            pageSize:page_size,
            hideOnSinglePage:true,
            current:page_number,
            onChange:(page)=>{
                this.setState({page_number:page},()=>{
                    this.getClassList()
                })
                document.getElementById('root').scrollIntoView(true)
            }
        };
        return(
            <div className='new-class-list'>
                <Nav isFixed={true}/>
                <div className="class-list-content">
                    <Breadcrumb className='breadcrumb' separator=">">
                        <Breadcrumb.Item>
                            <Link to="/home">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <a href="javascript:;">{class_name_1}</a>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <a href="javascript:;" onClick={this.levelClassClick}>{class_name_2}</a>
                        </Breadcrumb.Item>
                        {
                            class_name_3 &&
                            <Breadcrumb.Item>
                                <a href="javascript:;">{class_name_3}</a>
                            </Breadcrumb.Item>
                        }
                    </Breadcrumb>
                    <Attribute {...attributeData} ref={this.attribute}/>
                    <div className="class-content-list">
                        <div className="class-sorting-box">
                            <div className={sort == "time" ? "class-sorting-button active" : "class-sorting-button"} onClick={()=>{this.typeSort("time")}}>
                                最新商品
                            </div>
                            <div className={sort == "price" ? "class-sorting-button active" : "class-sorting-button"} onClick={()=>{this.typeSort("price")}}>
                                价格排序&emsp;
                                <Icon type="caret-up" className={ sort == "price" && order == "desc" ? "active" : ""}/>
                                <Icon type="caret-down" className={ sort == "price" && order == "asc" ? "active" : ""}/>
                            </div>
                            <div className="class-show-stock">
                                {
                                    list.length>0 ? <Checkbox onChange={this.inStock}>仅显示有货商品</Checkbox> : ''
                                }
                            </div>
                        </div>


                        <Spin tip="数据加载中..." spinning={spinning}>
                            <div className="class-list-li-box" style={{minHeight:"360px"}}>
                                <ul>
                                    {
                                        list && list.map((item)=>(
                                            <Li key={item.id} {...item} item={item}/>
                                        ))
                                    }
                                </ul>
                                {
                                    list.length ==0  && isList && <NoList />
                                }
                            </div>
                            {
                                total > 0 &&
                                <div className="class-pagination-box">
                                    <Pagination defaultCurrent={1} {...pagination} />
                                </div>
                            }
                        </Spin>
                    </div>
                </div>

                <PriceConponents />
                <Footer />
            </div>
        )
    }

}