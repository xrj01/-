import { observable, computed, action ,toJS } from 'mobx';
import { message } from 'antd';
import {axiosPost,axiosGet} from "../component/axios";

class Login_type {
    @observable type=0; // ← 定义默认
   
    @action setType(value){   // ← 一共有多少页
        this.type = value;
    };
}

export default Login_type