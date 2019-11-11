import { observable, computed, action } from 'mobx';
import { message } from 'antd';
import {axiosPost,axiosGet} from "./../component/axios";

class SearchBus {
    @observable tabsKey="1";

    @action tabsChange=(key)=>{
        this.tabsKey = key;
    }
}
export default SearchBus


