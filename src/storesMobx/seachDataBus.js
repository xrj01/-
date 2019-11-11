import { observable, computed, action ,toJS } from 'mobx';
import { message } from 'antd';
import api from "./../component/api";

class SeachDataBus {
    @observable serverListData=[];
    @observable serverListTotal=0;
    @observable page_number=1;
    @observable spinning=false;
    @observable isNull=false;
    @observable searchValue = ''


    @action getSearchList(value,page_number=1,page_size=20){
        this.spinning = true;
        const data={
            name:value,
            page_number,
            page_size
        };
        this.searchValue = value;
        api.axiosPost("getSearchListData",data).then((res)=>{
            if(res.data.code == 1){
                const list = res.data.data.list;
                const type = res.data.data.type;
                if(type == "jd"){
                    list.map((item,index)=>{
                        item.class_id = item.product_id;
                        item.id = item.product_id;
                        item.merchant_id = item.product_id;
                        item.price = item.anmro_price;
                        item.type = "jd"
                    })
                }
                this.serverListData=list;
                this.serverListTotal=res.data.data.total_row;
                this.page_number=res.data.data.page_number;
            }else{
                message.error(res.data.msg)
            }
            this.spinning = false;
            this.isNull = true;
        })
    }


    // @action exportInputer_data(){   // ← 调用时返回输入值
    //     return this.inputer_data
    // };



}

export default SeachDataBus

