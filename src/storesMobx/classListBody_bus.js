import { observable, computed, action ,toJS } from 'mobx';
import { message } from 'antd';
import {axiosPost,axiosGet} from "./../component/axios";

class ClassListBody_bus {
    @observable getbody_data_data=[]; // ← 定义一个什么都没有输入的默认值

    @action getbody_data(value){   // ← 将用户输入的值放入观察者bus
        this.getbody_data_data = value.data;
        const newData = (toJS(this.getbody_data_data,Array));
    };
}

export default ClassListBody_bus