import React from "react";
import "./compare.scss";
import { Table } from 'antd';
import {Link } from "react-router-dom";
import { createHashHistory } from 'history';
import PriceConponents from "./../../components/priceComponents";
import {message,Button,InputNumber } from "antd";
import {observer,inject} from "mobx-react";
import api from "../../component/api";
@inject('store')
@observer



class Compare extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            title: {title: "同品对比"},
            columns: [
                {
                    title: '商品编号',
                    dataIndex: 'article_number'
                }, {
                    title: '商品名称',
                    dataIndex: 'title',
                    render:(text,record)=>{
                        return(
                            <Link target='_blank' to={`/GoodsDetails?${record.product_id}`}>{text}</Link>
                        )
                    }
                },{
                    title: '供应商',
                    dataIndex: 'company',
                    render:(text,record)=>{
                        return(
                            <Link target='_blank' to={`/SupplierDetails?${record.merchant_id}`}>{text}</Link>
                        )
                    }
                },{
                    title: '单价',
                    dataIndex: 'price',
                    sorter: (a, b) => a.compare - b.compare,
                    render:(text)=>{
                        return <span>￥{text}</span>
                    }
                },{
                    title: '对比',
                    dataIndex: 'address',
                    render:(text,record)=>{
                        return(
                            <Button onClick={()=>{this.showModal(record)}}>加入对比</Button>
                        )
                    }
                },{
                    title: '库存',
                    dataIndex: 'inventory',
                    sorter: (a, b) => a.compare - b.compare,
                },{
                    title: '数量',
                    dataIndex: 'quantity',
                    render:(text,record)=>{
                        return(
                            <div className='details-contrast-number'>
                                <button onClick={()=>{this.numberClick("-",record)}}>-</button>
                                <InputNumber onChange={(e)=>{this.numberChange(e,record)}} min={1} value={text}/>
                                <button onClick={()=>{this.numberClick("+",record)}}>+</button>
                            </div>
                        )
                    }
                },{
                    title: '操作',
                    dataIndex: 'make',
                    render:(text,record)=>{
                        return(
                            <Button onClick={()=>{this.addShopping(record)}}>加入购物车</Button>
                        )
                    }
                }],
            contrastDate:[]
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            contrastDate:nextProps.contrastDate
        })
    }
    //加入购物车
    addShopping=(record)=>{
        const {store} = this.props;
        const data={
            sku:record.sku,
            product_id:record.product_id,//← 商品id
            count:record.quantity // ← 数量
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
    //数量加减
    numberClick=(type,record)=>{
        const {contrastDate} = this.state;
        if(type == "+"){
            record.quantity +=1;
        }else{
            record.quantity -=1;
            if(record.quantity <=1){
                record.quantity = 1;
            }
        }
        this.setState({contrastDate})
    };

    numberChange=(value,record)=>{
        const {contrastDate} = this.state;
        if(value){
            record.quantity = value;
        }
        this.setState({contrastDate})
    };

    //加入比价
    showModal=(record)=>{
        const {class_Id} = this.props;
        const {store} = this.props;
        const contrastLength = store.contrast.contrast.length;
        const goods={
            class_id:class_Id,
            id:record.product_id,
            title:record.title,
            sku:record.sku,
            skuVal:record.skuVal,
            merchant_id:record.merchant_id
        };
        store.contrast.domPosition = 0;
        if(contrastLength >= 5){
            message.error("最多添加5条商品进行比价");
            return false;
        }
        // store.contrast.isShowModal(true,record.product_id,class_Id,goods,"",true);
        store.contrast.addContrast(goods);
    };

    render(){
        const {contrastDate} = this.state;
        return(
            <div className="commodity" style={{display:contrastDate.length ? "block" : "none"}}>
                <div className="compare_title_box">
                 <span className="title">
                     {this.state.title.title}
                 </span>
                </div>
                <div className="compare_table">
                    <Table columns={this.state.columns}
                           dataSource={contrastDate}
                           pagination = {false}
                    />
                </div>
            </div>
        )
    }

}export default Compare
