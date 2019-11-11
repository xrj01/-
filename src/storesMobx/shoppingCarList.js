import { observable, computed, action } from 'mobx';
import { message } from 'antd';
import {axiosPost,axiosGet} from "./../component/axios";
import api from "../component/api";
class shoppingCartList{
    @observable selectGoods = {}; //购物车数量
    @observable selectNumber = 0; //购物车勾选数量
    @observable selectPrice = 0.00; //购物勾选的价格
    @observable ids = ""; //购物勾选的价格
    @observable buyIimmediaGoods = {}; // 立即购买的商品
    @observable isIimmedia = false;    // 是否是立即购买

    @action editGoods=(goods={})=>{
        this.selectGoods = goods;
        this.isIimmedia = false
    };
    @action editBuyGoods = (goods={}) => {
        this.buyIimmediaGoods = goods
        this.isIimmedia = true
    }
    @action removeGoods=()=>{
        this.selectGoods = {};
        this.selectNumber = 0; //购物车勾选数量
        this.selectPrice = 0.00; //购物勾选的价格
        this.ids = ""; //购物勾选的价格
    };
    @action setGoodsNumber=(selectNumber,selectPrice)=>{
        this.selectNumber = selectNumber;
        this.selectPrice = selectPrice;
    };
    @action setIds=(ids)=>{
        this.ids = ids;
    }
}

export default shoppingCartList