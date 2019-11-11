import React from "react";
import { Route, Switch, Link } from 'react-router-dom';
import { Tabs } from "antd";
import OrderList from "./orderList";
import ChildorderList from "./childOrderList";
import "./index.scss";
import { inject, observer } from "mobx-react";
const { TabPane } = Tabs;
@inject("store")
@observer
class MyOrder extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    tabsChange = (activeKey) => {
        const { store } = this.props;
        store.searchBus.tabsChange(activeKey)
    };

    // 切换订单状态
    swatchKey = (key) => {
        switch (key) {
            case '1':
                this.orderList1 && this.orderList1.getOrderList(true)
                break;
            case '2':
                this.orderList2 && this.orderList2.getOrderList(true)
                break;
            case '3':
                this.orderList3 && this.orderList3.getOrderList(true)
                break;
            case '4':
                this.orderList4 && this.orderList4.getOrderList(true)
                break;
            case '5':
                this.orderList5 && this.orderList5.getOrderList(true)
                break;
            case '6':
                this.orderList6 && this.orderList6.getOrderList(true)
                break;
            case '7':
                this.orderList7 && this.orderList7.getOrderList(true)
                break;
            case '8':
                this.orderList8 && this.orderList8.getOrderList(true)
                break;
            case '9':
                this.orderList9 && this.orderList9.getOrderList(true)
                break;
        }
    }

    render() {
        const { store } = this.props;
        const tabsKey = store.searchBus.tabsKey;
        return (
            <div className='my-order-warp'>
                <Tabs defaultActiveKey={tabsKey} onChange={this.tabsChange} onTabClick={(key) => { this.swatchKey(key) }}>
                    <TabPane tab="全部订单" key="1">
                        <OrderList state={-101} ref={(ref) => { this.orderList1 = ref }} />
                    </TabPane>
                    <TabPane tab="待提交" key="2">
                        <OrderList state={0} ref={(ref) => { this.orderList2 = ref }} />
                    </TabPane>
                    <TabPane tab="待付款" key="3">
                        <OrderList state={1} ref={(ref) => { this.orderList3 = ref }} />
                    </TabPane>
                    <TabPane tab="待发货" key="4">
                        <ChildorderList state={2} ref={(ref) => { this.orderList4 = ref }} />
                    </TabPane>
                    <TabPane tab="待收货" key="5">
                        <ChildorderList state={3} ref={(ref) => { this.orderList5 = ref }} />
                    </TabPane>
                    <TabPane tab="已完成" key="6">
                        <ChildorderList state={4} ref={(ref) => { this.orderList6 = ref }} />
                    </TabPane>
                    <TabPane tab="已取消" key="7">
                        <OrderList state={-1} ref={(ref) => { this.orderList7 = ref }} />
                    </TabPane>
                    <TabPane tab="已驳回" key="8">
                        <OrderList state={-3} ref={(ref) => { this.orderList8 = ref }} />
                    </TabPane>
                    <TabPane tab="已关闭" key="9">
                        <OrderList state={-2} ref={(ref) => { this.orderList9 = ref }} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default MyOrder