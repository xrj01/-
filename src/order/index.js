import React from "react";
import {Link} from 'react-router-dom';
import Header from "./../components/header";
import Footer from "./../components/footer/newFootHelp/Footer";
import {Icon,Radio,Input,Button,message} from "antd";
import SwitchAdd from "./switchAdd";
import ShippingAddress from "./shippingAddress";
import {inject, observer} from "mobx-react";
import prompt from "../component/prompt";
import api from "./../component/api";
import { createHashHistory } from 'history';
import InvoiceModal from "./invoiceModal";
import "./index.scss";
const TextArea = Input.TextArea;
const history = createHashHistory();
@inject("store")
@observer
class Order extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            switchAddModal:false,   //切换地址弹出层
            addressModal:false,  //新增修改地址
            defaultAddress:[],
            invoiceType:0,
            editAddressData:{},
            isEdit:"add",
            invoiceModal:false,
            addInvoiceType:0,
            invoiceList:[],
            cat_id:"", //购物车id
            address_id:"", //地址id
            order_remark:{},
            jdGoodsIds:[],
            freight:"0.00",
            buttonLoading:false,
            isNoGoods:false,
            invoice_id:"", //发票id
            immediaGoodsData:''
        };
        this.switchRef = React.createRef();
    }
    async componentDidMount() {
       let address_id = await this.getDefaultAddress();
       let Note = await this.setNoteDefault();
       let freight = await this.calculateFreight(address_id);

        //判断是否在当前页面进行刷新
        window.addEventListener('beforeunload', this.beforeunload);
        this.isObjData();
        const buyIimmediaGoods = JSON.parse(sessionStorage.getItem('buyIimmediaGoods'))
        this.setState({
            immediaGoodsData:buyIimmediaGoods
        })
    }

    componentWillUnmount () {
        // 销毁拦截判断是否离开当前页面
        sessionStorage.removeItem('buyIimmediaGoods')
        window.removeEventListener('beforeunload', this.beforeunload);
    };
    //判断当前是否有数据
    isObjData=()=>{
        const {store} = this.props;
        // const selectGoods = store.shoppingCarList.selectGoods;
        const selectGoods = store.shoppingCarList.selectGoods;
        const buyIimmediaGoods = JSON.parse(sessionStorage.getItem('buyIimmediaGoods'))
        let buyGoodsList = buyIimmediaGoods ? buyIimmediaGoods : selectGoods
        // let keyArr = Object.keys(selectGoods);
        let keyArr = Object.keys(buyGoodsList);
        if(keyArr.length == 0){
            this.setState({isNoGoods:true});
        }
    };
    beforeunload (e) {
        let confirmationMessage = '你确定离开此页面吗?';
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    };
    //设置默认的备注数据
    setNoteDefault=()=>{
        const {store} = this.props;
        const {jdGoodsIds} = this.state;
        // const selectGoods = store.shoppingCarList.selectGoods;
        const selectGoods = store.shoppingCarList.selectGoods;
        const buyIimmediaGoods = JSON.parse(sessionStorage.getItem('buyIimmediaGoods'))
        let buyGoodsList = buyIimmediaGoods ? buyIimmediaGoods : selectGoods
        const order_remark = {};
        for(let key in buyGoodsList){
            if(buyGoodsList[key].length>0){
                {
                    buyGoodsList[key] && buyGoodsList[key].map((item)=>{
                        order_remark[item.id] = "";
                        if(item.type == "jd"){
                            jdGoodsIds.push(item.id)
                        }
                    })
                }
            }
        }
        this.setState({ order_remark,jdGoodsIds })
    };
    //发票类型
    setInvoiceType=(invoiceType)=>{
        let {invoice_id} = this.state;
        if(invoiceType == 0){
            invoice_id = 0;
        }
        this.setState({
            invoiceType,
            invoice_id,
            addInvoiceType:invoiceType - 1
        },()=>{
            this.getInvoiceList();
        })
    };
    //获取默认地址
    getDefaultAddress=(isTrue)=>{
        return api.axiosPost("get_default_address").then((res)=>{
            if(res.data.code == 1){
                const defaultAddress = res.data.data.address;
                const address_id = defaultAddress && defaultAddress.length>0 && defaultAddress[0].id;
                this.setState({
                    defaultAddress,
                    address_id
                },()=>{
                    if(isTrue){
                        this.calculateFreight()
                    }
                });
                return address_id
            }
        })
    };
    //隐藏显示弹出层
    isShowModal=(type,isTrue)=>{
        const {defaultAddress} = this.state;
        this.setState({
            [type]:isTrue
        },()=>{
            if(type == "switchAddModal" && isTrue){
                this.switchRef.current.getAddressList(defaultAddress[0] && defaultAddress[0].id);
            }
            if(type == "addressModal" && isTrue){
                this.setState({
                    editAddressData:{},
                    isEdit:"add"
                });
                this.addModalRef.getArea()
            }
        });
    };
    //备注信息修改
    noteChange=(type,value)=>{
        const {order_remark} = this.state;
        order_remark[type] = value;
        this.setState({ order_remark })
    };
    //渲染已勾选的商品数据
    renderGoods=()=>{
        const {store} = this.props;
        const selectGoods = store.shoppingCarList.selectGoods;
        const buyIimmediaGoods = JSON.parse(sessionStorage.getItem('buyIimmediaGoods'))
        let buyGoodsList = buyIimmediaGoods ? buyIimmediaGoods : selectGoods
        // buyIimmediaGoods
        // console.log('---buyIimmediaGoods---', buyGoodsList)
        const divDom = [];
        for(let key in buyGoodsList){
            const name = key.substring(key.indexOf("_")+1);
            const id = key.substring(0,key.indexOf("_"));
            if(buyGoodsList[key].length>0){
                divDom.push(
                    <div className="order-goods-information-body">
                        <h3>{name === "undefined" ? "" : name}</h3>
                        {
                            buyGoodsList[key] && buyGoodsList[key].map((item)=>{
                                return(
                                    <div>
                                        <div className="order-goods-information-list" key={item.id}>
                                            <div>
                                                <img src={item.type == 'jd' ? item.pic : prompt.imgUrl(id,item.product_id)} alt=""/>
                                                <div className="goods-content-order">
                                                    <h1>
                                                        {item.title && item.title.length > 50 ? `${item.title.substring(0,50)}...` : item.title}
                                                    </h1>
                                                    <p>
                                                        {item.param && item.param.length > 50 ? `${item.param.substring(0,50)}...` : item.param}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>￥{item.price}</div>
                                            <div>{item.count} {item.util}</div>
                                            <div>{item.price_count}</div>
                                            <div>
                                                <span>￥{item.price_count}</span>
                                            </div>
                                        </div>
                                        <div className="order-note">
                                            <span>
                                                备注：
                                            </span>
                                            <Input onChange={(e)=>{this.noteChange(item.id,e.target.value)}} placeholder='输入备注信息,最多100字符' maxLength={100}>

                                            </Input>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        }
        return divDom;
    };
    //获取当前地址详情
    getAddressDetails=(id)=>{
        const data = {id};
        api.axiosPost("getAddressById",data).then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    editAddressData:res.data.data,
                    addressModal:true,
                    isEdit:"edit"
                },()=>{
                    this.addModalRef.getRegionData(res.data.data,id);
                });
            }
        })
    };
    //编辑后的地址
    editAddress=(newAddress)=>{
        const {defaultAddress} = this.state;
        newAddress.id = defaultAddress[0].id;
        if(newAddress.address_1 == ""){
            newAddress.address_1 = defaultAddress[0].address_1;
        }
        if(newAddress.address_2 == ""){
            newAddress.address_2 = defaultAddress[0].address_2;
        }
        if(newAddress.address_3 == ""){
            newAddress.address_3 = defaultAddress[0].address_3;
        }
        defaultAddress[0] = newAddress;
        this.setState({defaultAddress})
    };
    //切换收货地址
    switchAddress=(address)=>{
        const {defaultAddress} = this.state;
        defaultAddress[0] = address;
        this.setState({
            defaultAddress,
            address_id:address.id
        },()=>{
            this.calculateFreight();
        })
    };
    //获取发票列表
    getInvoiceList=()=>{
        const {addInvoiceType} = this.state;
        if(addInvoiceType < 0){return false};
        const data={invoice_type:addInvoiceType};
        api.axiosPost("invoiceList",data).then((res)=>{
            if(res.data.code == 1){
                const invoiceList = res.data.data;
                const invoice_id = invoiceList && invoiceList.length > 0 && invoiceList[0].id;
                this.setState({
                    invoiceList,
                    invoice_id
                });
            }
        })
    };
    //发票id
    onChangeRadio=(e)=>{
        this.setState({
            invoice_id:e.target.value
        })
    };
    //点击提交订单
    submitOrder=()=>{
        const {store} = this.props;
        const {address_id,invoice_id,order_remark,isNoGoods,invoiceType} = this.state;
        const buyIimmediaGoods = JSON.parse(sessionStorage.getItem('buyIimmediaGoods'))
        const cat_id = buyIimmediaGoods ? `${buyIimmediaGoods[Object.keys(buyIimmediaGoods)[0]][0].id}` : store.shoppingCarList.ids;

        if(invoiceType && !invoice_id){message.error("请选择发票信息");return false}
        if(isNoGoods){message.error("商品数据丢失,前往购物车选取商品");return false}
        if(!address_id){message.error("没有收货地址,去选择一个吧");return false}
        const data={
            pay_type:0,
            cat_id,
            address_id,
            invoice_id:invoice_id ? invoice_id : 0,
            order_remark
        };
        this.setState({
            buttonLoading:true
        },()=>{
            api.axiosPost("submitOrder",data).then((res)=>{
                if(res.data.code == 1){
                    const order_id = res.data.data;
                   store.shoppingCarList.removeGoods();
                    this.setState({buttonLoading:false},()=>{
                        history.push(`/payOrder?order_id=${order_id}`);
                    })
                }else{
                    message.error(res.data.msg);
                    this.setState({buttonLoading:false})
                }
            })
        });


    };
    //获取运费
    calculateFreight=(address)=>{
        const {jdGoodsIds,address_id} = this.state;
        const data={
            address_id: address ? address : address_id,
            jd_product_id:jdGoodsIds
        };
        if(jdGoodsIds.length == 0 || !data.address_id){return false}
        api.axiosPost("calculate_freight",data).then((res)=>{
            if(res.data.code == 1){
                this.setState({freight:res.data.data})
            }else{
                message.error(res.data.msg)
            }
        });
    };
    render(){
        const {store} = this.props;
        const {buttonLoading,address_id,freight,invoiceList,switchAddModal,addressModal,defaultAddress,invoiceType,editAddressData,isEdit,invoiceModal,addInvoiceType, immediaGoodsData} = this.state;
        const switchData = {
            switchAddModal,
            isShowModal:this.isShowModal,
            switchAddress:this.switchAddress
        };
        const addressData={
            display:addressModal,
            isShowModal:this.isShowModal,
            isEdit,
            address_id:address_id,
            editAddressData,
            editAddress:this.editAddress,
            getDefaultAddress:this.getDefaultAddress
        };
        const invoiceData={
            invoiceModal,
            addInvoiceType,
            getInvoiceList:this.getInvoiceList,
            isShowModal:this.isShowModal
        };
        // const imFirstkey = Object.keys(immediaGoodsData)[0]
        // console.log('imFirstkey', imFirstkey);
        // console.log('immediaGoodsData', immediaGoodsData && immediaGoodsData[imFirstkey][0]);
        const buyIimmediaGoods = sessionStorage.getItem('buyIimmediaGoods') ? JSON.parse(sessionStorage.getItem('buyIimmediaGoods')) : ''
        const buyIimmediaGoodsKey = buyIimmediaGoods && Object.keys(buyIimmediaGoods)[0]
        const IimmediaFirstData = buyIimmediaGoods && buyIimmediaGoods[buyIimmediaGoodsKey][0]
        return(
            <div className='order-box'>
                <Header isUser={false}/>
                <div className="order-information-box">
                    <h5>填写订单信息</h5>

                    <div className="the-goods-adds-box">
                        <div className="the-goods-adds-head">
                            <p>收货地址</p>
                            {
                                defaultAddress.length != 0 && <span onClick={()=>{this.isShowModal("switchAddModal",true)}}><Icon type="sync" /> 切换收货地址</span>
                            }
                            <span onClick={()=>{this.isShowModal("addressModal",true)}}><Icon type="plus" /> 新增收货地址</span>
                        </div>
                        <div className="the-goods-adds">
                            {
                                defaultAddress.length == 0 && <p>暂无地址信息，立即新增一个吧~</p>
                            }
                            {
                                defaultAddress.length > 0 &&
                                defaultAddress.map((item)=>(
                                    <div className="the-goods-adds-list">
                                        <Radio checked={true}>{item.consignee}</Radio>&emsp;
                                        {item.address_1}{item.address_2}{item.address_3}{item.address_info}&emsp;&emsp;{item.phone} &emsp;
                                        {item.state == 0 && <span>默认地址</span>}
                                        <a href="javascript:;" onClick={()=>{this.getAddressDetails(item.id)}}>修改收货地址</a>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="order-invoice-box">
                        <h5>发票信息</h5>
                        <div className="order-invoice-list">
                            <div onClick={()=>{this.setInvoiceType(0)}} className={invoiceType == 0 && "active"}>集中开票</div>
                            <div onClick={()=>{this.setInvoiceType(2)}} className={invoiceType == 2 && "active"}>增值税专票</div>
                            <div onClick={()=>{this.setInvoiceType(1)}} className={invoiceType == 1 && "active"}>普通发票</div>
                        </div>
                        {
                            invoiceType !== 0 &&
                            <div>
                                <Radio.Group onChange={this.onChangeRadio} value={this.state.invoice_id}>
                                    {
                                        invoiceList && invoiceList.map((item,index)=>(
                                            <Radio value={item.id}>{item.company}&emsp;</Radio>
                                        ))
                                    }
                                </Radio.Group>
                                <a onClick={()=>{this.isShowModal("invoiceModal",true)}} href="javascript:;">新增{ invoiceType == 2 ? "增值税专票" : "普通发票"}</a>
                            </div>
                        }
                    </div>


                    <div className="order-goods-information-box">
                        <div className="order-goods-information-title">
                            <h5>商品信息</h5>
                            <Link to="/ShoppingCart">返回购物车修改</Link>
                        </div>
                        <div className="order-goods-information-head">
                            <div>商品信息</div>
                            <div>单价</div>
                            <div>数量(单位)</div>
                            <div>小计</div>
                            <div>实付</div>
                        </div>

                        {
                            this.renderGoods()
                        }
                    </div>


                    <div className="order-other-information-box">
                        <h3>支付方式</h3>
                        <div className="order-other-pay">
                            <div className="order-invoice-list" style={{padding:0}}>
                                <div className='active'>账期支付</div>
                            </div>
                        </div>

                        {/*<h3 style={{border:"none"}}>备注信息</h3>
                        <TextArea placeholder='请输入备注信息'/>*/}

                        <h3>金额明细</h3>

                        <div className="order-amount-detail">
                            <div>
                                <p>
                                    <span>{IimmediaFirstData ? IimmediaFirstData.count : store.shoppingCarList.selectNumber}</span>件商品，商品总价：
                                </p>
                                <span>￥{IimmediaFirstData ? IimmediaFirstData.price : store.shoppingCarList.selectPrice}</span>
                            </div>
                            <div>
                                <p>
                                    运费：
                                </p>
                                <span>￥{freight}</span>
                            </div>
                        </div>

                        <div className="order-amount-number">
                            <h2>
                                应付总额：
                                <span>￥{(Number(IimmediaFirstData ? IimmediaFirstData.price_count:store.shoppingCarList.selectPrice) + Number(freight)).toFixed(2)}</span>
                            </h2>
                            {
                                defaultAddress.length == 0 && <p>暂无地址信息，立即新增一个吧~</p>
                            }
                            {
                                defaultAddress.length > 0 &&
                                defaultAddress.map((item)=>(
                                    <p>
                                        收货地址：{item.address_1}{item.address_2}{item.address_3}{item.address_info} &emsp;
                                        收货人：{item.consignee}
                                    </p>
                                ))
                            }
                        </div>

                        <div className="order-sub-box">
                            <Button type='primary' loading={buttonLoading} onClick={this.submitOrder}>提交订单</Button>
                        </div>
                    </div>
                </div>
                <Footer />


                { /*切换地址弹出层*/ }
                <SwitchAdd {...switchData} ref={this.switchRef}/>
                {/* 新增修改地址*/}
                <ShippingAddress wrappedComponentRef={(e)=>{ this.addModalRef = e }} {...addressData}/>

                {/*新增发票管理*/}
                <InvoiceModal {...invoiceData}/>
            </div>
        )
    }
}
export default Order;