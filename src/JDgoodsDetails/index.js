import React from "react";
import Nav from "./../components/nav";
import {Breadcrumb, Icon, Input, Button, Row, Spin , message} from 'antd';
import ImgBig from "./../components/JDimgBig";
import prompt from "./../component/prompt";
import {Link} from "react-router-dom";
import Footer from "./../components/footer/newFootHelp/Footer"
import "./index.scss";
import api from "../component/api";
import WinButton from "../components/winButton/index"
import {inject, observer} from "mobx-react";
import PriceConponents from "../components/priceComponents";
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
            payNumber: 1,
            
            url: url,

            data: {},
            classBreadcrumb: {},
            param: [],   //改商品已有的属性列表
            attribute: {},
            
            inventory: 0,
            goodsId: "",
            spinLoad:true,

            // ↓ ------------- 获取同类商品接口数据 -----------
            product: {},
            product_id: "", // ←商品编号
            class_name_1:'',
            class_name_2:'',
            class_name_3:'',
            title:'',

            compare_Data: [],
            classId : "",
            jd_collection:0,

            // ↓ -------------- 添加购物车使用的数据 ------------------

        }
    }
    // ↓ ---------- 页面载入时 根据传递来的ID 获取当前页面的数据 -------------
    componentDidMount(){
        //获取商品id
        this.setState({
            product_id : this.props.location.search.slice(1)
        },()=>{
            this.getJdGoos()
        })
    }
    
    // 获取京东商品详情api
    getJdGoos(){
        let data = {product_id : this.state.product_id}
        api.axiosPost('jd_product_info',data)
        .then((res)=>{
            // console.log('res', res);
            if(res.data.code == 1){
                const class_name = res.data.data.class_name;
                let arr = class_name.split('-');
                if(res.data.data.title.length>10){
                    var str = res.data.data.title.substring(0,10)+'...'
                }else{
                    str = res.data.data.title
                }
                this.setState({
                    class_name_1 : arr[0],
                    class_name_2 : arr[1],
                    class_name_3 : arr[2],
                    title : str,
                    product:res.data.data,
                    isCollection:res.data.data.collection == 1 ? true : false,
                    total: res.data.data.total_row,
                    jd_collection:res.data.data.jd_collection
                })
            }else{
                message.error(res.data.msg)
            }


            this.setState({spinLoad:false})
        })
    }
    //选择属性
    selectAttribute=(skuIndex,attrIndex)=>{
        const type = `key${skuIndex+1}`;
        this.setState({
            [type]:prompt.addZero(attrIndex),
        },()=>{this.generateSKU()});
    };

    showModal=(type)=>{
        const {classId,product_id,product} = this.state;
        if(product.anmro_price == "暂无报价"){message.error("该商品暂时不支持比价");return false}
        const {store} = this.props;
        store.contrast.getDBValue();
        // const contrastLength = store.contrast.contrast.length;
        const goods={
            class_id:product.brand_name,
            id:product_id,
            pic:product.pic[0],
            sku:product_id,
            title:product.title,
            merchant_id:product_id,
            type:"jd"
        };
        store.contrast.domPosition = 0;
       /* if(contrastLength >= 5){
            message.error("最多添加5条商品进行比价");
            return false;
        }*/
        store.contrast.addContrast(goods);
        // store.contrast.isShowModal(true,product_id,product.class_id,goods,type);
    };
   
    //收藏\取消收藏
    isCollection=()=>{
        const {isCollection,product,product_id} = this.state;
        if(product.anmro_price == "暂无报价"){message.error("该商品暂时不支持收藏");return false}
        const data={
            product_id,
            type:isCollection ? 0 : 1,
            title:product.title,
            pic:product.pic[0],
            price:product.anmro_price,
        };
        api.axiosPost("collection_product_jd",data).then((res)=>{
            if(res.data.code == 1){
                message.success(res.data.msg);
                this.setState({isCollection:!isCollection})
            }else{
                message.error(res.data.msg)
            }
        });

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
    addSPcar(e){
        const {product} = this.state;
        const {store} = this.props;
        if(product.anmro_price == "暂无报价"){
            message.error("暂无库存，不能加入购物车");
            return;
        }
        const data={
            sku:this.state.product_id,
            product_id:this.state.product_id,//← 商品id
            count:this.state.payNumber, // ← 数量
            type:"jd",
            title:product.title,
            pic:product.pic[0],
            price:product.anmro_price
        };
        api.axiosPost('addShoppingCartData',data) .then((res)=>{
             if(res.data.code == 1){
                 message.success("加入成功");
                 store.shoppingCart.getShoppingNumber();
             }else{
                 message.error(res.data.msg)
             }
        })
    }
    //收藏店铺
    collection_merchant_list=()=>{
        const {jd_collection} = this.state;
        const data={
            merchant_id:1,
            type:jd_collection ? 0 : 1
        };
        api.axiosPost("collection_merchant",data).then((res)=>{
            if(res.data.code == 1){
                message.success(res.data.msg)
                this.setState({
                    jd_collection:jd_collection ? 0 :1
                })
            }else{
                message.error(res.data.msg)
            }
        })
    }
    // ↓ ---------------------- 立即购买 ---------------------
    buyIimmediately = () => {
        const {product, payNumber, url} = this.state;
        
        if(product.anmro_price == "暂无报价"){
            message.error("暂无库存，不能立即购买");
            return;
        }
        const data={
            sku: this.state.product_id,
            product_id: this.state.product_id,//← 商品id
            count: payNumber, // ← 数量
            type: 'jd',
            title: product.title,
            pic: product.pic.length && product.pic[0],
            price: product.anmro_price,
            act_type: 101,  // 立即购买的状态
        };
        api.axiosPost('buyIimmediately',data).then((res)=>{
            // console.log('立即购买', res);
            
             if(res.data.code == 1){
                const buyIimmediaGoods = {}
                
                 let goodsList = {
                    count: payNumber,
                    id: res.data.data,
                    inventory: '有货',
                    param: "",
                    pic: product.pic.length && product.pic[0],
                    price: product.anmro_price,
                    price_count: product.anmro_price*payNumber.toFixed(2),
                    product_id: this.state.product_id,
                    state: 1,
                    title: product.title,
                    type: 'jd',
                    unit: ''
                 }
                 buyIimmediaGoods[`-1_昂牛自营`] = [goodsList]

                 sessionStorage.setItem('buyIimmediaGoods', JSON.stringify(buyIimmediaGoods));
                 history.push("/order");
             }else{
                 message.error(res.data.msg)
             }
        })
    };



    render(){
        const {isCollection,class_name_1,class_name_2,class_name_3,param,attribute,product,spinLoad,jd_collection,title} = this.state;
        return(
            <div className="goodDetails">
                <Nav isFixed={true} />
                {/*<Header/>*/}
                <Spin spinning={spinLoad}>
                    <div>
                        <div className="goods-details-box">
                            <Breadcrumb className="breadcrumb" separator=">">
                                <Breadcrumb.Item>
                                    <Link to='/home'>首页</Link>
                                </Breadcrumb.Item>
                                {
                                    class_name_1 ?
                                        <Breadcrumb.Item>
                                            <a href="javascript:;">
                                                {class_name_1}
                                            </a>
                                        </Breadcrumb.Item>
                                        :
                                        <Breadcrumb.Item>
                                            {title}
                                        </Breadcrumb.Item>
                                }
                                {
                                    class_name_2 ?
                                        <Breadcrumb.Item>
                                            <a href="javascript:;">
                                                {class_name_2}
                                            </a>
                                        </Breadcrumb.Item>
                                        :''
                                }
                                {
                                    class_name_3 ?
                                        <Breadcrumb.Item>
                                            <a href="javascript:;">
                                                {class_name_3}
                                            </a>
                                        </Breadcrumb.Item>
                                        :''
                                }

                            </Breadcrumb>


                            <div className="goods-introduce">
                                <div className="goods-img-big-box">
                                    <ImgBig pic_cont={product.pic}/>
                                </div>
                                <div className="goods-introduce-box">
                                    <div className="goods-title-box">
                                        <h4>
                                            {product.title}
                                        </h4>
                                        <div className="goods-price">
                                            价格: <span>￥{product.anmro_price}</span>
                                        </div>
                                        <div className="goods-collection-box">
                                            {/*<Icon type="heart" />*/}
                                            <span className={isCollection ? "collection" : ""} onClick={this.isCollection}>
                                        <Icon type="heart" theme={isCollection ? "filled" : ""} />
                                        收藏
                                    </span>
                                        </div>
                                    </div>
                                    <div className="goods-instructions-box">
                                        <ul>
                                            <li>
                                                {/*<p>品&emsp;牌：<span> 史丹利（Stanley） </span> </p>*/}
                                                <p>品&emsp;牌：<span>{product.brand_name}</span> </p>
                                                {/* <p>库存量：<span>{inventory}</span> {product.util}</p> */}
                                            </li>
                                            {/*<li>
                                            <p>起订量：<span> 1 </span><span></span> </p>
                                            <p>发&nbsp;&nbsp;货&nbsp;&nbsp;日：<span> 立即发货 </span> </p>
                                        </li>*/}
                                            {/*<li>
                                            <p>库存量：<span>{inventory}</span> {product.util}</p>
                                        </li>*/}
                                        </ul>
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
                                            <Button type='primary'
                                                    className='add-shopping-btn'
                                                    onClick={this.addSPcar.bind(this)}>
                                                <Icon type="shopping-cart" />
                                                加入购物车
                                            </Button>
                                            <Button className='pay-btn' onClick={this.buyIimmediately}>
                                                {/* <i className='iconfont icon-qushi'> </i> &nbsp; */}
                                                立即购买
                                            </Button>
                                            <Button className='pay-btn' onClick={()=>{this.showModal("jd")}}>
                                                {/* <i className='iconfont icon-qushi'> </i> &nbsp; */}
                                                加入比价
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="jd_details_box">
                                <div className="jd_trateName_box">
                                    <div className="trateName_box_title">
                                        <p>四川省昂牛工铁贸科技有限公司</p>
                                    </div>
                                    <div className="trateName_box_tel">
                                        <p><span>地址：四川省 成都市 高新区 中国&emsp;（四川）自由贸易试验区成都府大道北段1700号9栋1单元6层627号</span></p>
                                    </div>
                                    <div className="trateName_box_btn">
                                        <Button onClick={this.collection_merchant_list}>
                                            {jd_collection == 1 ? "取消收藏" : "收藏店铺"}
                                        </Button>
                                        <Button><a href='http://qnc.anmro.cn/#/SupplierDetails?1'>进入店铺</a></Button>
                                    </div>
                                    <div className='jd_brief'>
                                        昂牛工铁贸科技有限公司创立于2016年,旗下包含昂牛铁道商城（www.tdsc360.com）和跨境电商平台(www.goforrail.com)及国内外线下永久体验馆三个业务版块。昂牛集团是专业做铁路物资、工程物资及MRO工业品的B2B、V2V全球电商交易平台。分别为客户供应铁道物资装备、工程物资装备、电力/市政工程物资、小批量零星采购（低值易耗品）、工程非安装设备物资、智能通信信号、强弱四电工程物资、机电设备及配件、电工电料、数码电子类综合、家电产品、酒店用品、劳保用品、办公用品的物资采购。
                                    </div>
                                </div>
                                {/* 后台返回html */}
                                <div className='commodity-product-content'>
                                    <div className='commodity-product-box'>
                                        <div className='commodity-product-title'>商品详情</div>
                                    </div>

                                    <div dangerouslySetInnerHTML={{__html:product.introduction}} className='commodity-product-img'>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Spin>
                <PriceConponents />
                <Footer/>
                <WinButton/>
            </div>
        )
    }
}

export default GoodsDetails