import { observable, computed, action ,toJS } from 'mobx';
import { message } from 'antd';
import {axiosPost,axiosGet} from "../component/axios";

class ClassList_page_Bus {
    @observable page_data=1; // ← 定义默认页数
    @observable page_total=100; // ← 定义默认多少页

    @action getPage_num(value){   // ← 计算第多少页
        this.page_data = value;
        // const newData = (toJS(this.getPage_num,Number));
    };
    @action getPage_todal(value){   // ← 一共有多少页
        this.page_total = value;
    };
}

export default ClassList_page_Bus