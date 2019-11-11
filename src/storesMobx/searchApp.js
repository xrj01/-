import { observable, computed, action } from 'mobx';
import { message } from 'antd';
import {axiosPost,axiosGet} from "../component/axios";

class SearchApp {
    @observable tabsKey="0";

    @action tabsChange=(key)=>{
        this.tabsKey = key;
    }
}
export default SearchApp


