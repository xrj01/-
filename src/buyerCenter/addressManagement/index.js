import React from "react";
import {Button,message,Modal} from "antd";
import AddModal from "./addModal";
import api from "./../../component/api";
import Null from "./../../components/noList/nullMerchants";
import "./index.scss"
export default class AddressManagement extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state={
            display:false,
            addressList:[],
            isEdit:"add",
            editAddresData:{},
            isNull:false
        };
        this.addModalRef = React.createRef();
    }
    isShowModal=(isTrue,isEdit,id)=>{
        this.setState({
            display:isTrue,
            isEdit
        },()=>{
            if(isTrue && isEdit=="edit"){
                this.getAddressById(id);
            }
            if(isTrue && isEdit=="add"){
                this.addModalRef.current.getArea();
            }
        });
        if(!isTrue){
            this.setState({editAddresData:{}})
        }
    };
    componentDidMount() {
        this.getAddressList()
    }
    //获取地址列表
    getAddressList=()=>{
        api.axiosPost("addressList").then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    addressList:res.data.data,
                    isNull:true
                })
            }else{
                message.error(res.data.msg)
            }
        })
    };
    //删除地址
    delAddress=(id)=>{
        const _this = this;
        Modal.confirm({
            title: '删除当前收货地址?',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                const data={ id };
                api.axiosPost("delAddress",data).then((res)=>{
                    if(res.data.code == 1){
                        message.success(res.data.msg);
                        _this.getAddressList();
                    }else{
                        message.error(res.data.msg)
                    }
                })
            }
        });
    };
    //设置默认地址
    setDefaultAddress=(id)=>{
        const _this = this;
        Modal.confirm({
            title: '设置当前收货地址为默认?',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
                const data={id};
                api.axiosPost("setDefaultAddress",data).then((res)=>{
                    if(res.data.code == 1){
                        message.success(res.data.msg);
                        _this.getAddressList();
                    }else{
                        message.error(res.data.msg)
                    }
                })
            }
        });
    };
    //获取收货地址详情
    getAddressById=(id)=>{
        const data = {id};
        api.axiosPost("getAddressById",data).then((res)=>{
            if(res.data.code == 1){
                this.setState({
                    editAddresData:res.data.data
                },()=>{
                    this.addModalRef.current.getRegionData(res.data.data,id);
                });
            }
        })
    };
    render(){
        const {display,addressList,isEdit,editAddresData,isNull} = this.state;
        const modalData={
            display,
            isShowModal:this.isShowModal,
            getAddressList:this.getAddressList,
            isEdit,
            editAddresData
        };
        return(
            <div className='user-address-box'>
                <div className='user-address-head'>
                    <p>收货地址</p>
                    <Button onClick={()=>{this.isShowModal(true,"add")}}>新增收货地址</Button>
                </div>
                {
                    addressList && addressList.map((item,index)=>{
                        return(
                            <div className="user-address-list" key={item.id}>
                                <div>
                                    <p>
                                        收货人：{item.consignee}
                                    </p>
                                    {
                                        item.state == 0 ?
                                            <Button type='primary'>默认地址</Button> :
                                            <Button onClick={()=>{this.setDefaultAddress(item.id)}}>设为默认</Button>
                                    }

                                </div>
                                <div>
                                    <p>
                                        联系电话：{item.phone}
                                    </p>
                                    <span onClick={()=>{this.isShowModal(true,"edit",item.id)}}>编辑</span>
                                </div>
                                <div>
                                    <p>
                                        <span>收货地址：</span>
                                        <span>{item.address_1}{item.address_2}{item.address_3}{item.address_info}</span>
                                    </p>
                                    <span onClick={()=>this.delAddress(item.id)}>删除</span>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    addressList.length == 0 && isNull && <Null type="add" title="没有收货地址,去添加一个吧"/>
                }
                <AddModal wrappedComponentRef={this.addModalRef} {...modalData}/>

            </div>
        )
    }

}