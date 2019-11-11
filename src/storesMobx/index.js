import { observable, computed, action } from 'mobx';
import { message } from 'antd';
import shoppingCart from "./shopping";
import contrast from "./contrast";
import searchBus from "./searchBus";
import seachDataBus from "./seachDataBus"
import ClassListBody_bus from "./classListBody_bus"
import ClassList_page_Bus from "./classList_page";
import shoppingCarList from "./shoppingCarList";
import login_type from "./login_type";
import searchApp from "./searchApp";
class AppStort {
    constructor(){
        this.shoppingCart = new shoppingCart(this);
        this.contrast = new contrast(this);
        this.searchBus = new searchBus(this);
        this.seachDataBus = new seachDataBus(this);
        this.ClassListBody_bus = new ClassListBody_bus(this);
        this.ClassList_page_Bus = new ClassList_page_Bus(this);
        this.shoppingCarList = new shoppingCarList(this);
        this.login_type = new login_type(this);
        this.searchApp = new searchApp(this);
    }
}

export default AppStort