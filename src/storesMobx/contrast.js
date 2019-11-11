import { observable, computed, action } from 'mobx';
import { message } from 'antd';
import api from "./../component/api";
class contrast {
    @observable skuModal = false;
    @observable loadingButton = false;
    @observable compareBarModal = false;
    @observable compareBarModalList = [];
    @observable classId = "";
    @observable exportId = "";
    @observable contrast = [];
    @observable contrastSKU = "";
    @observable goods = null;
    @observable goodsType = "";
    @observable contrastLength = 0;
    @observable domPosition = -300;
    @observable SKUList=[]; //商品选中的sku
    @observable SKUParamList=[];  //商品所有的属性值
    @observable attribute={
        1:{},//属性1所选的值
        2:{},//属性2所选的值
        3:{},//属性3所选的值
        4:{},//属性4所选的值
        5:{},//属性5所选的值
    };  //商品所有的属性值
    //添加数据
    @action addContrast(goods){
        const goodsList=[];
        let isPush = true;
        this.isShowContrastDom(true);
        this.contrast.map((item,index)=>{
            goodsList.push(item);
            if(item.sku == goods.sku && goods.id == item.id){
                message.error("该商品规格已添加");
                isPush = false;
            }
        });
        if(!isPush) return false;
        if(goods){
            goodsList.push(goods);
            this.saveindexedDB(JSON.stringify(goodsList),"add");
        }
    }
    //判断是否显示对比栏
    @action isShowContrastDom(isTrue){
        if(isTrue){
            this.domPosition = 0;
        }else{
            this.domPosition = -300;
        }
    }
    //移除对比数据
    @action removeContrast(goods){
        const contrast = this.contrast.filter((item,index)=>{
            if(item.id == goods.id && item.sku == goods.sku){

            }else{
                return item;
            }
        });
        if(!contrast.length){
            this.domPosition = -300;
        }
        this.saveindexedDB(JSON.stringify(contrast),"add");
    }
    //清空对比栏
    @action deleteContrast(){
        this.saveindexedDB('[]',"add");
        this.domPosition = -300
    }
    //创建数据库
    @action saveindexedDB (data,type) {
        let dbName = "customersList";
        var request = indexedDB.open(dbName);
        request.onerror =  (e) => {};
        request.onupgradeneeded = (e) => {
            this.db = e.target.result;
            let objectStore
            if (!this.db.objectStoreNames.contains('customers')) {
                objectStore = this.db.createObjectStore('customers', { keyPath: 'list', autoIncrement:true});
            }
        };
        request.onsuccess = (e) => {
            this.db = e.target.result;
            if(type == "add"){
                this.updateDBvalue(data,1);
            }else{
                this.getDBValue();
            }
        };
        request.onerror = (e) => {
            console.log("数据库打开失败");
        }
    }
    //更新值
    @action updateDBvalue (data) {
        const _this = this;
        let tx = this.db.transaction('customers', 'readwrite');
        let store = tx.objectStore('customers');
        let req = store.get(1);
        req.onsuccess = (e) => {
            let degData = e.target.result;
            //没有值时添加值，有值时更新值
            if (!degData) {
                store.add({contrastList:data});
            } else {
                degData.contrastList = data;
                store.put(degData);
            }
            _this.getDBValue()
        }
    }
    //获取对比数据
    @action getDBValue(){
        const _this = this;
        let tx = this.db.transaction('customers', 'readwrite');
        let store = tx.objectStore('customers');
        let req = store.get(1);
        req.onsuccess = (e) => {
            let degData = e.target.result;
            if (!degData) {
                _this.contrast=[];
                _this.contrastLength = 0;
            } else {
                _this.contrast = JSON.parse(degData.contrastList);
                _this.contrastLength = _this.contrast.length;
            }
        }
    }
    //隐藏显示属性选择框
    @action isShowModal(isTrue,goodsId,classId,goods,type){
        this.skuModal = isTrue;
        this.classId = classId;
        this.goods = goods ? goods : null;
        this.goodsType = type;
        if(type == "jd"){
            this.SKUParamList=[]
        }
        if(isTrue && type!=="jd"){
            this.get_product_sku_list(goodsId,classId)
        }
    }
    //获取商品sku
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
    //更新对比商品sku
    @action updateGoodsSKU(goods){
        this.goods = goods;
    }
    //点击比价记录
    @action addPriceRecord(){
        if(this.contrast.length<2){
            message.error('至少选择两条商品进行比较');
            return false;
        }
        this.loadingButton = true;
        const compare_info = [];
        this.contrast.map((item)=>{
            compare_info.push({
                product_id:item.id,
                sku:item.sku ? item.sku : item.id
            });
        });
        const data={ compare_info:JSON.stringify(compare_info) };
        api.axiosPost("saveCompareInfo",data).then((res)=>{
            if(res.data.code == 1){
                this.getCompareInfo();
            }
        })
    }

    @action getCompareInfo(){
        api.axiosPost("getCompareInfo").then((res)=>{
            if(res.data.code == 1){
                res.data.data.list.map((item,index)=>{
                    item.key = item.sku;
                    item.number = 1;
                });
                this.compareBarModalList = res.data.data.list;
                this.exportId = res.data.data.id;
                this.loadingButton = false;
                this.isShowCompareBarModal(true);
            }
        })
    }

    @action isShowCompareBarModal(isTrue){
        this.compareBarModal = isTrue
    }
}
export default contrast