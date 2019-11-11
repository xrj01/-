import { observable, computed, action } from 'mobx';
import { message } from 'antd';
import {axiosPost,axiosGet} from "./../component/axios";
import api from "../component/api";

class shoppingCart {
    @observable shopping = 0; //购物车数量
    @observable goods = null; //商品信息
    @observable goodsType = null; //商品信息
    @observable contrastSKU = ""; //商品信息
    @observable shoppingSKUModal = false; //购物车数量
    @observable classId = ""; //购物车数量
    @observable SKUList=[]; //商品选中的sku
    @observable SKUParamList=[];  //商品所有的属性值
    @observable attribute={
        1:{},//属性1所选的值
        2:{},//属性2所选的值
        3:{},//属性3所选的值
        4:{},//属性4所选的值
        5:{},//属性5所选的值
    };  //商品所有的属性值
    @action addShopping(data){   //加入购物车
        api.axiosPost('addShoppingCart',data).then((res)=>{
            if(res.data.code == 1){
                message.success(res.data.msg);
                this.getShoppingNumber();
            }else{
                message.error(res.data.msg);
            }
        })
    };
    @action getShoppingNumber(){ //获取购物车数量
        api.axiosPost("getShoppingCartCount").then((res)=>{
            if(res.data.code == 1){
                this.shopping = res.data.data.count;
            }
        })
    }
    @action removeShopping(){ //删除购物车
        this.shopping -=1;
        if(this.shopping<=0){
            this.shopping = 0;
        }
    }
    @action isShowShopping(isTrue,goodsId,classId,goods,type){
        this.shoppingSKUModal = isTrue;
        this.classId = classId;
        this.goods = goods;
        this.goodsType = type;
        if(type == "jd"){
            this.SKUParamList=[];
        }
        if(isTrue && type!="jd"){
            this.get_product_sku_list(goodsId,classId)
        }
    }
    @action get_product_sku_list(goodsId,classId){
        const data={
            product_id:goodsId,
            class_id:classId
        };
        api.axiosPost("getProductSKUList",data).then((res)=>{
            if(res.data.code == 1){
                this.SKUList = res.data.data.list;
                this.SKUParamList = res.data.data.param[0].data;
                const areProductPrice = res.data.data.list;
                const selectSku = [];
                const attribute={
                    1:{},//属性1所选的值
                    2:{},//属性2所选的值
                    3:{},//属性3所选的值
                    4:{},//属性4所选的值
                    5:{},//属性5所选的值
                };
                //单选框默认选中的数据
                areProductPrice && areProductPrice.map((item)=>{
                    const newSku = ""+item.sku;
                    const pushSku = newSku.substring(7);
                    selectSku.push(pushSku);
                    selectSku.map((itemSku)=>{
                        attribute[1][itemSku.substring(0,2)]=1;
                        attribute[2][itemSku.substring(2,4)]=1;
                        attribute[3][itemSku.substring(4,6)]=1;
                        attribute[4][itemSku.substring(6,8)]=1;
                        attribute[5][itemSku.substring(8)]=1;
                    })
                });
                this.attribute = attribute
            }
        })
    }
    //修改购物车数量
    @action editShoppingNumber(number){
        this.shopping = number;
    }
}
export default shoppingCart