import React from "react";
import {Input,Button,Row,Col,Modal} from "antd";
import api from "./../../component/api";
import "./index.scss";
export default class SwitchAdd extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            addressList : [],
            selectAddressId:""
        }
    }
    //隐藏弹出层
    hideModal=()=>{
        this.props.isShowModal("switchAddModal",false)
    };
    //获取收货地址列表
    getAddressList=(id)=>{
        api.axiosPost("addressList").then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    addressList:res.data.data,
                    selectAddressId:id
                })
            }
        })
    };
    //切换地址
    switchAddress=(item)=>{
        this.props.switchAddress(item);
        this.props.isShowModal("switchAddModal",false);
    };
    render(){
        const {addressList,selectAddressId} = this.state;
        return(
            <Modal
                visible={this.props.switchAddModal}
                footer={null}
                onCancel={this.hideModal}
                className='modal'
                title='切换收货地址'
                width={550}
                maskClosable={false}
            >
                <div className="switch-adds-modal">

                    {
                        addressList && addressList.length > 0 && addressList.map((item)=>(
                            <div className={selectAddressId == item.id ? "switch-adds-list switch-adds-list-active" : "switch-adds-list"} key={item.id} onClick={()=>{this.switchAddress(item)}}>
                                <div>
                                    <span>收货人：</span>
                                    <p>{item.consignee}</p>
                                    {
                                        item.state == 0 && <b>默认地址</b>
                                    }
                                </div>
                                <div>
                                    <span>联系方式：</span>
                                    <p>{item.phone}</p>
                                </div>
                                <div>
                                    <span>收货地址：</span>
                                    <p>{item.address_1}{item.address_2}{item.address_3}{item.address_info}</p>
                                </div>
                            </div>
                        ))
                    }
                    {
                        addressList && addressList.length == 0 && <p style={{textAlign:"center"}}>还没有收货地址，去添加一个收货地址吧</p>
                    }
                </div>
            </Modal>
        )
    }

}