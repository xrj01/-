
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
import {createHashHistory} from "history";
const history = createHashHistory();
@inject('store')
@observer
class GoodsDetails extends React.Component{
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
            paramString: '',   // 属性字符串
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
            isSku:false,
            isNUll: true,  // 是否有选择

            // ↓ -------------- 添加购物车使用的数据 ------------------

        }
        this.open = React.createRef();
    }
    // ↓ ---------- 页面载入时 根据传递来的ID 获取当前页面的数据 -------------
    async componentDidMount(){
    
        const orderSKU = sessionStorage.getItem('detailsSKU')
        const id = this.props.location.search.split('?')[1];
        this.setState({
            goodsId:id
        });
        let paramOBJ = await this.getGoodsDetails(id);
        orderSKU && this.handelFromOrderList(orderSKU, paramOBJ)
    }
    // ↓ --------------------- 订单页过来之后的操作 -------------------------
    handelFromOrderList = (osku, paramOBJ) => {
        // console.log('sku', osku);
        // console.log('param', param);
        let {key1, key2, key3, key4, key5} = this.state;
        const skuIndex = osku.substring(7);
        // 设置当前选中的规格
        key1 = skuIndex.substring(0,2);
        key2 = skuIndex.substring(2,4);
        key3 = skuIndex.substring(4,6);
        key4 = skuIndex.substring(6,8);
        key5 = skuIndex.substring(8);
        let keyArr = [key1, key2, key3, key4, key5]
        let keyName;
        let keyNameData;
        let price;
        // 设置选中的规格的属性名与属性值
        keyArr.map((item, index)=>{
            if(item !== '00') {
                keyName = `keyName${index+1}`
                keyNameData = {
                    name: paramOBJ.param[0].name[index],
                    key: item,
                    val: paramOBJ.param[0].val[0][index][item-1]
                }
                this.setState({
                    [keyName] : keyNameData
                },()=>{
                    // 拼接规格参数
                    this.setInitParam()
                })
            }
        })
        paramOBJ.priceArr.map(item => {
            if(item.sku == osku){
                price = item.price;
            }
        })
     
        this.setState({
            key1, key2, key3, key4, key5,
            sku: osku,
            isSku: true,
            isNUll: false,
            price
        })
    }
    // 设置初识参数，为了给立即购买使用
    setInitParam = () => {
        const {keyName1, keyName2, keyName3, keyName4, keyName5} = this.state;
        const skuVal = `${keyName1.name && keyName1.name + ":"}${keyName1.val && keyName1.val} ${keyName2.name && keyName2.name + ":"}${keyName2.val && keyName2.val} ${keyName3.name && keyName3.name + ":"}${keyName3.val && keyName3.val} ${keyName4.name && keyName4.name + ":"}${keyName4.val && keyName4.val} ${keyName5.name && keyName5.name + ":"}${keyName5.val && keyName5.val}`;
        this.setState({ skuVal })
    }
    // ↓ --------------------- 商家信息数据格式工厂 -------------------------
    userMerchant_Plant(data){
        if(data.data.code ==1){
            const address =data.data.data.merchant.license_address;
            const trateName_data = {
                title:data.data.data.merchant.company,// ← 店面名/标题
                tel:data.data.data.merchant.contacter_phone+"("+data.data.data.merchant.contacter+")",// ←联系人
                district:address.province_name+" "+address.city_name+" "+address.country_name+" "+data.data.data.merchant.license_address_info, // ←地址
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
        return api.axiosPost('gitGoodsDetails',data)
            .then((res)=>{
                // console.log('res', res);
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
                            key1,key2,key3,key4,key5
                        });

                        return {param : res.data.data.param[0].data, priceArr:  res.data.data.product.product_price}
                    }
                }else{
                    message.error(res.data.msg)
                }
            })
    };

    //数组去重

    arrRepeat=(arr)=>{
        return new Set(arr);
    };
    //选择属性
    selectAttribute=(e,skuIndex,attrIndex,key,name)=>{
        // console.log('e,skuIndex,attrIndex,key,name', e,skuIndex,attrIndex,key,name);
        const {hasChosenSku} = this.state;
        const isActive = e.target.getAttribute("class");
        let activeVal = prompt.addZero(attrIndex);
        if(isActive == "active"){
            activeVal = "00";
            hasChosenSku[skuIndex] = [false,""];
        }else{
            hasChosenSku[skuIndex] = [true,prompt.addZero(attrIndex)];
        }
        const keyName = `keyName${key.skuIndex+1}`;
        
        let activeSku = "";
        for(let key in hasChosenSku){
            if(hasChosenSku[key][0]){
                activeSku += hasChosenSku[key][1]
            }else{
                activeSku += "00"
            }
        }
        const type = `key${skuIndex+1}`; 

        // console.log('hasChosenSku', hasChosenSku);

        this.setState({
            [type]:activeVal,
            [keyName]:{ name:key.skuName, key:prompt.addZero(name.attrIndex), val:name.skuValue },
            hasChosenSku,
            isInventory:true,
        },()=>{this.generateSKU();});
    };
    //生成SKU
    generateSKU=()=>{
        const {key1,key2,key3,key4,key5,product,keyName1,keyName2,keyName3,keyName4,keyName5} = this.state;
        let {price,inventory} = this.state;
        const sku = `${product.class_id}${key1}${key2}${key3}${key4}${key5}`;
        const skuVal = `${keyName1.name && keyName1.name + ":"}${keyName1.val && keyName1.val} ${keyName2.name && keyName2.name + ":"}${keyName2.val && keyName2.val} ${keyName3.name && keyName3.name + ":"}${keyName3.val && keyName3.val} ${keyName4.name && keyName4.name + ":"}${keyName4.val && keyName4.val} ${keyName5.name && keyName5.name + ":"}${keyName5.val && keyName5.val}`;
        price = "暂无报价";
        inventory = 0;
        let isSku = false;
        product.product_price && product.product_price.map((item)=>{
            if(item.sku == sku){
                price = item.price;
                inventory = item.inventory;
                isSku = true;
            }
        });
        this.setState({
            sku,
            price,
            inventory,
            isSku,
            skuVal,
        },()=>{
            this.getsameCommodity()
        });

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
        if(!isSku){message.error('请选择正确的规格！');return;}
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
    // ↓ ---------------------- 立即购买 ---------------------
    buyIimmediately=()=>{
        const {key1,key2,key3,key4,key5, goodsId, isSku,product, skuVal, trateName_data, payNumber, inventory, price, url} = this.state;

        if(key1 == "00" && key2 == "00" && key3 == "00" && key4 == "00" && key5 == "00"){
            message.error('请选择规格！')
            return
        }
        if(!isSku){ message.error('请选择正确的规格！');
            return
        }
        const data={
            sku:this.state.sku,
            product_id: goodsId,//← 商品id
            count:this.state.payNumber, // ← 数量
            act_type: 101,  // 立即购买的状态
        };

        api.axiosPost('buyIimmediately',data).then((res)=>{
            if(res.data.code == 1){
                const buyIimmediaGoods = {};
                let goodsList = {
                    count: payNumber,
                    id: res.data.data,
                    param: skuVal,
                    inventory: inventory,
                    merchant_id: product.merchant_id,
                    price: price,
                    price_count: price*payNumber.toFixed(2),
                    product_id: goodsId,
                    state: 1,
                    title: product.title,
                    unit: product.util
                };
                buyIimmediaGoods[`${product.merchant_id}_${trateName_data.title}`] = [goodsList];

                console.log(JSON.stringify(buyIimmediaGoods))
                sessionStorage.setItem('buyIimmediaGoods', JSON.stringify(buyIimmediaGoods));

                history.push("/order");
            }else{
                message.error(res.data.msg)
            }
        })
    };

    componentWillUnmount(){
        // sessionStorage.removeItem('buyIimmediaGoods');
        sessionStorage.removeItem('detailsSKU')
    }
    render(){
        const {isCollection,classBreadcrumb,param,attribute,product,price,inventory,goodsId,canList,isInventory} = this.state;
        return(
            <div className="goodDetails">
                <Nav isFixed={true}/>
                <div>
                    <div className="goods-details-box">
                        <Breadcrumb className="breadcrumb"  separator=">">
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
                        </Breadcrumb>
                        <div className="goods-introduce">
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
                                    <div className="goods-collection-box">
                                        <span className={isCollection ? "collection" : ""} onClick={this.isCollection}>
                                            <Icon type="heart" theme={isCollection ? "filled" : ""} />
                                            收藏
                                        </span>
                                    </div>
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
                                                                                      onClick={(e)=>{
                                                                                          if(canListSpan.indexOf(prompt.addZero(j+1)) == "-1"){return};
                                                                                          this.selectAttribute(e,k,j+1,{skuIndex:k,skuName:itemName},{attrIndex:j+1,skuValue:val})
                                                                                      }}
                                                                                      key={val}
                                                                                      style={{display:defaultChecked ? "inline-block" : "none"}}
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
                                <div className="goods-pay-number-box">
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
                                        <Button className='pay-btn' onClick={this.buyIimmediately}>
                                            立即购买
                                        </Button>
                                        <Button className='pay-btn' onClick={()=>{this.showModal(goodsId)}}>
                                            {/* <i className='iconfont icon-qushi'> </i> &nbsp; */}
                                            加入比价
                                        </Button>
                                        <Link style={{opacity:0}}
                                           ref={this.open}
                                           to="/order" target='_blank'>

                                        </Link>
                                    </div>
                                </div>
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

export default GoodsDetails;