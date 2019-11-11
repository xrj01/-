import React from "react";
import {Checkbox ,InputNumber,message,Spin} from "antd";
import {Link} from "react-router-dom";
import Header from "./../components/header/";
import Footer from "../components/footer/newFootHelp/Footer";
import api from "./../component/api";
import Modal from "./modal";
import {inject, observer} from "mobx-react";
import prompt from "../component/prompt";
import NullDhopping from "./nullShopping";
import {createHashHistory} from "history";
import "./index.scss";
const history = createHashHistory();
@inject("store")
@observer
class ShoppingCart extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            displayModal:false,
            performFn:false,
            cart_id:"",
            modalTitle:"选择一种商品",
            normalList:[],  //有效的商品列表
            offShelvesList:[],  //下架的商品列表
            merchantGroupCheck:{}, //控制全选
            isShowNumber:false, //提示没选择商品
            checkedAll:false,
            isNull:true,
            spinning:true,
            selectNumber:0,  //已选择商品的件数
            selectPrice:"0.00", //已选择商品的价格
            failure:[],  //失效商品是否有勾选
            windowHeight:0
        }
    }
    componentDidMount() {
        this.getShoppingCartList();
        const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        this.setState({
            windowHeight,
        },()=>{
            window.addEventListener('scroll', this.scrollHandler);
        })
    }
    scrollHandler=(e)=>{
        let shoppingFooter = document.getElementById("shopping-footer-box");
        const {windowHeight} = this.state;
        const StandardValues = document.getElementById("root").offsetHeight;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if((StandardValues - (scrollTop + windowHeight) ) > 230){
            if(shoppingFooter){
                shoppingFooter.className="shopping-footer-statistical-box shopping-footer-statistical-fixed"
            }
        }else{
            if(shoppingFooter){
                shoppingFooter.className = "shopping-footer-statistical-box";
            }
        }
    };
    componentWillUnmount=()=>{
        window.removeEventListener('scroll', this.scrollHandler);
    };
    //获取购物车列表
    getShoppingCartList=(isTrue)=>{
        const {store} = this.props;
        api.axiosPost("shoppingCartList").then((res)=>{
            if(res.data.code == 1){
                const merchantGroupCheck = {};
                const listData = res.data.data;
                const normalList = listData.normal;
                const offShelvesList = listData.off_shelves;
                let isNull = true;
                if(normalList.length == 0 && offShelvesList.length == 0){
                    isNull = false;
                }
                normalList && normalList.length>0 && normalList.map((item,index)=>{
                    const listChecked = [];
                    const goodsList = [];
                    item.list && item.list.map((list)=>{
                        listChecked.push(list.id);
                        goodsList.push(list)
                    });
                    merchantGroupCheck[item.merchant_id]={
                        isChecked:false,
                        checkAll:false,
                        listChecked,
                        selectList:[],
                        goodsList,
                    }
                });
                this.setState({
                    normalList,
                    offShelvesList,
                    merchantGroupCheck,
                    isNull,
                    checkedAll:false,
                    isShowNumber:false,
                    selectNumber:0,  //已选择商品的件数
                    selectPrice:"0.00" //已选择商品的价格
                },()=>{
                    store.shoppingCarList.setIds("");
                    if(isTrue){
                        store.shoppingCarList.selectGoods = {};
                    }
                    this.echoSelectGoods();
                })
            }else{
                message.error(res.data.msg)
            }
            this.setState({spinning:false})
        })
    };
    //购物车数量加减
    operationNumber=(type,goods)=>{
        const {store} = this.props;
        const {normalList} = this.state;
        if(type == "+"){
            goods.count += 1;
        }else if(type == "-"){
            goods.count -= 1;
            if(goods.count <=1){
                goods.count = 1;
            }
        }else{
            goods.count = parseInt(type);
        }
        if(goods.count > goods.inventory){
            this.setState({
                modalTitle:"商品数量超限，购买请联系028-83368980！",
                displayModal:true,
                performFn:false,
                normalList
            });
            return false;
        }
        if(goods.count <=0 || !goods.count){
            return false
        }
        const data={
            cart_id:goods.id,
            count:goods.count
        };
        api.axiosPost("shoppingUpdateCount",data).then((res)=>{
            if(res.data.code == 1){
                goods.price_count = res.data.data.price;
                store.shoppingCart.editShoppingNumber(res.data.data.product_count);
                this.setState({normalList},()=>{this.traverseSelectGoods()});
            }else{
                message.error(res.data.msg)
            }
        });
    };
    //删除购物车弹出框
    deleteShoppingModal=(cart_id)=>{
        this.setState({
            modalTitle:"删除商品？",
            displayModal:true,
            performFn:true,
            cart_id:`${cart_id}`
        })
    };
    //删除购物车
    deleteShopping=()=>{
        const {store} = this.props;
        const data = { cart_id:this.state.cart_id };
        api.axiosPost("shoppingDelete",data).then((res)=>{
            if(res.data.code == 1){
                message.success(res.data.msg);
                this.getShoppingCartList(true);
                store.shoppingCart.getShoppingNumber();
            }else{
                message.error(res.data.msg)
            }
        })
    };
    //隐藏弹出层
    hideModal=(isFun)=>{
        this.setState({
            displayModal:false,
            performFn:false
        },()=>{
            if(isFun){
                this.deleteShopping();
            }
        });
    };
    //商家下面的数组选择
    merchantCheck=(checkedValues,merchant_id,name)=>{
        const {store} = this.props;
        const selectGoods = store.shoppingCarList.selectGoods;
        const {merchantGroupCheck} = this.state;
        const goodsList = merchantGroupCheck[merchant_id] ? merchantGroupCheck[merchant_id].goodsList : [];
        let checkedAll = true;
        if(merchantGroupCheck[merchant_id]){
            merchantGroupCheck[merchant_id].checkAll = checkedValues.length === merchantGroupCheck[merchant_id].listChecked.length;
            merchantGroupCheck[merchant_id].isChecked = !!checkedValues.length && checkedValues.length < merchantGroupCheck[merchant_id].listChecked.length;
            merchantGroupCheck[merchant_id].selectList = checkedValues;
        }
        selectGoods[`${merchant_id}_${name}`]=[];
        goodsList.map((item)=>{
            checkedValues.map((val)=>{
                if(val == item.id){
                    selectGoods[`${merchant_id}_${name}`].push(item)
                }
            })
        });
        //控制最上层的全选状态
        for(let key in merchantGroupCheck){
            if(merchantGroupCheck[key].checkAll == false){
                checkedAll = false
            }
        }
        store.shoppingCarList.editGoods(selectGoods);
        this.setState({merchantGroupCheck,checkedAll},()=>{this.traverseSelectGoods()})
    };
    //商家选择框勾选
    merchantGroupCheck=(isChecked,merchant_id,name,isFor)=>{
        const {merchantGroupCheck} = this.state;
        const {store} = this.props;
        const selectGoods = store.shoppingCarList.selectGoods;
        let checkedAll = true;
        merchantGroupCheck[merchant_id].isChecked = false;
        merchantGroupCheck[merchant_id].checkAll = isChecked;
        merchantGroupCheck[merchant_id].selectList = isChecked ? merchantGroupCheck[merchant_id].listChecked : [];
        if(isChecked){
            selectGoods[`${merchant_id}_${name}`] = merchantGroupCheck[merchant_id].goodsList
        }else{
            selectGoods[`${merchant_id}_${name}`] = [];
        }
        if(!isFor){
            //控制最上层的全选状态
            for(let key in merchantGroupCheck){
                if(merchantGroupCheck[key].checkAll == false){
                    checkedAll = false
                }
            }
        }
        store.shoppingCarList.editGoods(selectGoods);
        this.setState({merchantGroupCheck,checkedAll},()=>{this.traverseSelectGoods()})
    };
    //遍历出已勾选的商品
    traverseSelectGoods=()=>{
        // let {selectGoods} = this.state;
        const {store} = this.props;
        const selectGoods = store.shoppingCarList.selectGoods;
        let selectNumber = 0;
        let selectPrice = 0;
        let isShowNumber = true;
        let ids = "";
        for(let key in selectGoods){
            selectGoods[key] && selectGoods[key].map((item)=>{
                selectNumber += item.count;
                selectPrice += Number(item.price_count);
                if(ids == ""){
                    ids +=item.id
                }else{
                    ids += `,${item.id}`
                }
            });
        }
        if(selectNumber == 0){isShowNumber=false}
        selectPrice = selectPrice.toFixed(2);
        store.shoppingCarList.setIds(ids);
        store.shoppingCarList.setGoodsNumber(selectNumber,selectPrice);
        this.setState({selectNumber,selectPrice,isShowNumber})
    };
    //隐藏显示下单结算
    settlement=()=>{
        const {selectNumber,failure} = this.state;
        const {store} = this.props;
        const selectGoods = store.shoppingCarList.selectGoods;
        if(failure.length>0){message.error("下架商品不能下单结算");return false;}
        if(selectNumber == 0){
            this.setState({isShowNumber:true});
            return false;
        }
        let ids="";
        for(let key in selectGoods){
            selectGoods[key] && selectGoods[key].map((item)=>{
                if(ids == ""){
                    ids += item.id
                }else{
                    ids += ","+item.id
                }
            });
        }
        const data={cat_id:ids};
        api.axiosPost("check_inventory",data).then((res)=>{
            if(res.data.code == 1){
                history.push("/order");
            }else{
                this.setState({
                    modalTitle:`${res.data.msg}，购买请联系028-83368980！`,
                    displayModal:true,
                    performFn:false
                });
            }
        })
    };
    //购物车全选
    shoppingAllSelect=(e)=>{
        const {normalList} = this.state;
        const isChecked = e.target.checked;
        normalList.map((item,index)=>{
            this.merchantGroupCheck(isChecked,item.merchant_id,item.merchant_name,false)
        });
        this.setState({checkedAll:isChecked})
    };
    //批量删除
    batchDelete=()=>{
        let {selectNumber,failure} = this.state;
        const {store} = this.props;
        let ids= store.shoppingCarList.ids;
        if(selectNumber == 0 && failure.length ==0){
            this.setState({
                modalTitle:"至少选择一个商品",
                displayModal:true,
                performFn:false,
            });
            return false;
        }
        failure.map((item)=>{
            if(ids == ""){
                ids += item
            }else{
                ids += `,${item}`
            }
        });
        this.deleteShoppingModal(ids);
    };

    //回显已勾选的商品
    echoSelectGoods=()=>{
        const {store} = this.props;
        const selectGoods = store.shoppingCarList.selectGoods;
        for(let key in selectGoods){
            const checkedValues=[];
            const name = key.substring(key.indexOf("_")+1);
            const id = key.substring(0,key.indexOf("_"));
            selectGoods[key] && selectGoods[key].map((item)=>{
                checkedValues.push(item.id);
            });
            this.merchantCheck(checkedValues,id,name)
        }
    };
    //失效的商品勾选
    failureChange=(checkedId,isChecked)=>{
        const {failure} = this.state;
        if(isChecked){
            failure.push(checkedId)
        }else{
            failure.splice(failure.indexOf(checkedId),1)
        }
        this.setState({ failure })
    };

    render(){
        const {store} = this.props;
        const {spinning,isNull,normalList,offShelvesList,displayModal,modalTitle,performFn,merchantGroupCheck,selectNumber,selectPrice,isShowNumber} = this.state;
        const modalDate={
            displayModal,
            modalTitle,
            performFn,
            hideModal:this.hideModal
        };
        return(
            <div className='shopping-cart'>
                <Header isUser={true} myCart={true}/>
                <div className="shopping-cart-warp" style={{paddingBottom: normalList.length == 0  && offShelvesList.length == 0  && !isNull ? 0 : 116}}>
                    <div className="shopping-cart-box">
                        <h6>我的购物车({store.shoppingCart.shopping})</h6>

                        <Spin spinning={spinning}>
                            <div style={{minHeight:"10px"}}>

                                {
                                    (normalList.length > 0  || offShelvesList.length > 0)  &&
                                    <div className="shopping-cart-list-th">
                                        <span>
                                            <Checkbox checked={this.state.checkedAll} onChange={this.shoppingAllSelect}>全选</Checkbox>
                                        </span>
                                        <span>商品信息</span>
                                        <span>单价</span>
                                        <span>库存(单位)</span>
                                        <span>数量</span>
                                        <span>小计</span>
                                        <span>操作</span>
                                    </div>
                                }
                                {
                                    normalList && normalList.map((item,index)=>{
                                        return(
                                            <div className="shopping-cart-list-td" key={item.merchant_id}>
                                                <div className="shopping-cart-merchants-box">
                                                    <Checkbox
                                                        onChange={(e)=>{this.merchantGroupCheck(e.target.checked,item.merchant_id,item.merchant_name)}}
                                                        checked={merchantGroupCheck[item.merchant_id].checkAll}
                                                        indeterminate={merchantGroupCheck[item.merchant_id].isChecked} value={item.merchant_id}>{item.merchant_name}</Checkbox>
                                                </div>
                                                <Checkbox.Group style={{width:"100%"}}
                                                                value={merchantGroupCheck[item.merchant_id].selectList}
                                                                onChange={(checkedValues)=>{this.merchantCheck(checkedValues,item.merchant_id,item.merchant_name)}} >
                                                    {
                                                        item.list && item.list.map((goods,i)=>{
                                                            return(
                                                                <div className="shopping-cart-list-goods-box" key={goods.id}>
                                                                    <div>
                                                                        <Checkbox value={goods.id}/>
                                                                    </div>
                                                                    <div>
                                                                        <div className='good-img'><img src={goods.type == "jd" ? goods.pic : prompt.imgUrl(item.merchant_id,goods.product_id)} onError={(e)=>{e.target.style.background = 'transparent'}} alt=""/></div>
                                                                        <div className="shopping-cart-goods-content">
                                                                            <h5 title={goods.title}>
                                                                                <Link to={goods.type == 'jd' ? `/JDgoodsDetails?${goods.product_id}` : `/GoodsDetails?${goods.product_id}`}>
                                                                                    {goods.title && goods.title.length > 50 ? `${goods.title.substring(0,50)}...` : goods.title}
                                                                                </Link>
                                                                            </h5>
                                                                            <p title={goods.param}>
                                                                                {goods.param && goods.param.length > 50 ? `${goods.param.substring(0,50)}...` : goods.param}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        ￥{goods.price}
                                                                    </div>
                                                                    <div>
                                                                        {goods.inventory} {goods.util}
                                                                    </div>
                                                                    <div>
                                                                        <div className="shopping-cart-td-box">
                                                                            <button className={goods.count == 1 ? "no-cursor" : ""} onClick={()=>{this.operationNumber("-",goods,item.merchant_id)}}>-</button>
                                                                            <InputNumber
                                                                                onChange={(value)=>{this.operationNumber(value,goods,item.merchant_id)}}
                                                                                min={1}
                                                                                value={goods.count}/>
                                                                            <button className={goods.count >= goods.inventory ? "no-cursor" : ""} onClick={()=>{this.operationNumber("+",goods,item.merchant_id)}}>+</button>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        ￥{goods.price_count}
                                                                    </div>
                                                                    <div>
                                                                        <span onClick={()=>{this.deleteShoppingModal(goods.id)}}>删除</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Checkbox.Group >
                                            </div>
                                        )
                                    })
                                }
                                {/*下架商品*/}
                                {
                                    offShelvesList && offShelvesList.length > 0 &&
                                    <div className="shopping-cart-list-td">
                                        <div className="shopping-cart-merchants-box">
                                            失效商品
                                        </div>
                                        {
                                            offShelvesList && offShelvesList.map((item,index)=>{
                                                return(
                                                    <div className="shopping-cart-list-goods-box shelves-goods" key={item.id}>
                                                        <div>
                                                            <Checkbox onChange={(e)=>{this.failureChange(item.id,e.target.checked)}}/>
                                                        </div>
                                                        <div>
                                                            <img src={prompt.imgUrl(item.merchant_id,item.product_id)} alt=""/>
                                                            <div className="shopping-cart-goods-content">
                                                                <h5 title={item.title}>
                                                                    {item.title && item.title.length > 50 ? `${item.title.substring(0,50)}...` : item.title}
                                                                </h5>
                                                                <p title={item.param}>
                                                                    {item.param && item.param.length > 50 ? `${item.param.substring(0,50)}...` : item.param}
                                                                </p>
                                                                <p style={{color:"#D01D00"}}>{item.state == 1 ? "库存不足" : "已下架"}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            ￥{item.price}
                                                        </div>
                                                        <div>
                                                            {item.inventory}
                                                        </div>
                                                        <div>
                                                            <div className="shopping-cart-td-box">
                                                                <button >-</button>
                                                                <InputNumber disabled={true} min={1} value={item.count}/>
                                                                <button >+</button>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            ￥{item.price_count}
                                                        </div>
                                                        <div>
                                                            <span onClick={()=>{this.deleteShoppingModal(item.id)}}>删除</span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        </Spin>
                        {
                            normalList.length == 0  && offShelvesList.length == 0  && !isNull && <NullDhopping />
                        }

                    </div>

                    {
                        normalList.length>0 && isNull|| offShelvesList.length>0 && isNull?  <div className="shopping-footer-statistical-box" id='shopping-footer-box'>
                            <div className="shopping-footer-box" >
                                <div>
                                    <Checkbox checked={this.state.checkedAll} onChange={this.shoppingAllSelect}>全选</Checkbox>
                                </div>
                                <div>
                                    <span onClick={this.batchDelete}>删除选中商品</span>
                                </div>
                                <div>
                                    共 <span>{store.shoppingCart.shopping}</span> 件商品，已选择 <span>{selectNumber}</span> 件商品
                                </div>
                                <div>
                                    商品合计：<b>￥{selectPrice}</b>
                                </div>
                                <div>
                                    应付金额：<b>￥{selectPrice}</b>
                                </div>
                                <div onClick={this.settlement} className={`${selectNumber==0 ? "no-cursor" : ""}`}>
                                    下单结算
                                    <div className='no-select-goods-box' style={{display:isShowNumber && selectNumber==0 ? "block" : "none"}}>
                                        请至少选择一件需结算的商品~
                                    </div>
                                </div>
                            </div>
                        </div> : null
                    }

                </div>

                <Footer />
                <Modal {...modalDate}/>
            </div>
        )
    }
}
export default ShoppingCart;