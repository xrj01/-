
import React from "react";
import Nav from "./../components/nav";
import {Breadcrumb, Icon, Input, Button, Row, Col, message} from 'antd';
import ImgBig from "./../components/imgBig";
import prompt from "./../component/prompt";
import {Link} from "react-router-dom";
import Footer from "./../components/footer/newFootHelp/Footer"
// -- ↓ 引入 产品详情模块
import Content from "./content/content"
// -- ↓ 引入 商户信息模块
import Trate from "./trateName_data/trateName_data"
// -- ↓ 引入 商品对比表模块
import Compare from "./compare/compare"
import "./index.scss";
import api from "../component/api";
import Header from "./../components/header/"
import WinButton from "../components/winButton/index"
import PriceConponents from "../components/priceComponents";
import {inject, observer} from "mobx-react";
@inject('store')
@observer
class adminDetails extends React.Component{
    constructor(props) {
        super(props);
        const url = window.location.host;
        this.state= {
            isCollection: false,  //是否收藏
            merchant_collection:0, //商家是否收藏
            payNumber: 1,
            url:url,
            // ------- ↓ 商户信息数据 --------
            trateName_data: {
                title: "",// ← 店面名/标题
                tel: "",// ←联系人
                district: "", // ←地址
                description: ""// ← 商户描述
            },
            data: {},
            classBreadcrumb: {},
            param: [],   //改商品已有的属性列表
            attribute: {},
            key1: "00",
            key2: "00",
            key3: "00",
            key4: "00",
            key5: "00",
            product: {},
            price: 0,
            inventory: 0,
            sku: "",
            goodsId: "",
            selectSku:[],
            isInventory:false,

            // ↓ ------------- 获取同类商品接口数据 -----------
            product_id: "", // ←商品编号
            compare_Data: [],
            classId : "",
            keyName1:{
                name:"",
                key:"00",
                val:""
            },
            keyName2:{
                name:"",
                key:"00",
                val:""
            },
            keyName3:{
                name:"",
                key:"00",
                val:""
            },
            keyName4:{
                name:"",
                key:"00",
                val:""
            },
            keyName5:{
                name:"",
                key:"00",
                val:""
            },
            hasChosenSku:{
                0:[false,""],
                1:[false,""],
                2:[false,""],
                3:[false,""],
                4:[false,""]
            },
            backupCanList:null,
            canList:{
                canNum1:[],
                canNum2:[],
                canNum3:[],
                canNum4:[],
                canNum5:[],
            },
            skuVal:"",
            isSku:false

            // ↓ -------------- 添加购物车使用的数据 ------------------

        }
    }
    // ↓ ---------- 页面载入时 根据传递来的ID 获取当前页面的数据 -------------
    componentDidMount(){

        let sky = this.props.location.search.split('?')[1].split('+')[1].substring(7)
        //console.log(sky);
        this.setState({
            key1 : sky.substring(0,2),
            key2 : sky.substring(2,4),
            key3 : sky.substring(4,6),
            key4 : sky.substring(6,8),
            key5 : sky.substring(8),
        })

        const id = this.props.location.search.split('?')[1].split('+')[0];
        this.setState({
            goodsId:id
        });
        this.getGoodsDetails(id);
    }
    // ↓ --------------------- 商家信息数据格式工厂 -------------------------
    userMerchant_Plant(data){
        if(data.data.code ==1){
            const address =data.data.data.merchant.license_address;
            const trateName_data = {
                title:data.data.data.merchant.company,// ← 店面名/标题
                tel:data.data.data.merchant.contacter_phone+"("+data.data.data.merchant.contacter+")",// ←联系人
                district:address.country_name+" "+address.city_name+" "+address.province_name+" "+data.data.data.merchant.license_address_info, // ←地址
                description:data.data.data.merchant.introduce// ← 描述
            };
            this.state.trateName_data = trateName_data;
            this.setState({trateName_data:trateName_data});
        }
    }
    //弹出选择属性的框
    showModal=(type)=>{
        const {classId,goodsId,product} = this.state;
        const {store} = this.props;
                store.contrast.getDBValue();
        // const contrastLength = store.contrast.contrast.length;
        const goods={
            class_id:product.class_id,
            id:goodsId,
            title:product.title,
            merchant_id:product.merchant_id
        };
        store.contrast.domPosition = 0;
        /*if(contrastLength >= 5){
            message.error("最多添加5条商品进行比价");
            return false;
        }*/
        store.contrast.isShowModal(true,goodsId,product.class_id,goods,type);
    };
    getGoodsDetails=(id)=>{
        const data={
            product_id:id
        };
        api.axiosPost('gitGoodsDetails',data)
            .then((res)=>{
                if(res.data.code == 1){
                    this.userMerchant_Plant(res);
                    if(res.data.code == 1){
                        const areProductPrice = res.data.data.product.product_price;
                        const selectSku = [];
                        const attribute={
                            1:{},//属性1所选的值
                            2:{},//属性2所选的值
                            3:{},//属性3所选的值
                            4:{},//属性4所选的值
                            5:{},//属性5所选的值
                        };
                        let {key1,key2,key3,key4,key5,sku,inventory,canList} = this.state;
                        let price = res.data.data.product.price;
                        //单选框默认选中的数据
                        areProductPrice && areProductPrice.map((item,i)=>{
                            const newSku = ""+item.sku;
                            const pushSku = newSku.substring(7);
                            selectSku.push(pushSku);
                            selectSku.map((itemSku)=>{
                                canList.canNum1.push(itemSku.substring(0,2));
                                canList.canNum2.push(itemSku.substring(2,4));
                                canList.canNum3.push(itemSku.substring(4,6));
                                canList.canNum4.push(itemSku.substring(6,8));
                                canList.canNum5.push(itemSku.substring(8));
                                attribute[1][itemSku.substring(0,2)]=1;
                                attribute[2][itemSku.substring(2,4)]=1;
                                attribute[3][itemSku.substring(4,6)]=1;
                                attribute[4][itemSku.substring(6,8)]=1;
                                attribute[5][itemSku.substring(8)]=1;
                            });
                        });
                        canList.canNum1 = Array.from(this.arrRepeat(canList.canNum1)) ;
                        canList.canNum2 = Array.from(this.arrRepeat(canList.canNum2)) ;
                        canList.canNum3 = Array.from(this.arrRepeat(canList.canNum3)) ;
                        canList.canNum4 = Array.from(this.arrRepeat(canList.canNum4)) ;
                        canList.canNum5 = Array.from(this.arrRepeat(canList.canNum5)) ;
                        this.setState({
                            classBreadcrumb:res.data.data.class,
                            param:res.data.data.param[0].data,
                            product:res.data.data.product,
                            merchant_collection:res.data.data.merchant.collection,
                            attribute,
                            isCollection:res.data.data.product.collection ? true : false,
                            price,
                            inventory,
                            sku,
                            canList,
                            backupCanList:canList,
                            selectSku,
                            product_id:id,
                            classId:res.data.data.class.class_name_3,
                            // key1,key2,key3,key4,key5
                        });
                    }
                    document.title = res.data.data.product.title
                }else{
                    message.error(res.data.msg)
                }
            })
    };

    //数组去重

    arrRepeat=(arr)=>{
        return new Set(arr);
    };
    
    

    // ↓  ------------ 获取同品对比数据 --------------
    getsameCommodity(){
        const {sku,skuVal} = this.state;
        const data={
            product_id:this.state.product_id,// ← 商品编号
            sku
        };
        api.axiosPost('getsameCommodity',data)
            .then((res)=>{
                if(res.data.code == 1){
                    const compare_Data = res.data.data;
                    compare_Data.map((item)=>{
                        item.key = item.product_id;
                        item.quantity = 1;
                        item.sku = sku;
                        item.skuVal = skuVal
                    });
                    this.setState({compare_Data})
                }
            })
    }
    //收藏\取消收藏
    isCollection=()=>{
        const {isCollection,goodsId} = this.state;
        const data={
            product_id:goodsId,
            type: isCollection ? 0 : 1
        };
        api.axiosPost("collection_product",data).then((res)=>{
            if(res.data.code == 1){
                message.success(res.data.msg);
                this.setState({isCollection:!isCollection});
            }else{
                message.error(res.data.msg)
            }
        })
    };
    //输入框值改变
    inputChange=(e)=>{
        const isNumber = prompt.isNumber(e.target.value);
        if(isNumber){
            this.setState({ payNumber:e.target.value })
        }
    };
    //加减购买数量
    addSubtractNumber=(type)=>{
        let payNumber = parseInt(this.state.payNumber);
        if(type == "+"){
            payNumber +=1;
        }else{
            payNumber -=1;
            if(payNumber <= 1){
                payNumber = 1;
            }
        }
        this.setState({payNumber})
    };
    // ↓ ------------------- 向后台购物车发送添加购物车数据 ------------------
    addSPcar=()=>{
        const {store} = this.props;
        const {isSku} = this.state;
        if(!isSku){message.error('该规格暂无报价');return;}
        const data={
            sku:this.state.sku,
            product_id:this.state.goodsId,//← 商品id
            count:this.state.payNumber // ← 数量
        };
        api.axiosPost('addShoppingCartData',data).then((res)=>{
             if(res.data.code == 1){
                 message.success("加入购物车成功");
                 store.shoppingCart.getShoppingNumber();
             }else{
                 message.error(res.data.msg)
             }
        })
    };
    //二级分类点击跳转页面
    levelClassClick=(level)=>{
        const {product,url,classId} = this.state;
        let class_id = product.class_id;
        if(level == 2){
            class_id = class_id / 1000;
        }
        const classInformationSecction={ class_id, class_name:classId };
        prompt.setSession("classInformation",JSON.stringify(classInformationSecction));
        window.open(`http://${url}/#/classList?v=${Math.random()*10000}`, '_blank');
    };
    render(){
        const {isCollection,classBreadcrumb,param,attribute,product,price,inventory,goodsId,canList,isInventory} = this.state;
        return(
            <div className="goodDetails">
                {/* <Nav /> */}
                <Header />
                <div>
                    <div className="goods-details-box">
                        {/* <Breadcrumb className="breadcrumb"  separator=">">
                            <Breadcrumb.Item>
                                <Link to='/home'>首页</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="javascript:;">
                                    {classBreadcrumb.class_name_1}
                                </a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="javascript:;" onClick={()=>{this.levelClassClick(2)}}>
                                    {classBreadcrumb.class_name_2}
                                </a>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <a href="javascript:;" onClick={()=>{this.levelClassClick(3)}}>
                                    {classBreadcrumb.class_name_3}
                                </a>
                            </Breadcrumb.Item>
                        </Breadcrumb> */}
                        <div className="goods-introduce mt32">
                            <div className="goods-img-big-box">
                                <ImgBig pic_cont={product.pic_count} pic_id ={goodsId} merchant_id={product.merchant_id}/>
                            </div>
                            <div className="goods-introduce-box">
                                <div className="goods-title-box">
                                    <h4>
                                        {product.title}
                                    </h4>
                                    <div className="goods-price">
                                        价格: <span>￥{price}</span>
                                    </div>
                                    {/* <div className="goods-collection-box">
                                        <span className={isCollection ? "collection" : ""} onClick={this.isCollection}>
                                            <Icon type="heart" theme={isCollection ? "filled" : ""} />
                                            收藏
                                        </span>
                                    </div> */}
                                    <div className="goods-freight">
                                        <span>运&emsp;&emsp;费：</span>
                                        待定</div>
                                </div>
                                <div className="goods-instructions-box">
                                    <ul>
                                        <li>
                                            <p>商品货号：<span>{product.article_number}</span> </p>
                                            <p style={{display: isInventory ? "block" : "none"}}>库存量：<span>{inventory}</span> {product.util}</p>
                                        </li>
                                    </ul>
                                </div>
                                <div className="goods-specifications-box">
                                    {
                                        param && param.map((item)=>{
                                            return item.name && item.name.map((itemName,k)=>{
                                                if(item.display[k]){
                                                    const isShow = attribute[k+1] && attribute[k+1]['00'];
                                                    const canListSpan = canList[`canNum${k+1}`];
                                                    let activeK = `key${k+1}`;
                                                    return(
                                                        <div key={itemName} className='goods-specifications line-height-30' style={{display:isShow ? "none" : "block"}}>
                                                            <div className='goods-specifications-list-box'>
                                                                <div className='goods-specifications-name'>
                                                                    {itemName}：
                                                                </div>
                                                                <div className='goods-specifications-span'>
                                                                    {
                                                                        item.val[0] && item.val[0][k] && item.val[0][k].map((val,j)=>{
                                                                            let defaultChecked = false;
                                                                            if(attribute[k+1][prompt.addZero(j+1)]){
                                                                                defaultChecked = true;
                                                                            }
                                                                            return(
                                                                                <span className={
                                                                                    this.state[activeK] == prompt.addZero(j+1) ? "active" :
                                                                                        canListSpan.indexOf(prompt.addZero(j+1)) == "-1" ? "noCan" : ""
                                                                                }
                                                                                      
                                                                                      key={val}
                                                                                      style={{display:this.state[activeK] == prompt.addZero(j+1) ? "inline-block" : "none"}}
                                                                                >
                                                                            {val}
                                                                        </span>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })
                                        })
                                    }
                                </div>
                                {/* <div className="goods-pay-number-box">
                                    <div className="goods-number-box">
                                        <span style={{width: 78}}>数&emsp;量：</span>
                                        <div className="goods-number-btn">
                                            <button onClick={()=>{this.addSubtractNumber("-")}}>-</button>
                                            <Input type="text" value={this.state.payNumber} onChange={this.inputChange}/>
                                            <button onClick={()=>{this.addSubtractNumber("+")}}>+</button>
                                        </div>
                                    </div>

                                    <div className="goods-pay-btn">
                                        <Button
                                            className='add-shopping-btn'
                                        onClick={this.addSPcar}>
                                            <Icon type="shopping-cart" />
                                            加入购物车
                                        </Button>
                                        <Button className='pay-btn' onClick={()=>{this.showModal(goodsId)}}>
                                            <i className='iconfont icon-qushi'> </i> &nbsp;
                                            加入比价
                                        </Button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <Compare contrastDate = {this.state.compare_Data} class_Id={product.class_id}/>
                        <div className="bottom clear">
                            <Trate data={this.state.trateName_data} collection={this.state.merchant_collection} merchant_id={product.merchant_id}/>
                            <div className='content-right'>
                                <div className="content-nav">
                                    <div className="content-list-nav active">商品详情</div>
                                </div>
                                <Content content={product.content}/>
                            </div>
                        </div>
                    </div>
                </div>

                <PriceConponents />
                <Footer/>
                <WinButton/>
            </div>
        )
    }
}

export default adminDetails;